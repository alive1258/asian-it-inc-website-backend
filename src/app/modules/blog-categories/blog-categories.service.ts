import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog-category.entity';
import { Repository } from 'typeorm';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetBlogCategoryDto } from './dto/get-blog-category.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class BlogCategoriesService {
  constructor(
    /**
     * Inject repository
     */
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepository: Repository<BlogCategory>,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createBlogCategoryDto: CreateBlogCategoryDto,
  ): Promise<BlogCategory> {
    const user_id = req?.user?.sub;
    // 1. Check if user is authenticated
    if (!user_id) {
      throw new UnauthorizedException(
        'You must be signed in to access this resource.',
      );
    }
    // 2. Check for duplicate record
    const existingData = await this.blogCategoryRepository.findOne({
      where: {
        name: createBlogCategoryDto.name,
      },
    });
    if (existingData) {
      throw new BadRequestException(
        'A record with the same data already exists.',
      );
    }

    // 3. Create and save the new entry
    const newEntry = this.blogCategoryRepository.create({
      ...createBlogCategoryDto,
      added_by: user_id,
    });
    return this.blogCategoryRepository.save(newEntry);
  }
  public async findAll(
    getBlogCategoryDto: GetBlogCategoryDto,
  ): Promise<IPagination<BlogCategory>> {
    // Fields that can be searched by keyword
    const searchableFields = ['name'];

    // Extract pagination and search params
    const { limit, page, search, ...filters } = getBlogCategoryDto;

    // Query database using DataQueryService abstraction
    const blogCategory = this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      repository: this.blogCategoryRepository,
    });
    // check if collaborate is empty
    if (!blogCategory) {
      throw new BadRequestException('No blogCategory  data found');
    }
    return blogCategory;
  }

  // ✅ Public GET endpoint to retrieve a single blogCategory entry by ID
  public async findOne(id: string): Promise<BlogCategory> {
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!blogCategory) {
      throw new BadRequestException('No blogCategory  data found');
    }
    return blogCategory;
  }

  // ✅ Public PATCH endpoint to update a blogCategory entry by ID
  public async update(
    id: string,
    updateBlogCategoryDto: UpdateBlogCategoryDto,
  ): Promise<BlogCategory> {
    // 1. Validate that the ID parameter is provided
    if (!id) {
      throw new BadRequestException('blogCategory Id is required');
    }

    // 2. Find the existing blogCategory entity by ID
    const blogCategory = await this.blogCategoryRepository.findOneBy({ id });

    // 3. If no record is found, throw an error indicating the resource does not exist
    if (!blogCategory) {
      throw new BadRequestException('No data found');
    }

    // 4. Merge updated fields into the existing entity
    Object.assign(blogCategory, updateBlogCategoryDto);

    // 5. Save and return the updated entity
    return this.blogCategoryRepository.save(blogCategory);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('blogCategory ID is required');
    }
    const blogCategory = await this.findOne(id);

    await this.blogCategoryRepository.remove(blogCategory);

    return { message: 'blogCategory deleted successfully' };
  }
}
