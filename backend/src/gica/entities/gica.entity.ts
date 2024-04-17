import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Gica')
export class Gica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date!: Date;

  @Column()
  ReceiveStart!: Date;

  @Column()
  ReceiveEnd!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  ReceiveTimeInMinutes!: number;

  @Column()
  NetworkStoreStart!: Date;

  @Column()
  NetworkStoreEnd!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  NetworkStoreTimeInMinutes!: number;

  @Column()
  HypermarketStart!: Date;

  @Column()
  HypermarketEnd!: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  HypermarketTimeInMinutes!: number;
}
