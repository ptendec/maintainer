import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DayService } from './day.service';
import { CreateDayDto } from './dto/create-day.dto';
import { GetDayDto } from './dto/get.dto';
import { UpdateDayDto } from './dto/update-day.dto';

@ApiTags('days')
@Controller('days')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The day has been successfully created.',
    type: CreateDayDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createDayDto: CreateDayDto) {
    return this.dayService.create(createDayDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The day with the specified ID.',
    type: CreateDayDto,
  })
  @ApiResponse({ status: 404, description: 'Day not found.' })
  async findOne(@Param('id') id: string) {
    return this.dayService.findOne(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Array of all days.',
    type: [GetDayDto],
  })
  @ApiQuery({
    name: 'programId',
    required: false,
    type: Number,
  })
  async findAll(@Query('programId') programId?: number) {
    return this.dayService.findAll(programId);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The day has been successfully updated.',
    type: UpdateDayDto,
  })
  @ApiResponse({ status: 404, description: 'Day not found.' })
  async update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
    return this.dayService.update(+id, updateDayDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The day has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Day not found.' })
  async remove(@Param('id') id: string) {
    return this.dayService.remove(+id);
  }
}
