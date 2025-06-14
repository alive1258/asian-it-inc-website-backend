import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Repository } from 'typeorm';
import { FileUploadsService } from 'src/app/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/app/common/data-query/data-query.service';
import { Request } from 'express';
import { GetPortfolioDto } from './dto/get-portfolio.dto';
import { IPagination } from 'src/app/common/data-query/pagination.interface';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  public async create(
    req: Request,
    createPortfolioDto: CreatePortfolioDto,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    // ✅ Extract authenticated user ID
    const user_id = req?.user?.sub;

    // 🔐 Validate user
    if (!user_id) {
      throw new UnauthorizedException('User not found');
    }

    // 🔍 Check for duplicate portfolio
    const existPortfolio = await this.portfolioRepository.findOne({
      where: { name: createPortfolioDto.name },
    });

    if (existPortfolio) {
      throw new UnauthorizedException(
        'Portfolio with this name already exists',
      );
    }

    // 🖼️ Handle optional file upload
    let company_logo: string | undefined;
    let thumbnail: string | undefined;
    let banner: string | undefined;

    if (file) {
      const uploaded = await this.fileUploadsService.fileUploads(file);
      const filePath = Array.isArray(uploaded) ? uploaded[0] : uploaded;

      // You might want to separate the upload logic if you expect different files for logo/thumbnail/banner
      company_logo = filePath;
      thumbnail = filePath;
      banner = filePath;
    }

    // 🏗️ Create and save new portfolio
    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      added_by: user_id,
      company_logo,
      thumbnail,
      banner,
    });

    return this.portfolioRepository.save(portfolio);
  }

  public async findAll(
    getPortfolioDto: GetPortfolioDto,
  ): Promise<IPagination<Portfolio>> {
    const searchableFields = [
      'name',
      'duration',
      'description',
      'company_name',
    ];
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
    const relations = ['service'];
    const selectRelations = ['service.name'];
    // ✅ Join specified relations

    // Destructure pagination, search, and filters from DTO
    const { limit, page, search, ...filters } = getPortfolioDto;

    const portfolio = await this.dataQueryService.dataQuery({
      paginationQuery: { limit, page, search, filters },
      searchableFields,
      relations,
      // select,
      selectRelations,
      repository: this.portfolioRepository,
    });

    if (!portfolio) {
      throw new NotFoundException('No portfolio data found');
    }

    return portfolio;
  }

  public async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: {
        id,
      },
      relations: ['service'],
      select: {
        service: {
          name: true,
        },
      },
    });
    if (!portfolio) {
      throw new BadRequestException('No portfolio  data found');
    }
    return portfolio;
  }

  public async update(
    id: string,
    updatePortfolioDto: UpdatePortfolioDto,
    file?: Express.Multer.File,
  ): Promise<Portfolio> {
    // ⚠️ Validate ID presence - required for update operation
    if (!id) {
      throw new BadRequestException('portfolio ID is required');
    }

    // 🔍 Find existing teamMember by ID
    const portfolio = await this.portfolioRepository.findOneBy({ id });
    // 🛑 Throw error if no matching record is found
    if (!portfolio) {
      throw new NotFoundException('portfolio not found');
    }

    // 🖼️ Handle optional file upload
    let company_logo: string | string[] | undefined;
    let thumbnail: string | string[] | undefined;
    let banner: string | string[] | undefined;

    // 📤 If new file provided and photo exists, update the file storageHandle file upload if a new file is provided
    if (file && portfolio.thumbnail) {
      thumbnail = await this.fileUploadsService.updateFileUploads({
        oldFile: portfolio.thumbnail,
        currentFile: file,
      });
    }
    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !portfolio.thumbnail) {
      thumbnail = await this.fileUploadsService.fileUploads(file);
    }

    if (file && portfolio.company_logo) {
      company_logo = await this.fileUploadsService.updateFileUploads({
        oldFile: portfolio.company_logo,
        currentFile: file,
      });
    }
    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !portfolio.company_logo) {
      company_logo = await this.fileUploadsService.fileUploads(file);
    }

    if (file && portfolio.banner) {
      banner = await this.fileUploadsService.updateFileUploads({
        oldFile: portfolio.banner,
        currentFile: file,
      });
    }
    // 📤 If new file provided and photo does not exist, upload the new file
    if (file && !portfolio.banner) {
      banner = await this.fileUploadsService.fileUploads(file);
    }

    // 📤 If no file provided, keep the existing photo
    updatePortfolioDto.thumbnail = thumbnail as string | undefined;
    updatePortfolioDto.company_logo = company_logo as string | undefined;
    updatePortfolioDto.banner = banner as string | undefined;

    // 🏗️ Merge the existing entity with the new data
    Object.assign(portfolio, updatePortfolioDto);

    // 💾 Save the updated entity back to the database
    return await this.portfolioRepository.save(portfolio);
  }

  public async remove(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Portfolio ID is required');
    }

    const portfolio = await this.portfolioRepository.findOneBy({ id });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    // 🗑️ Clean up associated files (if they exist)
    const filesToDelete = [
      portfolio.thumbnail,
      portfolio.company_logo,
      portfolio.banner,
    ];

    for (const filePath of filesToDelete) {
      if (filePath) {
        const deleted =
          await this.fileUploadsService.deleteFileUploads(filePath);
        if (!deleted) {
          throw new BadRequestException(`Failed to delete file: ${filePath}`);
        }
      }
    }

    // 🗑️ Delete the portfolio record
    await this.portfolioRepository.delete(id);

    return {
      message: 'Portfolio deleted successfully',
    };
  }

  // public async remove(id: string): Promise<{ message: string }> {
  //   // ⚠️ Validate ID presence - required for delete operation
  //   if (!id) {
  //     throw new BadRequestException('ID is required');
  //   }
  //   try {
  //     // 🔍 Find existing portfolio by ID
  //     const portfolio = await this.portfolioRepository.findOneBy({ id });

  //     // 🛑 Throw error if no matching record is found
  //     if (!portfolio) {
  //       throw new NotFoundException('Team Member not found');
  //     }

  //     // 🗑️ Delete the associated file if it exists
  //     if (portfolio.thumbnail) {
  //       const deleteFile = await this.fileUploadsService.deleteFileUploads(
  //         portfolio.thumbnail,
  //       );

  //       // 🛑 Throw error if file deletion fails
  //       if (!deleteFile) {
  //         throw new BadRequestException('Failed to delete associated file');
  //       }
  //     }
  //     // 🗑️ Delete the associated file if it exists
  //     if (portfolio.company_logo) {
  //       const deleteFile = await this.fileUploadsService.deleteFileUploads(
  //         portfolio.company_logo,
  //       );

  //       // 🛑 Throw error if file deletion fails
  //       if (!deleteFile) {
  //         throw new BadRequestException('Failed to delete associated file');
  //       }
  //     }
  //     // 🗑️ Delete the associated file if it exists
  //     if (portfolio.banner) {
  //       const deleteFile = await this.fileUploadsService.deleteFileUploads(
  //         portfolio.banner,
  //       );

  //       // 🛑 Throw error if file deletion fails
  //       if (!deleteFile) {
  //         throw new BadRequestException('Failed to delete associated file');
  //       }
  //     }

  //     // 🗑️ Delete the portfolio record from the database
  //     await this.portfolioRepository.delete(portfolio);

  //     // 🏁 Return success message
  //     return {
  //       message: 'portfolio deleted successfully',
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message || 'Failed to delete record');
  //   }
  // }
}
