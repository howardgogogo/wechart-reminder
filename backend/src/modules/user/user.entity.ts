import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reminder } from '../../modules/reminder/reminder.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  openid: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ name: 'enterprise_id', nullable: true })
  enterpriseId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];
}
