import { ApiProperty } from '@nestjs/swagger';

export class GetStageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dayId: number;

  @ApiProperty()
  order: number;
}
