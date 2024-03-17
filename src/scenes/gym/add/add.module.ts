import { Module } from '@nestjs/common';
import { UtilityModule } from 'src/shared/index.module';
import { AddDayScene } from './addDay';
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
  imports: [UtilityModule],
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
    ChooseProgramForExerciseScene,
  ],
  exports: [
    AddProgramScene,

    AddDayScene,

    AddStageSceneEntry,
    ChooseProgramForStageScene,
    ChooseDayForStageScene,
    AddStageScene,

    ChooseProgramForExerciseScene,
    AddExerciseScene,
    AddExerciseSceneEntry,
    ChooseDayForExerciseScene,
    ChooseStageForExerciseScene,
  ],
})
export class GymAddModule {}
