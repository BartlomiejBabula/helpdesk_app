import api from "../api/api";
import { Dispatch } from "react";
import {
  JobTypes,
  ReplicationTypes,
  StoreTypes,
  UserTypes,
  JiraTypes,
} from "../types";
import {
  ActionAddStoreToStoreListTypes,
  ActionEditStoreTypes,
  ActionGetBlockRaport,
  ActionGetJira,
  ActionGetJobsTypes,
  ActionGetJobsWithError,
  ActionGetReplication,
  ActionGetStoreList,
  ActionGetUserProfileTypes,
} from "./types";
export const GET_STORELIST = "GET_STORELIST";
export const GET_USER = "GET_USER";
export const UPDATE_STORELIST = "UPDATE_STORELIST";
export const EDIT_STORE = "EDIT_STORE";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const GET_ERROR_JOBS_LIST = "GET_ERROR_JOBS_LIST";
export const GET_JOBS = "GET_JOBS";
export const BLOCK_REPORT = "BLOCK_REPORT";
export const GET_REPLICATION = "GET_REPLICATION";
export const GET_JIRA = "GET_JIRA";

export const logOutAction = () => ({
  type: USER_LOGGED_OUT,
});

export const logInAction = () => ({
  type: USER_LOGGED_IN,
});

export const getUserProfile =
  () => (dispatch: Dispatch<ActionGetUserProfileTypes>) => {
    api.get(`/users/profile`).then((response) => {
      let user: UserTypes = response.data;
      dispatch({
        type: GET_USER,
        payload: user,
      });
      api.get(`/stores`).then((response) => {
        let storeList: StoreTypes[] = response.data;
        dispatch({
          type: GET_STORELIST,
          payload: storeList,
        });
        api.get(`/jira`).then((response) => {
          let jira: JiraTypes = response.data[0];
          dispatch({
            type: GET_JIRA,
            payload: jira,
          });
        });
      });
    });
  };

export const getStoreList = () => (dispatch: Dispatch<ActionGetStoreList>) => {
  api.get(`/stores`).then((response) => {
    let storeList = response.data;
    dispatch({
      type: GET_STORELIST,
      payload: storeList,
    });
  });
};

export const addStoreToStoreList =
  (store: StoreTypes) =>
  (dispatch: Dispatch<ActionAddStoreToStoreListTypes>) => {
    api
      .post(`/stores`, store)
      .then((response) => {
        dispatch({
          type: UPDATE_STORELIST,
          payload: store,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

export const editStore =
  (store: StoreTypes) => (dispatch: Dispatch<ActionEditStoreTypes>) => {
    api.patch(`/stores/${store.id}`, store).then((response) => {
      dispatch({
        type: EDIT_STORE,
        payload: store,
      });
    });
  };

export const getJobs = () => (dispatch: Dispatch<ActionGetJobsTypes>) => {
  api.get(`/reports/jobs`).then((response) => {
    let jobList = response.data.map((job: JobTypes, i: number) => {
      return (job = {
        ...job,
        id: i + 1,
      });
    });
    dispatch({
      type: GET_JOBS,
      payload: jobList,
    });
  });
};

export const getJobsWithError =
  () => (dispatch: Dispatch<ActionGetJobsWithError>) => {
    api.get(`/reports/jobs-with-error`).then((response) => {
      let jobList = response.data.map((job: JobTypes, i: number) => {
        return (job = {
          ...job,
          id: i + 1,
        });
      });
      dispatch({
        type: GET_ERROR_JOBS_LIST,
        payload: jobList,
      });
    });
  };

export const getBlockRaport =
  () => (dispatch: Dispatch<ActionGetBlockRaport>) => {
    api.get(`/reports/blocked`).then((response) => {
      let blockedRaports: string[] = [];
      response.data.map(
        (item: any) => (blockedRaports = [...blockedRaports, item.name])
      );
      dispatch({
        type: BLOCK_REPORT,
        payload: blockedRaports,
      });
    });
  };

export const getReplication =
  () => (dispatch: Dispatch<ActionGetReplication>) => {
    api.get(`/reports/replication`).then((response) => {
      let replication: ReplicationTypes = response.data;
      dispatch({
        type: GET_REPLICATION,
        payload: replication,
      });
    });
  };

export const getJira = () => (dispatch: Dispatch<ActionGetJira>) => {
  api.get(`/jira`).then((response) => {
    let jira: JiraTypes = response.data[0];
    dispatch({
      type: GET_JIRA,
      payload: jira,
    });
  });
};

export const editJira =
  (jira: JiraTypes) => (dispatch: Dispatch<ActionGetJira>) => {
    api
      .post(`/jira`, jira)
      .then((response) => {
        dispatch({
          type: GET_JIRA,
          payload: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
