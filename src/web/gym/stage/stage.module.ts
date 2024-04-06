import { Module } from '@nestjs/common';
import { UtilityModule } from 'src/shared/index.module';
import { StageController } from './stage.controller';
import { StageService } from './stage.service';

@Module({
  controllers: [StageController],
  providers: [StageService],
  imports: [UtilityModule],
})
export class StageModule {}
