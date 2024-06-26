import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDayDto } from './create.dto';

export class UpdateDayDto extends PartialType(CreateDayDto) {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  programId?: number;
}
