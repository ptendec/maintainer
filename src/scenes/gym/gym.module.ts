import { Module } from '@nestjs/common';
import { GymAddModule } from './add.module';
import { DoGymModule } from './do/do.module';

@Module({
  providers: [GymAddModule, DoGymModule],
})
export class GymModule {}
