import {
  DiskStorage,
  DiskStorageFile,
  FilesInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetFilesDto } from './dto/get.dto';
import { UploadDto } from './dto/upload.dto';
import { ExerciseVideoService } from './exercise-video.service';

@UseGuards(JwtAuthGuard)
@Controller('exercise-video')
@ApiTags('exercise-video')
export class ExerciseVideoController {
  constructor(private readonly exerciseVideoService: ExerciseVideoService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        exerciseId: {
          type: 'number',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: new DiskStorage({
        dest: __dirname + '/uploads',
        filename(file) {
          return `${Date.now()}-${file.filename}`;
        },
      }),
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    type: [GetFilesDto],
  })
  public async uploadArray(
    @Body() data: UploadDto,
    @UploadedFiles() files: DiskStorageFile[],
  ) {
    return await this.exerciseVideoService.createExerciseVideos(
      data.exerciseId,
      files,
    );
  }
}
