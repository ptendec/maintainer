import { ApiProperty } from '@nestjs/swagger';

export class CreateDayDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  programId: number;
}
