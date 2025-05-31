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
import { GetBlogDetailDto } from './dto/get-blog-detail.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

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

    let photo: string[] | undefined;

    // 📤 Handle optional file upload
    if (files) {
      const uploaded = await this.fileUploadsService.fileUploads(files);

      // 📁 Use the uploaded photo path (single or from array)
      // photo = uploaded;
      photo = Array.isArray(uploaded) ? uploaded : [uploaded];
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

  public async findAll(
    getBlogDto: GetBlogDetailDto,
  ): Promise<IPagination<BlogDetail>> {
    // Define which fields are searchable
    const searchableFields = ['title'];

    // Define related entities to join (eager loading)
    const relations = ['blog'];
    const selectRelations = [
      'blog.blog_title',
      'blog.thumbnail',
      'blog.blog_tags',
      'blog.reading_time',
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
      repository: this.blogDetailRepository,
    });

    // Handle case when no blogs are found
    if (!teamMember) {
      throw new NotFoundException('No team member data found');
    }

    return teamMember;
  }

  public async findOne(id: string): Promise<BlogDetail> {
    const blog = await this.blogDetailRepository.findOne({
      where: {
        id,
      },
      relations: ['blog'],
      // select: {

      //   blog: {
      //     title: true,
      //   },
      // },
    });
    if (!blog) {
      throw new BadRequestException('No blog  data found');
    }
    return blog;
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

    // let photo;

    // // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    // if (files && blog?.photo?.length) {
    //   blog?.photo?.map(async (ph, index) => {
    //     const img = await this.fileUploadsService.updateFileUploads({
    //       oldFile: ph,
    //       currentFile: files[index],
    //     });
    //     photo?.push(img);
    //   });
    // }

    // 📤 If new file provided and photo does not exist, upload the new file
    // if (files && !blog?.photo?.length) {
    //   photo = await this.fileUploadsService.fileUploads(files);
    // }
    let photo: string[] | undefined;

    // ✅ If files are provided and previous photos exist, update them one by one
    if (files && blog.photo?.length) {
      photo = [];

      for (let index = 0; index < files.length; index++) {
        const oldFile = blog.photo[index];
        const newFile = files[index];

        // If there is a new file at this index, update it
        if (newFile) {
          const updated = await this.fileUploadsService.updateFileUploads({
            oldFile,
            currentFile: newFile,
          });
          photo.push(updated);
        } else if (oldFile) {
          // Keep old image if no new file is provided at this index
          photo.push(oldFile);
        }
      }
    }

    // ✅ If files are provided but there are no old photos, upload new ones
    if (files && !blog.photo?.length) {
      const uploaded = await this.fileUploadsService.fileUploads(files);
      photo = Array.isArray(uploaded) ? uploaded : [uploaded];
    }

    // ✅ If no files are provided, keep existing photos
    if (!files) {
      photo = blog.photo;
    }

    // 📤 If no file provided, keep the existing photo
    updateBlogDetailDto.photo = photo;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(blog, updateBlogDetailDto);

    // 💾 Save the updated entity back to the database
    return await this.blogDetailRepository.save(blog);
  }

  public async remove(id: string): Promise<{ message: string }> {
    // ⚠️ Validate ID presence - required for delete operation
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    try {
      // 🔍 Find existing blogDetail by ID
      const blogDetail = await this.blogDetailRepository.findOneBy({ id });

      // 🛑 Throw error if no matching record is found
      if (!blogDetail) {
        throw new NotFoundException('Blog detail not found');
      }

      // 🗑️ Delete associated files if they exist
      if (blogDetail.photo?.length) {
        for (const file of blogDetail.photo) {
          const deleted = await this.fileUploadsService.deleteFileUploads(file);

          if (!deleted) {
            throw new BadRequestException(
              'Failed to delete associated file: ' + file,
            );
          }
        }
      }

      // 🗑️ Delete the blogDetail record by ID
      await this.blogDetailRepository.delete({ id });

      // 🏁 Return success message
      return {
        message: 'Blog deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete record');
    }
  }
}
