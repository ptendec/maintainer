import { Module } from '@nestjs/common';
import { DoGymScene } from './index.scene';
import { ChooseDayScene } from './sub/chooseDay.scene';
import { ChooseProgramScene } from './sub/chooseProgram.scene';
import { GymStartScene } from './sub/start.scene';

@Module({
  providers: [DoGymScene, GymStartScene, ChooseProgramScene, ChooseDayScene],
})
export class GymDoModule {}
