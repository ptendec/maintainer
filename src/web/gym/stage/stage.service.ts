import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';

@Injectable()
export class StageService {
  constructor(private prisma: PrismaService) {}

  async create(createStageDto: CreateStageDto) {
    return this.prisma.stage.create({
      data: createStageDto,
    });
  }

  async findOne(id: number) {
    const stage = await this.prisma.stage.findUnique({
      where: { id },
    });
    if (!stage) {
      throw new NotFoundException(`Stage with ID ${id} not found`);
    }
    return stage;
  }

  async findAll() {
    return this.prisma.stage.findMany();
  }

  async update(id: number, updateStageDto: UpdateStageDto) {
    return this.prisma.stage.update({
      where: { id },
      data: updateStageDto,
    });
  }

  async remove(id: number) {
    return this.prisma.stage.delete({
      where: { id },
    });
  }
}
