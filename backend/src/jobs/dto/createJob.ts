export interface JobType {
  STORE_NUMBER: string | null;
  ID: number | null;
  VERSION: number | null;
  STATUS: string | null;
  PARENT_ID: number | null;
  QUEUE: string | null;
  NO_TRIES: number | null;
  TM_START: string | Date | null;
  TM_END: string | Date | null;
  TM_RESTART: string | Date | null;
  TM_CREATE: string | Date | null;
  ORG_ID: number | null;
  ORDER_ID: string | null;
  PROGRESS: number | null;
  PARENT_ORDER_ID: string | null;
  PRIORITY: number | null;
  DOC_ID: string | null;
  ORDERED: string | null;
  OPERATION_CODE: string | null;
  INFO_MESSAGE: string | null;
  ERROR_MESSAGE: string | null;
}
