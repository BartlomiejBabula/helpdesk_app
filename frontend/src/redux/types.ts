import { CronPartsType } from "../function/cron";

export interface UserType {
  _id: string;
  email: string;
  createdAt: string;
  darkTheme: boolean;
  role?: "helpdesk" | "carrefour";
}

export interface JobType {
  _id: number;
  jobId: number;
  storeNumber: string;
  queue: string;
  status: string;
  docId: null | number;
  parentId: null | number;
  ordered: string;
  tmStart: string;
  tmCreate: string;
  tmRestart: string;
  infoMessage: string | null;
  errorMessage: string | null;
  TM_FORMAT_START?: Date;
  TM_FORMAT_RESTART?: Date;
}

export interface LogType {
  _id: string;
  taskId: string;
  task: string;
  status: string;
  orderedBy: string;
  description?: string;
  createdAt: string;
  formatedCreatedAt?: Date;
}

export interface StoreType {
  _id?: string;
  storeNumber: string;
  storeType: string;
  status: string;
  information?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleType {
  _id: string;
  isActive: boolean;
  task: string;
  schedule: string;
  name: string;
  description?: string;
  cron: CronPartsType;
}

export interface JiraType {
  _id?: string;
  jiraKey: string;
  auto: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiGicaType {
  date: string;
  ReceiveStart: string;
  ReceiveEnd: string;
  ReceiveTimeInMinutes: number;
  NetworkStoreStart: string;
  NetworkStoreEnd: string;
  NetworkStoreTimeInMinutes: number;
  HypermarketStart: string;
  HypermarketEnd: string;
  HypermarketTimeInMinutes: number;
}

export interface ChartGicaType {
  date: string;
  ReceiveStart?: Date;
  ReceiveEnd?: Date;
  ReceiveTimeInMinutes: number;
  NetworkStoreStart?: Date;
  NetworkStoreEnd?: Date;
  NetworkStoreTimeInMinutes: number;
  HypermarketStart?: Date;
  HypermarketEnd?: Date;
  HypermarketTimeInMinutes: number;
}

export interface ApiZabbixType {
  _id: string;
  eventId: number;
  recoveryEventId: number;
  objectId: number;
  severity: number;
  clock: Date;
  opdata: string;
  host: string;
  name: string;
}
