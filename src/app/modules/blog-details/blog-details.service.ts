import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogDetail } from './entities/blog-detail.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { UpdateBlogCategoryDto } from './../blog-categories/dto/update-blog-category.dto';

@Injectable()
export class BlogDetailsService {
  constructor(
    @InjectRepository(BlogDetail)
    private readonly blogDetailRepository: Repository<BlogDetail>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    @Req() req: Request,
    createBlogDetailDto: CreateBlogDetailDto,
    files?: Express.Multer.File[],
  ): Promise<any> {
    // ✅ Extract authenticated user ID from request object
    const user_id = req?.user?.sub;

    // 🔐 Guard clause: Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔎 Check if a teamMember with the same name already exists
    const existTeamMember = await this.blogDetailRepository.findOne({
      where: { title: createBlogDetailDto.title },
    });

    // ⚠️ Prevent duplicate entries
    if (existTeamMember) {
      throw new UnauthorizedException('Blog Detail already exist');
    }

    let photo;

    // 📤 Handle optional file upload
    if (files) {
      const uploaded = await this.fileUploadsService.fileUploads(files);
      console.log(uploaded, 'uploaded.........');
      // 📁 Use the uploaded photo path (single or from array)
      photo = uploaded;
    }
    // 🏗️ Create a new teamMember entity with user and optional photo
    const teamMember = this.blogDetailRepository.create({
      ...createBlogDetailDto,
      added_by: user_id,
      photo,
      blog_id: createBlogDetailDto.blog_id,
    });

    // 💾 Persist the entity to the database
    return await this.blogDetailRepository.save(teamMember);
  }

  findAll() {
    return `This action returns all blogDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogDetail`;
  }

  public async update(
    id: string,
    updateBlogDetailDto: UpdateBlogDetailDto,
    files?: Express.Multer.File[],
  ): Promise<BlogDetail> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Blog details ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const blog = await this.blogDetailRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!blog) {
      throw new NotFoundException('blog details not found');
    }

    let photo;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (files && blog?.photo?.length) {
      blog?.photo?.map(async (ph, index) => {
        const img = await this.fileUploadsService.updateFileUploads({
          oldFile: ph,
          currentFile: files[index],
        });
        photo?.push(img);
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (files && !blog?.photo?.length) {
      photo = await this.fileUploadsService.fileUploads(files);
    }

    // 📤 If no file provided, keep the existing photo
    updateBlogDetailDto.photo = photo;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(blog, updateBlogDetailDto);

    // 💾 Save the updated entity back to the database
    return await this.blogDetailRepository.save(blog);
  }

  remove(id: number) {
    return `This action removes a #${id} blogDetail`;
  }
}
