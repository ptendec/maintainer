import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { MaxOrderService } from 'src/shared/max-order.service';
import { CreateStageDto } from './dto/create.dto';
import { UpdateStageDto } from './dto/update.dto';

@Injectable()
export class StageService {
  constructor(
    private prisma: PrismaService,
    private maxOrderService: MaxOrderService,
  ) {}

  async create(createStageDto: CreateStageDto) {
    const maxOrder = await this.maxOrderService.findMaxOrder('stage', {
      name: 'dayId',
      value: createStageDto.dayId,
    });

    return this.prisma.stage.create({
      data: {
        ...createStageDto,
        order: maxOrder + 1,
      },
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

  async findAll(dayId?: number) {
    let params = {};

    if (dayId) {
      params = {
        where: {
          dayId: Number(dayId),
        },
      };
    }

    return this.prisma.stage.findMany(params);
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
