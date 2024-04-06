import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { MaxOrderService } from 'src/shared/max-order.service';
import { CreateExerciseDto } from './dto/create.dto';
import { UpdateExerciseDto } from './dto/update.dto';

@Injectable()
export class ExerciseService {
  constructor(
    private prisma: PrismaService,
    private maxOrderService: MaxOrderService,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    const maxOrder = await this.maxOrderService.findMaxOrder('exercise', {
      name: 'stageId',
      value: createExerciseDto.stageId,
    });
    return this.prisma.exercise.create({
      data: {
        ...createExerciseDto,
        order: maxOrder + 1,
      },
    });
  }

  async findOne(id: number) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async findAll(stageId?: string) {
    let params = {};

    if (stageId) {
      params = {
        where: {
          stageId: Number(stageId),
        },
      };
    }
    return this.prisma.exercise.findMany(params);
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return this.prisma.exercise.update({
      where: { id },
      data: updateExerciseDto,
    });
  }

  async remove(id: number) {
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
