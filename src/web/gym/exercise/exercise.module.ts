import { Module } from '@nestjs/common';
import { UtilityModule } from 'src/shared/index.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService],
  imports: [UtilityModule],
})
export class ExerciseModule {}
