import {
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';

import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { GetBlogDto } from './dto/get-blog.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    @Req() req: Request,
    createBlogDto: CreateBlogDto,
    file?: Express.Multer.File,
  ): Promise<Blog> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a teamMember with the same name already exists
    const existTeamMember = await this.blogRepository.findOne({
      where: { blog_title: createBlogDto.blog_title },
    });

    // ⚠️ Prevent duplicate entries
    if (existTeamMember) {
      throw new UnauthorizedException('Team Member already exist');
    }

    let thumbnail: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded thumbnail path (single or from array)
      thumbnail = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new teamMember entity with user and optional thumbnail
    const teamMember = this.blogRepository.create({
      ...createBlogDto,
      added_by: user_id,
      thumbnail,
      team_member_id: createBlogDto.team_member_id,
      blog_category_id: createBlogDto.blog_category_id,
    });

    // 💾 Persist the entity to the database
    return await this.blogRepository.save(teamMember);
  }

  public async findAll(getBlogDto: GetBlogDto): Promise<IPagination<Blog>> {
    const searchableFields = ['blog_title', 'blog_description', 'blog_tags'];
    // const select = [
    //   'id',
    //   'name',
    //   'slug',
    //   'photo',
    //   'designation_id',
    //   'added_by',
    //   'created_at',
    //   'updated_at',
    // ];
    const relations = ['teamMember', 'blogCategory'];
    // const selectRelations = [
    //   'designation.id',
    //   'designation.name',
    //   'designation.status',
    // ];
    // ✅ Join specified relations

    // Destructure pagination, search, and filters from DTO
    const { limit, page, search, ...filters } = getBlogDto;

    const teamMember = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      // selectRelations,
      repository: this.blogRepository,
    });

    if (!teamMember) {
      throw new NotFoundException('No team member data found');
    }

    return teamMember;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
