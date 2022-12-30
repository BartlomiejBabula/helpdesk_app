import { createStore, applyMiddleware } from "redux";
import { RootReducer } from "../reducers/RootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

export const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
