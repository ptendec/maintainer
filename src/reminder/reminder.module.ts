import { Module } from '@nestjs/common';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ReminderService } from './reminder.service';

@Module({
  imports: [TelegramModule],
  providers: [ReminderService],
})
export class ReminderModule {}
