import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";

import auction, {auctionEpic} from "./auction";
import blotter, {blotterEpic} from "./blotter";

const rootReducer = combineReducers({
    auction,
    blotter
});

const rootEpic = combineEpics(blotterEpic, auctionEpic);

export {
    rootReducer,
    rootEpic
};
