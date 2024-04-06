import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';

@Injectable()
export class DayService {
  constructor(private prisma: PrismaService) {}

  async create(createDayDto: CreateDayDto) {
    return this.prisma.day.create({
      data: createDayDto,
    });
  }

  async findOne(id: number) {
    const day = await this.prisma.day.findUnique({
      where: { id },
    });
    if (!day) {
      throw new NotFoundException(`Day with ID ${id} not found`);
    }
    return day;
  }

  async findAll(programId?: number) {
    let params = {};

    if (programId) {
      params = {
        where: {
          programId: Number(programId),
        },
      };
    }
    return this.prisma.day.findMany(params);
  }

  async update(id: number, updateDayDto: UpdateDayDto) {
    return this.prisma.day.update({
      where: { id },
      data: updateDayDto,
    });
  }

  async remove(id: number) {
    return this.prisma.day.delete({
      where: { id },
    });
  }
}
