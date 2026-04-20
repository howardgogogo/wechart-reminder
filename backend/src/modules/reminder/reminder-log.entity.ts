import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reminder } from './reminder.entity';
import { SendStatus } from './enums';

@Entity('reminder_logs')
export class ReminderLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reminder_id' })
  reminderId: string;

  @ManyToOne(() => Reminder, (reminder) => reminder.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reminder_id' })
  reminder: Reminder;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @Column({
    type: 'enum',
    enum: SendStatus,
    default: SendStatus.SUCCESS,
  })
  status: SendStatus;

  @Column({ name: 'error_msg', type: 'text', nullable: true })
  errorMsg: string;
}
