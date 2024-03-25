import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
  @ApiProperty({ example: 'Программа 1', description: 'Название программы' })
  name: string;
}
