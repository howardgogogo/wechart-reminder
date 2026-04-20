import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ReminderLog } from './reminder-log.entity';
import { ReminderMode, RepeatType } from './enums';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId: string;

  @Column({ nullable: true })
  openid: string;

  @Column({
    type: 'enum',
    enum: ReminderMode,
    default: ReminderMode.CUSTOM,
  })
  mode: ReminderMode;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'remind_time', type: 'timestamp' })
  remindTime: Date;

  @Column({ name: 'is_lunar', default: false })
  isLunar: boolean;

  @Column({
    name: 'repeat_type',
    type: 'enum',
    enum: RepeatType,
    default: RepeatType.ONCE,
  })
  repeatType: RepeatType;

  @Column({ name: 'is_enabled', default: true })
  isEnabled: boolean;

  @Column({ name: 'last_remind_at', type: 'timestamp', nullable: true })
  lastRemindAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ReminderLog, (log) => log.reminder)
  logs: ReminderLog[];
}
