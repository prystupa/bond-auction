import {applyMiddleware, compose, createStore} from "redux";
import {createEpicMiddleware} from "redux-observable";

import {rootEpic, rootReducer} from "./modules";

const epicMiddleware = createEpicMiddleware();

function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(epicMiddleware))
    );

    epicMiddleware.run(rootEpic);

    return store;
}

export default configureStore();
