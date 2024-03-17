import { Module } from '@nestjs/common';
import { MaxOrderService } from './max-order.service';

@Module({
  exports: [MaxOrderService],
  providers: [MaxOrderService],
})
export class UtilityModule {}
