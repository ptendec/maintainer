import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { ExercisesModule } from 'src/scenes/exercises/exercises.module';
import { ComposerCommon } from 'src/telegram/composer';
import { session } from 'telegraf';
import { CommonUpdate } from './telegram.controller';

@Module({
  imports: [
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
  providers: [ComposerCommon, CommonUpdate, ExercisesModule],
})
export class TelegramModule {}
