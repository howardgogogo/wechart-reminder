import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { ReminderModule } from './modules/reminder/reminder.module';
import { NotifyModule } from './modules/notify/notify.module';
import { LunarModule } from './shared/lunar/lunar.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    UserModule,
    ReminderModule,
    NotifyModule,
    LunarModule,
  ],
})
export class AppModule {}
