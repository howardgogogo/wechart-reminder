import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { WechatEnterpriseService } from './wechat-enterprise.service';
import { ReminderModule } from '../reminder/reminder.module';
import { ReminderCronService } from '../../shared/cron/reminder-cron.service';
import { ReminderLog } from '../reminder/reminder-log.entity';
import { LunarModule } from '../../shared/lunar/lunar.module';

@Module({
  imports: [ReminderModule, TypeOrmModule.forFeature([ReminderLog]), LunarModule],
  controllers: [NotifyController],
  providers: [NotifyService, WechatEnterpriseService, ReminderCronService],
  exports: [NotifyService],
})
export class NotifyModule {}
