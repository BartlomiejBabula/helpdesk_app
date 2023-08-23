import { GET_STORELIST } from "../actions/UserActions";
import { UPDATE_STORELIST } from "../actions/UserActions";
import { EDIT_STORE } from "../actions/UserActions";
import { USER_LOGGED_IN } from "../actions/UserActions";
import { USER_LOGGED_OUT } from "../actions/UserActions";
import { GET_USER } from "../actions/UserActions";
import { GET_ERROR_JOBS_LIST } from "../actions/UserActions";
import { GET_JOBS } from "../actions/UserActions";
import { BLOCK_REPORT } from "../actions/UserActions";
import { GET_REPLICATION } from "../actions/UserActions";
import { GET_JIRA } from "../actions/UserActions";
import { ActionTypes } from "../actions/types";
import { StateTypes, StoreTypes } from "../types";

export const initState: StateTypes = {
  isLogged: false,
  storeList: [],
  reportsBlock: [],
};

export const userReducer = (state = initState, action: ActionTypes) => {
  switch (action.type) {
    case USER_LOGGED_IN: {
      return { ...state, isLogged: true };
    }
    case USER_LOGGED_OUT: {
      return { isLogged: false };
    }
    case GET_USER: {
      return { ...state, isLogged: true, ...action.payload };
    }
    case GET_JIRA: {
      return { ...state, jira: action.payload };
    }
    case GET_STORELIST: {
      return { ...state, storeList: action.payload };
    }
    case UPDATE_STORELIST: {
      return { ...state, storeList: [...state.storeList, action.payload] };
    }
    case EDIT_STORE: {
      return {
        ...state,
        storeList: state.storeList.map((store: StoreTypes) =>
          store.id === action.payload.id ? action.payload : store
        ),
      };
    }
    case GET_JOBS: {
      return { ...state, jobs: action.payload };
    }
    case GET_ERROR_JOBS_LIST: {
      return { ...state, errorJobs: action.payload };
    }
    case GET_REPLICATION: {
      return { ...state, replication: action.payload };
    }
    case BLOCK_REPORT: {
      return {
        ...state,
        reportsBlock: action.payload,
      };
    }
    default:
      return state;
  }
};
