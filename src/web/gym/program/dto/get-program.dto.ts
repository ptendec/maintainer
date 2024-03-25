import { ApiProperty } from '@nestjs/swagger';

export class GetProgramDto {
  @ApiProperty({ example: 1, description: 'Идентификатор программы' })
  id: number;
  @ApiProperty({ example: 'Программа 1', description: 'Название программы' })
  name: string;
}
