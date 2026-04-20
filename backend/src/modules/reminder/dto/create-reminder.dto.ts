import { IsString, IsEnum, IsBoolean, IsOptional, IsDate, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReminderMode, RepeatType } from '../reminder.entity';

export class CreateReminderDto {
  @ApiProperty({ description: 'Reminder mode', enum: ReminderMode })
  @IsEnum(ReminderMode)
  mode: ReminderMode;

  @ApiProperty({ description: 'Title of the reminder' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Content description' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Reminder time' })
  @IsDate()
  @Type(() => Date)
  remindTime: Date;

  @ApiPropertyOptional({ description: 'Is lunar calendar', default: false })
  @IsBoolean()
  @IsOptional()
  isLunar?: boolean;

  @ApiPropertyOptional({ description: 'Repeat type', enum: RepeatType })
  @IsEnum(RepeatType)
  @IsOptional()
  repeatType?: RepeatType;

  @ApiPropertyOptional({ description: 'Relation for birthday mode' })
  @IsString()
  @IsOptional()
  relation?: string;

  @ApiPropertyOptional({ description: 'Custom message for birthday' })
  @IsString()
  @IsOptional()
  birthdayMessage?: string;
}
