export interface UserType {
  id: number;
  email: string;
  createdAt: string;
}

export interface JobType {
  CFG_ORDER_ID: any;
  COMMENT_MESSAGE: any;
  DOC_ID: number;
  DOC_SEMAFOR_VALUE: any;
  ERROR_MESSAGE: string;
  EXEC_NO_TRIES: number;
  EXEC_STATUS: any;
  EXEC_TM_START: string;
  EXEC_WLS_NAME: string;
  ID: number;
  INFO_MESSAGE: string;
  NO_TRIES: number;
  OPERATION_CODE: any;
  ORDERED: string;
  ORDER_ID: string;
  ORG_ID: number;
  PARENT_ID: any;
  PARENT_ORDER_ID: any;
  PRIORITY: number;
  PROGRESS: number;
  QUEUE: string;
  STATUS: string;
  STORE_NUMBER: string;
  TM_CREATE: string;
  TM_END: any;
  TM_RESTART: string;
  TM_START: string;
  VERSION: number;
  id: number;
  TM_FORMAT_RESTART?: Date;
  TM_FORMAT_START?: Date;
}

export interface StoreType {
  id: number;
  storeNumber: string;
  storeType: string;
  status: string;
  information?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JiraType {
  error?: null | string;
  status?: "loading" | "succeeded" | "failed" | null;
  jiraKey: string;
  auto: boolean;
}
