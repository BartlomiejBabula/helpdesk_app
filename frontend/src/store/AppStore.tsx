import { createStore, applyMiddleware } from "redux";
import { RootReducer } from "../reducers/RootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

export const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof store.getState>;
export type Dispatcher = ThunkDispatch<RootState, undefined, AnyAction>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
