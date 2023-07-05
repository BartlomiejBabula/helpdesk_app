import api from "../api/api";
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

interface StoreTypes {
  id: number;
  storeNumber: string;
  storeType: string;
  status: string;
  information?: string;
}

export const logOutAction = () => ({
  type: USER_LOGGED_OUT,
});

export const logInAction = () => ({
  type: USER_LOGGED_IN,
});

export const getUserProfile = () => (dispatch: any) => {
  api.get(`/users/profile`).then((response) => {
    let user = response.data;
    dispatch({
      type: GET_USER,
      payload: user,
    });
    api.get(`/stores`).then((response) => {
      let storeList = response.data;
      dispatch({
        type: GET_STORELIST,
        payload: storeList,
      });
    });
  });
};

export const getStoreList = () => (dispatch: any) => {
  api.get(`/stores`).then((response) => {
    let storeList = response.data;
    dispatch({
      type: GET_STORELIST,
      payload: storeList,
    });
  });
};

export const addStoreToStoreList = (store: StoreTypes) => (dispatch: any) => {
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

export const editStore = (store: StoreTypes) => (dispatch: any) => {
  api.patch(`/stores/${store.id}`, store).then((response) => {
    dispatch({
      type: EDIT_STORE,
      payload: store,
    });
  });
};

export const getJobs = () => (dispatch: any) => {
  api.get(`/reports/jobs`).then((response) => {
    let jobList = response.data.map((job: any, i: number) => {
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

export const getJobsWithError = () => (dispatch: any) => {
  api.get(`/reports/jobs-with-error`).then((response) => {
    let jobList = response.data.map((job: any, i: number) => {
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

export const getBlockRaport = () => (dispatch: any) => {
  api.get(`/reports/blocked`).then((response) => {
    let blockedRaports: any[] = [];
    response.data.map(
      (item: any) => (blockedRaports = [...blockedRaports, item.name])
    );
    dispatch({
      type: BLOCK_REPORT,
      payload: blockedRaports,
    });
  });
};

export const getReplication = () => (dispatch: any) => {
  api.get(`/reports/replication`).then((response) => {
    let replication = response.data;
    dispatch({
      type: GET_REPLICATION,
      payload: replication,
    });
  });
};
