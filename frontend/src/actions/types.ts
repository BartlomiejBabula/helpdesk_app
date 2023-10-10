import {
  JiraTypes,
  JobTypes,
  ReplicationTypes,
  StoreTypes,
  UserTypes,
} from "../types";
import {
  GET_STORELIST,
  GET_USER,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  EDIT_STORE,
  GET_JOBS,
  UPDATE_STORELIST,
  BLOCK_REPORT,
  GET_REPLICATION,
  GET_JIRA,
} from "./UserActions";

export type ActionTypes =
  | ActionGetUserProfileTypes
  | ActionLogOutActionTypes
  | ActionLogInActionTypes
  | ActionEditStoreTypes
  | ActionGetJobsTypes
  | ActionAddStoreToStoreListTypes
  | ActionGetBlockRaport
  | ActionGetReplication
  | ActionGetJira;

export type ActionGetReplication = {
  type: typeof GET_REPLICATION;
  payload: ReplicationTypes;
};

export type ActionGetJira = {
  type: typeof GET_JIRA;
  payload: JiraTypes;
};

export type ActionGetBlockRaport = {
  type: typeof BLOCK_REPORT;
  payload: string[];
};

export type ActionGetJobsTypes = {
  type: typeof GET_JOBS;
  payload: JobTypes[];
};

export type ActionAddStoreToStoreListTypes = {
  type: typeof UPDATE_STORELIST;
  payload: StoreTypes;
};

export type ActionGetUserProfileTypes = {
  type: typeof GET_USER | typeof GET_STORELIST | typeof GET_JIRA;
  payload: UserTypes | StoreTypes[] | JiraTypes;
};

export type ActionGetStoreList = {
  type: typeof GET_STORELIST;
  payload: StoreTypes[];
};

export type ActionLogOutActionTypes = {
  type: typeof USER_LOGGED_OUT;
};

export type ActionLogInActionTypes = {
  type: typeof USER_LOGGED_IN;
};

export type ActionEditStoreTypes = {
  type: typeof EDIT_STORE;
  payload: StoreTypes;
};
