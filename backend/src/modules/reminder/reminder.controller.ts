import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@ApiTags('Reminders')
@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reminder' })
  create(@Body() dto: CreateReminderDto, @Query('userId') userId: string) {
    return this.reminderService.create(userId, dto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Batch create reminders from array' })
  batchCreate(
    @Body() dtos: CreateReminderDto[],
    @Query('userId') userId: string,
  ) {
    return this.reminderService.batchCreate(userId, dtos);
  }

  @Post('batch-text')
  @ApiOperation({ summary: 'Batch create reminders from text format' })
  batchCreateFromText(
    @Body('text') text: string,
    @Query('userId') userId: string,
  ) {
    return this.reminderService.batchCreateFromText(userId, text);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reminders for a user' })
  findAll(@Query('userId') userId: string) {
    return this.reminderService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific reminder' })
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.reminderService.findOne(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a reminder' })
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() dto: UpdateReminderDto,
  ) {
    return this.reminderService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.reminderService.remove(id, userId);
  }

  @Get('due/today')
  @ApiOperation({ summary: 'Get reminders due today' })
  findTodayReminders() {
    return this.reminderService.findTodayReminders();
  }
}
