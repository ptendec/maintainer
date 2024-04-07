import { DiskStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class ExerciseVideoService {
  constructor(private readonly prisma: PrismaService) {}

  async createExerciseVideos(exerciseId: string, files: DiskStorageFile[]) {
    const created: number[] = [];
    for (const file of files) {
      const exerciseVideo = await this.prisma.exerciseVideo.create({
        data: {
          path: file.filename,
          name: file.filename,
          exerciseId: +exerciseId,
        },
      });
      created.push(exerciseVideo.id);
    }
    console.log(created);
    return created;
  }
}
