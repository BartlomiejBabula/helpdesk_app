import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Zabbix')
export class Zabbix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: number;

  @Column()
  recoveryEventId: number;

  @Column()
  objectId: number;

  @Column()
  severity: number;

  @Column()
  clock: Date;

  @Column()
  host: string;

  @Column({ type: 'longtext' })
  name: string;

  @Column({ type: 'longtext' })
  opdata: string;
}
