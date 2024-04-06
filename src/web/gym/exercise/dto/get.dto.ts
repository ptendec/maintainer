import { ApiProperty } from '@nestjs/swagger';

export class GetExerciseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  dayId: number;
}
