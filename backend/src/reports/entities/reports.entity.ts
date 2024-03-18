import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('Reports')
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  block: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
