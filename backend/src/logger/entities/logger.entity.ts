import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { LogStatus } from '../dto/getLog';
import { LogTaskType } from '../dto/createLog';

@Entity('Logger')
export class Logger {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  taskId: string;

  @Column()
  task: LogTaskType;

  @Column()
  status: LogStatus;

  @Column()
  orderedBy: string;

  @Column({ nullable: true, type: 'longtext' })
  description: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
