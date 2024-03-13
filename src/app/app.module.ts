import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReminderService } from 'src/reminder/reminder.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    TelegramModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [ReminderService],
})
export class AppModule {}
