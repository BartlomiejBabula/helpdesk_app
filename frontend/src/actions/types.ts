import { JobTypes, ReplicationTypes, StoreTypes, UserTypes } from "../types";
import {
  GET_STORELIST,
  GET_USER,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  EDIT_STORE,
  GET_JOBS,
  UPDATE_STORELIST,
  GET_ERROR_JOBS_LIST,
  BLOCK_REPORT,
  GET_REPLICATION,
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
  | ActionGetJobsWithError;

export type ActionGetReplication = {
  type: typeof GET_REPLICATION;
  payload: ReplicationTypes;
};

export type ActionGetBlockRaport = {
  type: typeof BLOCK_REPORT;
  payload: string[];
};

export type ActionGetJobsTypes = {
  type: typeof GET_JOBS;
  payload: JobTypes[];
};

export type ActionGetJobsWithError = {
  type: typeof GET_ERROR_JOBS_LIST;
  payload: JobTypes[];
};

export type ActionAddStoreToStoreListTypes = {
  type: typeof UPDATE_STORELIST;
  payload: StoreTypes;
};

export type ActionGetUserProfileTypes = {
  type: typeof GET_USER | typeof GET_STORELIST;
  payload: UserTypes | StoreTypes[];
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
