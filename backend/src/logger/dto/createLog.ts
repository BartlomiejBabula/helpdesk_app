import { LogStatus } from './getLog';

export enum LogTaskType {
  CREATE_STORE = 'CreateStore',
  UPDATE_STORE_LIST = 'UpdateStore',
  GET_GICA = 'GetYesterdayGica',
  RUNNING_SQL_MONITORING = 'RunningSQLMonitoring',
  ARCHIVELOG_PROD_MONITORING = 'ArchivelogProductionMonitoring',
  ARCHIVELOG_PROD_MONITORING2 = 'ArchivelogProductionMonitoring2',
  ARCHIVELOG_REP_MONITORING = 'ArchivelogReplicationMonitoring',
  JIRA_REGISTER = 'JiraTaskRegister',
  UPDATE_SCHEDULE = 'UpdateSchedule',
  END_JOB = 'ManualEndJob',
  RESTART_JOB = 'ManualRestartJob',
  GET_ACTUAL_ESAMBO_JOBS = 'GetEsamboJobs',
  ZABBIX_CHECK = 'ZabbixCheck',
  ZABBIX_PROBLEM_RECOVERY = 'ZabbixCheckProblemsRecovery',
  MORNING_REPORT = 'GenerateMorningReport',
  VOLUMETRIC_REPORT = 'GenerateVolumetricReport',
  SLA_REPORT = 'GenerateSLAReport',
  UNBLOCK_REPORT = 'UnblockReport',
  DELETE_OLD_LOGS = 'DeleteOldLogs',
}

export interface CreateLogDto {
  taskId?: string;
  task: LogTaskType;
  status: LogStatus;
  orderedBy?: string;
  accessToken?: string;
  description?: string;
}
