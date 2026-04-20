import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from '../reminder/reminder.entity';
import { SendStatus } from '../reminder/enums';
import { ReminderLog } from '../reminder/reminder-log.entity';
import { WechatEnterpriseService } from './wechat-enterprise.service';
import { ReminderService } from '../reminder/reminder.service';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    private wechatEnterpriseService: WechatEnterpriseService,
    private reminderService: ReminderService,
    @InjectRepository(ReminderLog)
    private logRepository: Repository<ReminderLog>,
  ) {}

  async sendReminder(reminder: Reminder): Promise<boolean> {
    const openid = reminder.openid;
    const message = this.reminderService.formatReminderMessage(reminder);

    const success = await this.wechatEnterpriseService.sendMessage(
      openid,
      message,
    );

    await this.logReminder(reminder.id, success);

    if (success) {
      await this.reminderService.updateLastRemind(reminder.id);
    }

    return success;
  }

  async sendBatchReminders(reminders: Reminder[]): Promise<{
    success: number;
    failed: number;
  }> {
    let success = 0;
    let failed = 0;

    for (const reminder of reminders) {
      const result = await this.sendReminder(reminder);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  private async logReminder(
    reminderId: string,
    success: boolean,
    errorMsg?: string,
  ): Promise<void> {
    const log = this.logRepository.create({
      reminderId,
      status: success ? SendStatus.SUCCESS : SendStatus.FAILED,
      errorMsg,
    });
    await this.logRepository.save(log);
  }
}
