import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  remark?: string;

  @ApiProperty({ required: false })
  warning?: string;

  @ApiProperty({ required: false })
  video?: string;

  @ApiProperty({ required: false })
  sets?: number;

  @ApiProperty({ required: false })
  repeats?: number;

  @ApiProperty()
  stageId: number;

  @ApiProperty()
  order: number;
}
