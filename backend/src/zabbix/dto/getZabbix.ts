import { IsNotEmpty, IsNumber } from 'class-validator';

export interface ApiZabbix {
  eventid: string;
  source: string;
  object: string;
  objectid: string;
  clock: string;
  ns: string;
  r_eventid: string;
  r_clock: string;
  r_ns: string;
  correlationid: string;
  userid: string;
  name: string;
  acknowledged: string;
  severity: string;
  cause_eventid: string;
  opdata: string;
  acknowledges: [];
  suppression_data: [];
  suppressed: string;
  urls: [];
}

export class GetZabbixDto {
  @IsNotEmpty()
  @IsNumber()
  timeStamp: number;
}
