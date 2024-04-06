import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseService } from './exercise.service';

@ApiTags('exercises')
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The exercise has been successfully created.',
    type: CreateExerciseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The exercise with the specified ID.',
    type: CreateExerciseDto,
  })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Array of all exercises.',
    type: [CreateExerciseDto],
  })
  async findAll() {
    return this.exerciseService.findAll();
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The exercise has been successfully updated.',
    type: UpdateExerciseDto,
  })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(+id, updateExerciseDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The exercise has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  async remove(@Param('id') id: string) {
    return this.exerciseService.remove(+id);
  }
}
