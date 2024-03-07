import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class ReminderService {
  constructor(
    private readonly bot: Telegraf,
    private readonly prismaService: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async remindDaily() {
    const now = new Date();
    let dayOfWeek = now.getDay();

    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    try {
      const dishes = await this.prismaService.dish.findMany({
        where: {
          schedule: {
            week: dayOfWeek,
          },
        },
        include: {
          diet: true,
        },
      });

      for (const dish of dishes) {
        const message = `Reminder for today's dish: ${dish.name} (${dish.diet.name})`;
        await this.bot.telegram.sendMessage(5953427798, message);
      }
    } catch (error) {
      console.error('Error sending daily reminders:', error);
    }
  }
}
