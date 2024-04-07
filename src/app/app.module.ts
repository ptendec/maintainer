import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { ReminderService } from 'src/reminder/reminder.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { DayModule } from 'src/web/gym/day/day.module';
import { ExerciseVideoModule } from 'src/web/gym/exercise-video/exercise-video.module';
import { ExerciseModule } from 'src/web/gym/exercise/exercise.module';
import { ProgramModule } from 'src/web/gym/program/program.module';
import { StageModule } from 'src/web/gym/stage/stage.module';

@Module({
  imports: [
    // Web
    AuthModule,
    ProgramModule,
    DayModule,
    StageModule,
    ExerciseModule,
    ExerciseVideoModule,
    // Modules
    TelegramModule,
    PrismaModule,
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [ReminderService],
})
export class AppModule {}
