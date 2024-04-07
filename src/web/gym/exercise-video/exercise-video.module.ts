import { Module } from '@nestjs/common';
import { ExerciseVideoController } from './exercise-video.controller';
import { ExerciseVideoService } from './exercise-video.service';

@Module({
  imports: [],
  controllers: [ExerciseVideoController],
  providers: [ExerciseVideoService],
})
export class ExerciseVideoModule {}
