import { GET_STORELIST } from "../actions/UserActions";
import { UPDATE_STORELIST } from "../actions/UserActions";
import { EDIT_STORE } from "../actions/UserActions";
import { USER_LOGGED_IN } from "../actions/UserActions";
import { USER_LOGGED_OUT } from "../actions/UserActions";
import { GET_USER } from "../actions/UserActions";
import { GET_ERROR_JOBS_LIST } from "../actions/UserActions";
import { GET_JOBS } from "../actions/UserActions";
import { BLOCK_REPORT } from "../actions/UserActions";

interface StoreTypes {
  id: number;
  number: string;
  type: string;
  status: string;
  info?: string;
}

interface State {
  isLogged: boolean;
  storeList?: [StoreTypes] | any;
  reportsBlock: string[];
}

const initState: State = {
  isLogged: false,
  storeList: [],
  reportsBlock: [],
};

export const userReducer = (state = initState, action: any) => {
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
