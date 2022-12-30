import api from "../api/api";
export const GET_STORELIST = "GET_STORELIST";
export const UPDATE_STORELIST = "UPDATE_STORELIST";
export const EDIT_STORE = "EDIT_STORE";

interface StoreTypes {
  id: number;
  number: string;
  type: string;
  status: string;
  info?: string;
}

export const getStoreList = () => (dispatch: any) => {
  api.get(`/shoplist`).then((response) => {
    let storeList = response.data;
    dispatch({
      type: GET_STORELIST,
      payload: storeList,
    });
  });
};

export const addStoreToStoreList = (store: StoreTypes) => (dispatch: any) => {
  api.post(`/shoplist/add`, store).then((response) => {
    dispatch({
      type: UPDATE_STORELIST,
      payload: store,
    });
  });
};

export const editStore = (store: StoreTypes) => (dispatch: any) => {
  api.patch(`/shoplist/${store.id}`, store).then((response) => {
    dispatch({
      type: EDIT_STORE,
      payload: store,
    });
  });
};
