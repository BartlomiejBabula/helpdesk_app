import api from "../api/api";
export const GET_STORELIST = "GET_STORELIST";
export const GET_USER = "GET_USER";
export const UPDATE_STORELIST = "UPDATE_STORELIST";
export const EDIT_STORE = "EDIT_STORE";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_LOGGED_IN = "USER_LOGGED_IN";

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
