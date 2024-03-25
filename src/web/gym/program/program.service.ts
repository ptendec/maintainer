import { Injectable } from '@nestjs/common';
import { Prisma, Program } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProgramDto, userId: number): Promise<Program> {
    return this.prisma.program.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  findAll(): Promise<Program[]> {
    return this.prisma.program.findMany();
  }

  findOne(programId: number): Promise<Program | null> {
    return this.prisma.program.findUnique({
      where: { id: programId },
    });
  }

  update(programId: number, data: Prisma.ProgramUpdateInput): Promise<Program> {
    return this.prisma.program.update({
      where: { id: programId },
      data,
    });
  }

  remove(programId: number): Promise<Program> {
    return this.prisma.program.delete({
      where: { id: programId },
    });
  }
}
