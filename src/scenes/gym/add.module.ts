import { Module } from '@nestjs/common';
import { AddDayScene } from './addDay';
import { AddExerciseSceneEntry } from './addExercise';
import { AddExerciseScene } from './addExercise/sub/addExercise';
import { ChooseDayForExerciseScene } from './addExercise/sub/chooseDay';
import { ChooseStageForExerciseScene } from './addExercise/sub/chooseStage';
import { AddProgramScene } from './addProgram';
import { AddStageSceneEntry } from './addStage';
import { AddStageScene } from './addStage/sub/addStage';
import { ChooseDayForStageScene } from './addStage/sub/chooseDay';
import { ChooseProgramForStageScene } from './addStage/sub/chooseProgram';

@Module({
  providers: [
    AddProgramScene,

    AddDayScene,

    AddStageSceneEntry,
    ChooseProgramForStageScene,
    ChooseDayForStageScene,
    AddStageScene,

    AddExerciseSceneEntry,
    AddExerciseScene,
    ChooseDayForExerciseScene,
    ChooseStageForExerciseScene,
  ],
  exports: [
    AddProgramScene,

    AddDayScene,

    AddStageSceneEntry,
    ChooseProgramForStageScene,
    ChooseDayForStageScene,
    AddStageScene,

    AddExerciseScene,
    AddExerciseSceneEntry,
    ChooseDayForExerciseScene,
    ChooseStageForExerciseScene,
  ],
})
export class GymAddModule {}
