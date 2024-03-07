import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { ComposerCommon } from 'src/common/composer';
import {
  DoChooseBodyPartScene,
  DoChooseExerciseTypeScene,
  DoExercise,
  ViewVideosScene,
} from 'src/controllers/exercises/do.controller';
import { ReminderService } from 'src/reminder/reminder.service';
import { session } from 'telegraf';
import {
  AddBodyPartScene,
  AddChooseBodyPartScene,
  AddExerciseScene,
  AddVideoScene,
  ChooseExerciseTypeScene,
  CreatebodyPartscene,
} from '../controllers/exercises/create.controller';
import { PrismaModule } from '../prisma/prisma.module';
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
      useFactory: (configService: ConfigService) => ({
        token: configService.get('API_KEY') as string,
        middlewares: [session()],
        launchOptions: {
          webhook: {
            domain: configService.get('IP') as string,
            path: '/bot',
          },
        },
      }),
      inject: [ConfigService, ReminderService],
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
