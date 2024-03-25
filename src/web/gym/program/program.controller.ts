import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/auth.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProgramDto } from './dto/create-program.dto';
import { GetProgramDto } from './dto/get-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramService } from './program.service';

@ApiTags('programs')
@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Создает программу',
    type: GetProgramDto,
  })
  create(
    @Req() req: RequestWithUser,
    @Body() createProgramDto: CreateProgramDto,
  ) {
    const userId = req.user.id;
    return this.programService.create(createProgramDto, userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Возвращает список программ',
    type: GetProgramDto,
    isArray: true,
  })
  findAll(): Promise<GetProgramDto[]> {
    return this.programService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Возвращает программу по id',
    type: GetProgramDto,
  })
  findOne(@Param('id') id: string) {
    return this.programService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Обновляет программу по id',
    type: GetProgramDto,
  })
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programService.update(+id, updateProgramDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Удаляет программу по id',
    type: GetProgramDto,
  })
  remove(@Param('id') id: string) {
    return this.programService.remove(+id);
  }
}
