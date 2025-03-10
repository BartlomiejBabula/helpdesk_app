import { ObjectId } from 'mongodb';
import {
  Entity,
  Column,
  ObjectIdColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('Reports')
export class Reports {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  block: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
