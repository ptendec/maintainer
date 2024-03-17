import { Module } from '@nestjs/common';
import { GymAddModule } from './add/add.module';
import { GymDoModule } from './do/do.module';

@Module({
  imports: [GymAddModule, GymDoModule],
  exports: [GymAddModule, GymDoModule],
})
export class GymModule {}
