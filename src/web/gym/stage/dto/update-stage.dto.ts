import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStageDto } from './create-stage.dto';

export class UpdateStageDto extends PartialType(CreateStageDto) {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  dayId?: number;

  @ApiProperty({ required: false })
  order?: number;
}
