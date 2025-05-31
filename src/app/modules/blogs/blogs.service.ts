import {
  BadRequestException,
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

    // 🔎 Check if a existBlogTitle with the same name already exists
    const existBlogTitle = await this.blogRepository.findOne({
      where: { blog_title: createBlogDto.blog_title },
    });

    // ⚠️ Prevent duplicate entries
    if (existBlogTitle) {
      throw new UnauthorizedException('Blog Title already exist');
    }

    let thumbnail: string | undefined;

    // 📤 Handle optional file upload
    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      // 📁 Use the uploaded thumbnail path (single or from array)
      thumbnail = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    }
    // 🏗️ Create a new existBlogTitle entity with user and optional thumbnail
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
    // Define which fields are searchable
    const searchableFields = ['blog_title', 'blog_description', 'blog_tags'];

    // Define related entities to join (eager loading)
    const relations = ['teamMember', 'teamMember.designation', 'blogCategory'];
    const selectRelations = [
      'teamMember.name',
      'teamMember.photo',
      'teamMember_designation.name',
      'teamMember_designation.status',
    ];

    // Destructure pagination, search term, and other filter fields from DTO
    const { limit, page, search, ...filters } = getBlogDto;

    // Query the database using the dataQueryService
    const teamMember = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.blogRepository,
    });

    // Handle case when no blogs are found
    if (!teamMember) {
      throw new NotFoundException('No team member data found');
    }

    return teamMember;
  }

  public async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
      relations: ['teamMember', 'teamMember.designation', 'blogCategory'],
      select: {
        teamMember: {
          name: true,
          photo: true,
          designation: {
            name: true,
          },
        },
        blogCategory: {
          name: true,
        },
      },
    });
    if (!blog) {
      throw new BadRequestException('No blog  data found');
    }
    return blog;
  }

  public async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ): Promise<Blog> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('Blog ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const blog = await this.blogRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    let thumbnail: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && blog.thumbnail) {
      thumbnail = await this.fileUploadsService.updateFileUploads({
        oldFile: blog.thumbnail,
        currentFile: file,
      });
    }

    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !blog.thumbnail) {
      thumbnail = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updateBlogDto.thumbnail = thumbnail as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(blog, updateBlogDto);

    // 💾 Save the updated entity back to the database
    return await this.blogRepository.save(blog);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      // 🔍 Find existing teamMember by ID
      const blog = await this.blogRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      // 🗑️ Delete the associated file if it exists
      if (blog.thumbnail) {
        const deleteFile = await this.fileUploadsService.deleteFileUploads(
          blog.thumbnail,
        );

        // 🛑 Throw error if file deletion fails
        if (!deleteFile) {
          throw new BadRequestException('Failed to delete associated file');
        }
      }

      // 🗑️ Delete the blog record from the database
      await this.blogRepository.delete(blog);

      // 🏁 Return success message
      return {
        message: 'Blog deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
