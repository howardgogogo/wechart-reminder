import { Injectable, NotFound } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reminder, ReminderMode, RepeatType } from './reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { BatchParserService } from './parser/batch-parser.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    private batchParserService: BatchParserService,
  ) {}

  async create(userId: string, dto: CreateReminderDto): Promise<Reminder> {
    const reminder = this.reminderRepository.create({
      ...dto,
      userId,
    });
    return this.reminderRepository.save(reminder);
  }

  async batchCreate(userId: string, dtos: CreateReminderDto[]): Promise<Reminder[]> {
    const reminders = dtos.map((dto) =>
      this.reminderRepository.create({
        ...dto,
        userId,
      }),
    );
    return this.reminderRepository.save(reminders);
  }

  async batchCreateFromText(userId: string, text: string): Promise<{
    success: number;
    failed: number;
    results: any[];
  }> {
    const parseResult = this.batchParserService.parseBatchText(text);

    const validDtos = parseResult.valid.map((v) => v.data);
    const reminders = await this.batchCreate(userId, validDtos);

    return {
      success: parseResult.valid.length,
      failed: parseResult.invalid.length,
      results: parseResult.valid.map((v, i) => ({
        lineNumber: v.lineNumber,
        title: reminders[i]?.title,
        success: true,
      })).concat(
        parseResult.invalid.map((v) => ({
          lineNumber: v.lineNumber,
          line: v.line,
          success: false,
          error: v.error,
        })),
      ),
    };
  }

  async findAllByUser(userId: string): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id, userId },
    });
    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }
    return reminder;
  }

  async update(id: string, userId: string, dto: UpdateReminderDto): Promise<Reminder> {
    const reminder = await this.findOne(id, userId);
    Object.assign(reminder, dto);
    return this.reminderRepository.save(reminder);
  }

  async remove(id: string, userId: string): Promise<void> {
    const reminder = await this.findOne(id, userId);
    await this.reminderRepository.remove(reminder);
  }

  async findDueReminders(date: Date = new Date()): Promise<Reminder[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.reminderRepository.find({
      where: {
        isEnabled: true,
        remindTime: Between(startOfDay, endOfDay),
      },
      relations: ['user'],
    });
  }

  async findTodayReminders(): Promise<Reminder[]> {
    return this.findDueReminders(new Date());
  }

  async updateLastRemind(id: string): Promise<void> {
    await this.reminderRepository.update(id, {
      lastRemindAt: new Date(),
    });
  }

  getModeText(mode: ReminderMode): string {
    const map: Record<ReminderMode, string> = {
      [ReminderMode.BIRTHDAY]: '生日',
      [ReminderMode.MEETING]: '会议',
      [ReminderMode.CLASS]: '上课',
      [ReminderMode.SCHEDULE]: '日程',
      [ReminderMode.CUSTOM]: '自定义',
    };
    return map[mode] || '未知';
  }

  formatReminderMessage(reminder: Reminder): string {
    const modeText = this.getModeText(reminder.mode);
    let message = `📅 提醒：${reminder.title}\n类型：${modeText}`;

    const dateStr = reminder.remindTime.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    switch (reminder.mode) {
      case ReminderMode.BIRTHDAY:
        message = `🎂 提醒：今天是 ${reminder.title} 的生日\n关系：${reminder.content || '亲友'}\n别忘记送出你的祝福哦！`;
        break;
      case ReminderMode.MEETING:
        message = `📅 会议提醒：${reminder.title}\n🕐 时间：${dateStr}\n📍 地点：${reminder.location || '待定'}`;
        break;
      case ReminderMode.CLASS:
        message = `📚 上课提醒：${reminder.title}\n🕐 时间：${dateStr}\n📍 教室：${reminder.location || '待定'}`;
        break;
      case ReminderMode.SCHEDULE:
        message = `📝 日程提醒：${reminder.title}\n🕐 时间：${dateStr}\n${reminder.content ? '📋 内容：' + reminder.content : ''}`;
        break;
      case ReminderMode.CUSTOM:
        message = `🔔 提醒：${reminder.title}\n🕐 时间：${dateStr}\n${reminder.content ? '📋 ' + reminder.content : ''}`;
        break;
    }

    return message;
  }
}
