import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @ApiProperty({ required: false })
  name?: string;

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

  @ApiProperty({ required: false })
  stageId?: number;

  @ApiProperty({ required: false })
  order?: number;
}
