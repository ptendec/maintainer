import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { AddBodyPartScene } from 'src/scenes/exercises/create/sub/addBodyPart.scene';
import { CreatebodyPartscene } from 'src/scenes/exercises/create/sub/addExerciseType.scene';
import { AddVideoScene } from 'src/scenes/exercises/create/sub/addVideo.scene';
import { AddChooseBodyPartScene } from 'src/scenes/exercises/create/sub/chooseBodyPart.scene';
import { ChooseExerciseTypeScene } from 'src/scenes/exercises/create/sub/choseExerciseType.scene';
import { DoExercise } from 'src/scenes/exercises/do/index.scene';
import { DoChooseBodyPartScene } from 'src/scenes/exercises/do/sub/chooseBodyPart.scene';
import { DoChooseExerciseTypeScene } from 'src/scenes/exercises/do/sub/chooseExerciseType.scene';
import { ViewVideosScene } from 'src/scenes/exercises/do/sub/viewVideos.scene';
import { AddDaySceneEntry } from 'src/scenes/gym/addDay';
import { AddDayScene } from 'src/scenes/gym/addDay/sub/addDay.scene';
import { ChooseProgramForDayScene } from 'src/scenes/gym/addDay/sub/chooseProgram.scene';
import { AddExerciseSceneEntry } from 'src/scenes/gym/addExercise';
import { AddExerciseScene } from 'src/scenes/gym/addExercise/sub/addExercise';
import { ChooseDayForExerciseScene } from 'src/scenes/gym/addExercise/sub/chooseDay';
import { ChooseProgramForExerciseScene } from 'src/scenes/gym/addExercise/sub/chooseProgram';
import { ChooseStageForExerciseScene } from 'src/scenes/gym/addExercise/sub/chooseStage';
import { AddProgramScene } from 'src/scenes/gym/addProgram';
import { AddStageSceneEntry } from 'src/scenes/gym/addStage';
import { AddStageScene } from 'src/scenes/gym/addStage/sub/addStage';
import { ChooseDayForStageScene } from 'src/scenes/gym/addStage/sub/chooseDay';
import { ChooseProgramForStageScene } from 'src/scenes/gym/addStage/sub/chooseProgram';
import { DoGymScene } from 'src/scenes/gym/do/index.scene';
import { ChooseDayScene } from 'src/scenes/gym/do/sub/chooseDay.scene';
import { ChooseProgramScene } from 'src/scenes/gym/do/sub/chooseProgram.scene';
import { GymStartScene } from 'src/scenes/gym/do/sub/start.scene';
import { ComposerCommon } from 'src/telegram/composer';
import { session } from 'telegraf';
import { PrismaModule } from '../prisma/prisma.module';
import { AddExerciseTypeSceneEntry } from '../scenes/exercises/create/index.scene';
import { CommonUpdate } from './telegram.controller';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          token: configService.get('API_KEY') as string,
          middlewares: [session()],
          launchOptions: {
            webhook: {
              domain: configService.get('IP') as string,
              path: '/bot',
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    CommonUpdate,
    AddExerciseTypeSceneEntry,
    CreatebodyPartscene,
    AddChooseBodyPartScene,
    AddBodyPartScene,
    AddVideoScene,
    DoExercise,
    DoChooseExerciseTypeScene,
    DoChooseBodyPartScene,
    ViewVideosScene,
    ChooseExerciseTypeScene,
    ComposerCommon,
    GymStartScene,
    ChooseProgramScene,
    ChooseDayScene,
    DoGymScene,

    // [GYM]
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
export class AppModule {}
