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
import { User } from '../../user/user.entity';
import { ReminderLog } from './reminder-log.entity';

export enum ReminderMode {
  BIRTHDAY = 'BIRTHDAY',
  MEETING = 'MEETING',
  CLASS = 'CLASS',
  SCHEDULE = 'SCHEDULE',
  CUSTOM = 'CUSTOM',
}

export enum RepeatType {
  ONCE = 'ONCE',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
}

export enum SendStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.reminders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
