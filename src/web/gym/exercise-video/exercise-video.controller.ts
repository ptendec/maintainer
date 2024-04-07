import {
  DiskStorage,
  DiskStorageFile,
  FilesInterceptor,
  UploadedFiles,
} from '@blazity/nest-file-fastify';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadDto } from './dto/upload.dto';

@Controller('exercise-video')
@ApiTags('exercise-video')
export class ExerciseVideoController {
  // constructor(private readonly exerciseVideoService: ExerciseVideoService) {}

  @Post('/file')
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
        dest: __dirname + 'uploads',
        filename(file) {
          return `${Date.now()}-${file.filename}`;
        },
      }),
    }),
  )
  public async uploadArray(
    @Body() data: UploadDto,
    @UploadedFiles() files: DiskStorageFile[],
  ) {
    // console.log(data);
    console.log(files);
    // files.forEach((file) => console.log(file.path));
  }
}
