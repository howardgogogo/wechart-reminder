import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './modules/user/user.module';
import { ReminderModule } from './modules/reminder/reminder.module';
import { NotifyModule } from './modules/notify/notify.module';
import { LunarModule } from './shared/lunar/lunar.module';
import { ConfigModule } from './config/config.module';
import { User } from './modules/user/user.entity';
import { Reminder } from './modules/reminder/reminder.entity';
import { ReminderLog } from './modules/reminder/reminder-log.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Reminder, ReminderLog],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    ReminderModule,
    NotifyModule,
    LunarModule,
  ],
})
export class AppModule {}
