import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStageDto } from './dto/create.dto';
import { GetStageDto } from './dto/get.dto';
import { UpdateStageDto } from './dto/update.dto';
import { StageService } from './stage.service';

@ApiTags('stages')
@Controller('stages')
@UseGuards(JwtAuthGuard)
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
    type: GetStageDto,
  })
  @ApiResponse({ status: 404, description: 'Stage not found.' })
  async findOne(@Param('id') id: string) {
    return this.stageService.findOne(+id);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Array of all stages.',
    type: [GetStageDto],
  })
  @ApiQuery({
    name: 'dayId',
    required: false,
    type: Number,
  })
  async findAll(@Query('dayId') dayId?: number) {
    return this.stageService.findAll(dayId);
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
