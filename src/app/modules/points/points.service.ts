import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Points } from './entities/point.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private readonly pointRepository: Repository<Points>,
  ) {}
  public async create(createPointDto: CreatePointDto): Promise<Points> {
    const point = this.pointRepository.create(createPointDto);
    return await this.pointRepository.save(point);
  }

  public async findAll() {
    return await this.pointRepository.find();
  }

  public async findOne(id: number): Promise<Points> {
    const points = await this.pointRepository.findOne({ where: { id } });
    if (!points) {
      throw new NotFoundException('Points not found');
    }
    return points;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updatePointDto: UpdatePointDto,
  ) {
    // validate id
    if (!id) {
      throw new BadRequestException('points ID is required.');
    }
    // Fetch the existing points
    const point = await this.findOne(id);

    // Check if the points exists
    if (!point) {
      throw new NotFoundException('Points not found');
    }
    // Update the points properties using Object.assign
    Object.assign(point, updatePointDto);

    // Save and return the updated points
    return await this.pointRepository.save(point);
  }

  /** Remove a points by ID */
  public async remove(id: number): Promise<{ message: string }> {
    const points = await this.findOne(id);
    if (!points) {
      throw new NotFoundException('Points not found');
    }
    await this.pointRepository.delete(id);
    return { message: 'Points deleted successfully' };
  }
}
