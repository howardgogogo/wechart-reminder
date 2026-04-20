import { IsString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateReminderDto } from './create-reminder.dto';

export class BatchCreateReminderDto {
  @ApiProperty({ description: 'Batch of reminders to create' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReminderDto)
  reminders: CreateReminderDto[];
}
