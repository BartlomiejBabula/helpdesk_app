import { GET_STORELIST } from "../actions/UserActions";
import { UPDATE_STORELIST } from "../actions/UserActions";
import { EDIT_STORE } from "../actions/UserActions";

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
}

const initState: State = {
  isLogged: false,
  storeList: [],
};

export const userReducer = (state = initState, action: any) => {
  switch (action.type) {
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
    default:
      return state;
  }
};
