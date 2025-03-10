import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { LogStatus } from '../dto/getLog';
import { LogTaskType } from '../dto/createLog';
import { ObjectId } from 'mongodb';

@Entity('Logger')
export class Logger {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  taskId: string;

  @Column()
  task: LogTaskType;

  @Column()
  status: LogStatus;

  @Column()
  orderedBy: string;

  @Column({ nullable: true })
  description: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
