import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";

import blotter, {blotterEpic} from "./blotter";

const rootReducer = combineReducers({
    blotter
});

const rootEpic = combineEpics(blotterEpic);

export {
    rootReducer,
    rootEpic
};
