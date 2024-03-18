import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('Stores')
export class Stores {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  storeNumber: string | null;

  @Column({ nullable: true })
  storeType: string | null;

  @Column({ nullable: true })
  status: string | null;

  @Column({ nullable: true, type: 'longtext' })
  information: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
