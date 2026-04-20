import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../../modules/reminder/reminder.entity';
import { RepeatType } from '../../modules/reminder/enums';
import { ReminderService } from '../../modules/reminder/reminder.service';
import { NotifyService } from '../../modules/notify/notify.service';
import { LunarService } from '../lunar/lunar.service';

@Injectable()
export class ReminderCronService {
  private readonly logger = new Logger(ReminderCronService.name);

  constructor(
    private reminderService: ReminderService,
    private notifyService: NotifyService,
    private lunarService: LunarService,
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {}

  @Cron('0 8 * * *') // 每天早上 8:00 执行
  async handleDailyReminders() {
    this.logger.log('Starting daily reminder check...');
    const today = new Date();
    const reminders = await this.getTodayReminders(today);

    this.logger.log(`Found ${reminders.length} reminders for today`);

    for (const reminder of reminders) {
      const alreadySent = this.shouldSkip(reminder, today);
      if (alreadySent) {
        this.logger.debug(`Skipping ${reminder.id} - already sent today`);
        continue;
      }

      try {
        await this.notifyService.sendReminder(reminder);
        this.logger.log(`Sent reminder: ${reminder.title}`);
      } catch (error) {
        this.logger.error(`Failed to send reminder ${reminder.id}: ${error.message}`);
      }
    }

    this.logger.log('Daily reminder check completed');
  }

  private async getTodayReminders(date: Date): Promise<Reminder[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const allReminders = await this.reminderRepository.find({
      where: { isEnabled: true },
      relations: ['user'],
    });

    return allReminders.filter((reminder) => {
      const reminderDate = new Date(reminder.remindTime);
      reminderDate.setFullYear(date.getFullYear());

      if (reminder.isLunar) {
        const todayLunar = this.lunarService.getLunarDate(date);
        const remindLunar = this.lunarService.getLunarDate(reminder.remindTime);
        return (
          todayLunar.month === remindLunar.month && todayLunar.day === remindLunar.day
        );
      }

      return (
        reminderDate >= startOfDay &&
        reminderDate <= endOfDay &&
        (reminder.repeatType === RepeatType.ONCE ||
          reminder.repeatType === RepeatType.YEARLY)
      );
    });
  }

  private shouldSkip(reminder: Reminder, today: Date): boolean {
    if (!reminder.lastRemindAt) {
      return false;
    }

    const lastRemind = new Date(reminder.lastRemindAt);
    return (
      lastRemind.getFullYear() === today.getFullYear() &&
      lastRemind.getMonth() === today.getMonth() &&
      lastRemind.getDate() === today.getDate()
    );
  }

  @Cron('0 0 * * *') // 每小时检查一次（用于处理跨天的提醒）
  async handleHourlyCheck() {
    this.logger.debug('Hourly check for pending reminders');
  }
}
