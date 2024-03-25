import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgramDto {
  @ApiProperty({ example: 'Программа 1', description: 'Название программы' })
  name: string;
}
