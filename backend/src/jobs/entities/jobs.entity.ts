import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('Jobs')
export class Jobs {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ nullable: true })
  jobId: number;

  @Column({ nullable: true })
  storeNumber: string | null;

  @Column({ nullable: true })
  queue: string | null;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  docId: string | null;

  @Column({ nullable: true })
  parentId: number | null;

  @Column({ nullable: true })
  ordered: string | null;

  @Column({ nullable: true })
  tmStart: Date | null;

  @Column({ nullable: true })
  tmCreate: Date | null;

  @Column({ nullable: true })
  tmRestart: Date | null;

  @Column({ nullable: true })
  infoMessage: string | null;

  @Column({ nullable: true })
  errorMessage: string | null;
}
