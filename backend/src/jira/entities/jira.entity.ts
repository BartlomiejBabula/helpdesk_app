import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Jira')
export class Jira {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jiraKey!: string;

  @Column()
  auto!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
