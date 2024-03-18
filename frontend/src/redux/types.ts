export interface UserType {
  id: number;
  email: string;
  createdAt: string;
}

export interface JobType {
  id: number;
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
  id?: number;
  jiraKey: string;
  auto: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
