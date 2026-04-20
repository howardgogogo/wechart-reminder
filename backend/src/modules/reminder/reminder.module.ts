import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from './reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { BatchParserService } from './parser/batch-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  controllers: [ReminderController],
  providers: [ReminderService, BatchParserService],
  exports: [ReminderService],
})
export class ReminderModule {}
