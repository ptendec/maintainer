import { Module } from '@nestjs/common';
import { AddDaySceneEntry } from './addDay';
import { AddDayScene } from './addDay/sub/addDay.scene';
import { ChooseProgramForDayScene } from './addDay/sub/chooseProgram.scene';
import { AddExerciseSceneEntry } from './addExercise';
import { AddExerciseScene } from './addExercise/sub/addExercise';
import { ChooseDayForExerciseScene } from './addExercise/sub/chooseDay';
import { ChooseProgramForExerciseScene } from './addExercise/sub/chooseProgram';
import { ChooseStageForExerciseScene } from './addExercise/sub/chooseStage';
import { AddProgramScene } from './addProgram';
import { AddStageSceneEntry } from './addStage';
import { AddStageScene } from './addStage/sub/addStage';
import { ChooseDayForStageScene } from './addStage/sub/chooseDay';
import { ChooseProgramForStageScene } from './addStage/sub/chooseProgram';

@Module({
  controllers: [],
  providers: [
    AddProgramScene,

    AddDaySceneEntry,
    ChooseProgramForDayScene,
    AddDayScene,

    AddStageSceneEntry,
    ChooseProgramForStageScene,
    ChooseDayForStageScene,
    AddStageScene,

    AddExerciseSceneEntry,
    ChooseProgramForExerciseScene,
    ChooseDayForExerciseScene,
    ChooseStageForExerciseScene,
    AddExerciseScene,
  ],
})
export class GymAddModule {}
