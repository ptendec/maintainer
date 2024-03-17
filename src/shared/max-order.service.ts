import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type ModelNames = 'stage' | 'exercise';
type PrismaModelFindManyMethod = {
  [K in ModelNames]: (args: any) => Promise<any>;
};

@Injectable()
export class MaxOrderService {
  private modelFindManyMethod: PrismaModelFindManyMethod;

  constructor(private prisma: PrismaService) {
    this.modelFindManyMethod = {
      stage: this.prisma.stage.findMany.bind(this.prisma.stage),
      exercise: this.prisma.exercise.findMany.bind(this.prisma.exercise),
    };
  }

  async findMaxOrder(
    model: ModelNames,
    by: { name: string; value: number },
  ): Promise<number> {
    const maxOrderEntity = await this.modelFindManyMethod[model]({
      where: { [by.name]: by.value },
      orderBy: { order: 'desc' },
      take: 1,
    });

    return maxOrderEntity.length > 0 ? maxOrderEntity[0].order : 0;
  }
}
