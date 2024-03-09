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
import { ComposerCommon } from 'src/telegram/composer';
import { session } from 'telegraf';
import { PrismaModule } from '../prisma/prisma.module';
import { AddExerciseScene } from '../scenes/exercises/create/index.scene';
import { ExerciseUpdate } from './telegram.controller';

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
    ExerciseUpdate,
    AddExerciseScene,
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
  ],
})
export class AppModule {}
