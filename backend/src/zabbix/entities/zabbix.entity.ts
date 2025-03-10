import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('Zabbix')
export class Zabbix {
  @ObjectIdColumn()
  _id: ObjectId;

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

  @Column({})
  name: string;

  @Column({})
  opdata: string;
}
