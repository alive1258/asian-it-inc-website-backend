import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}
  public async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  public async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find();
  }

  public async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  public async update(
    @Param('id', ParseIntPipe) id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    // Validate the ID
    if (!id) {
      throw new BadRequestException('User ID is required.');
    }

    // Fetch the existing attendance
    const attendance = await this.findOne(id);

    // Check if the attendance exists
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    // Update the attendance properties using Object.assign
    Object.assign(attendance, updateAttendanceDto);

    // Save and return the updated attendance
    return await this.attendanceRepository.save(attendance);
  }

  public async remove(id: number): Promise<{ message: string }> {
    const attendance = await this.findOne(id); // Ensures entity exists
    if (!attendance) {
      throw new NotFoundException(`attendance with ID ${id} not found`);
    }
    await this.attendanceRepository.remove(attendance); // Triggers hooks
    return { message: 'attendance deleted successfully' };
  }
}
