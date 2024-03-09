import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { AppModule } from './telegram/telegram.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());
  const stage = new Scenes.Stage();
  bot.use(stage.middleware());
  app.use(bot.webhookCallback('/bot'));

  await app.listen(3000);
};
bootstrap();
