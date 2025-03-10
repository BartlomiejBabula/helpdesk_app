import { ObjectId } from 'mongodb';
import { LogTaskType } from 'src/logger/dto/createLog';
import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Schedule')
export class Schedule {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  isActive: boolean;

  @Column()
  task: LogTaskType;

  @Column()
  schedule: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
