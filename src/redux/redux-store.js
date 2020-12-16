import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import { reducer as formReducer } from "redux-form";
import thunkMiddleware from "redux-thunk";
import authReducer from "./auth-reducer";
import productReducer from "./product-reducer";
import appReducer from "./app-reducer";

const reducers = combineReducers({
  form: formReducer,
  app: appReducer,
  auth: authReducer,
  products: productReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

window.__store__ = store;
export default store;
