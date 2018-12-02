import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";

import blotter, {blotterEpic, IBlotterState} from "./blotter";

interface IRootState {
    blotter: IBlotterState
}

const rootReducer = combineReducers({
    blotter
});

const rootEpic = combineEpics(blotterEpic);

export {
    IRootState,
    rootReducer,
    rootEpic
};
