import { ObjectId } from 'mongodb';
import {
  Entity,
  Column,
  ObjectIdColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('Stores')
export class Stores {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  storeNumber: string | null;

  @Column({ nullable: true })
  storeType: string | null;

  @Column({ nullable: true })
  status: string | null;

  @Column({ nullable: true })
  information: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
