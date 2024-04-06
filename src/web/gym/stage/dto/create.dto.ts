import { ApiProperty } from '@nestjs/swagger';

export class CreateStageDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  dayId: number;
}
