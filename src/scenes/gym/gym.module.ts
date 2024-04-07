import { Module } from '@nestjs/common';
import { GymDoModule } from './do/do.module';

@Module({
  imports: [GymDoModule],
  exports: [GymDoModule],
})
export class GymModule {}
