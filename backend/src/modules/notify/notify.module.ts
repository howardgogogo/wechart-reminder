import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { WechatEnterpriseService } from './wechat-enterprise.service';
import { ReminderModule } from '../reminder/reminder.module';
import { ReminderCronService } from '../../shared/cron/reminder-cron.service';

@Module({
  imports: [ReminderModule],
  providers: [NotifyService, WechatEnterpriseService, ReminderCronService],
  exports: [NotifyService],
})
export class NotifyModule {}
