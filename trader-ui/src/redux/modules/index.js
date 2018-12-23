import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";

import auction, {auctionEpic} from "./auction";
import order, {orderEpic} from "./order";
import blotter, {blotterEpic} from "./blotter";
import auth from "./auth";

const rootReducer = combineReducers({
    auth,
    auction,
    order,
    blotter
});

const rootEpic = combineEpics(blotterEpic, auctionEpic, orderEpic);

export {
    rootReducer,
    rootEpic
};
