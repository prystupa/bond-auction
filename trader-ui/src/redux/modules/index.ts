import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";

import blotter from "./blotter";


const rootReducer = combineReducers({
    blotter
});

const rootEpic = combineEpics();

export {
    rootReducer,
    rootEpic
};
