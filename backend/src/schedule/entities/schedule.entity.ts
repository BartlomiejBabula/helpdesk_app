import { LogTaskType } from 'src/logger/dto/createLog';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isActive: boolean;

  @Column()
  task: LogTaskType;

  @Column()
  schedule: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'longtext' })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
