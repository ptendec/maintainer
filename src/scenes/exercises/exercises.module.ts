import { Module } from '@nestjs/common';
import { AddExerciseTypeSceneEntry } from './create/index.scene';
import { AddBodyPartScene } from './create/sub/addBodyPart.scene';
import { AddBodyPartscene } from './create/sub/addExerciseType.scene';
import { AddVideoScene } from './create/sub/addVideo.scene';
import { AddChooseBodyPartScene } from './create/sub/chooseBodyPart.scene';
import { ChooseExerciseTypeScene } from './create/sub/choseExerciseType.scene';
import { DoExercise } from './do/index.scene';
import { DoChooseBodyPartScene } from './do/sub/chooseBodyPart.scene';
import { DoChooseExerciseTypeScene } from './do/sub/chooseExerciseType.scene';
import { ViewVideosScene } from './do/sub/viewVideos.scene';

@Module({
  controllers: [],
  providers: [
    AddExerciseTypeSceneEntry,
    AddBodyPartscene,
    AddChooseBodyPartScene,
    AddBodyPartScene,
    AddVideoScene,

    DoExercise,
    DoChooseExerciseTypeScene,
    DoChooseBodyPartScene,
    ViewVideosScene,
    ChooseExerciseTypeScene,
  ],
})
export class ExercisesModule {}
