import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ExerciseVideoService {
  constructor(private readonly prisma: PrismaService) {}
}
