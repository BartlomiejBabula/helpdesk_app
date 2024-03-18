import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Jobs')
export class Jobs {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ nullable: true, type: 'longtext' })
  infoMessage: string | null;

  @Column({ nullable: true, type: 'longtext' })
  errorMessage: string | null;
}
