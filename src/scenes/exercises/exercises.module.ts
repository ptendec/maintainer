import { Module } from '@nestjs/common';
import { DoExercise } from './do/index.scene';
import { DoChooseBodyPartScene } from './do/sub/chooseBodyPart.scene';
import { DoChooseExerciseTypeScene } from './do/sub/chooseExerciseType.scene';
import { ViewVideosScene } from './do/sub/viewVideos.scene';

@Module({
  controllers: [],
  providers: [
    DoExercise,
    DoChooseExerciseTypeScene,
    DoChooseBodyPartScene,
    ViewVideosScene,
  ],
})
export class ExercisesModule {}
