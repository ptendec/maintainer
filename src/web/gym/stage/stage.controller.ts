import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { StageService } from './stage.service';

@ApiTags('stages')
@Controller('stages')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The stage has been successfully created.',
    type: CreateStageDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createStageDto: CreateStageDto) {
    return this.stageService.create(createStageDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The stage with the specified ID.',
    type: CreateStageDto,
  })
  @ApiResponse({ status: 404, description: 'Stage not found.' })
  async findOne(@Param('id') id: string) {
    return this.stageService.findOne(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Array of all stages.',
    type: [CreateStageDto],
  })
  async findAll() {
    return this.stageService.findAll();
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The stage has been successfully updated.',
    type: UpdateStageDto,
  })
  @ApiResponse({ status: 404, description: 'Stage not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    return this.stageService.update(+id, updateStageDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The stage has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Stage not found.' })
  async remove(@Param('id') id: string) {
    return this.stageService.remove(+id);
  }
}
