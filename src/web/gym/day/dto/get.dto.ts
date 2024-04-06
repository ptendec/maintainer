import { ApiProperty } from '@nestjs/swagger';

export class GetDayDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  programId: number;
}
