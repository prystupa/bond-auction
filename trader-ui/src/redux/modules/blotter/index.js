import {RxStompState} from "@stomp/rx-stomp";
import {ofType} from "redux-observable";
import {flatMap, takeUntil} from "rxjs/operators";
import {BLOTTER_UPDATE, CONNECTION_STATE, subscribe} from "./service";

const BLOTTER_SUBSCRIBE = "blotter://subscribe";
const BLOTTER_UNSUBSCRIBE = "blotter://unsubscribe";

const subscribeBlotter = () => ({type: BLOTTER_SUBSCRIBE});
const unsubscribeBlotter = () => ({type: BLOTTER_UNSUBSCRIBE});

const INITIAL_STATE = {
    connectionState: RxStompState.CLOSED,
    lastSeq: -1,
    messages: []
};

function blotter(state = INITIAL_STATE, action) {
    switch (action.type) {
        case CONNECTION_STATE:
            const {message} = action;

            return {
                ...state,
                connectionState: message
            };
        case BLOTTER_UPDATE: {
            const {message} = action;
            const {lastSeq} = message;

            const duplicate = lastSeq <= state.lastSeq;
            const update = duplicate ? {...message, _duplicate: true} : message;

            return {
                ...state,
                lastSeq: duplicate ? state.lastSeq : lastSeq,
                messages: [...state.messages, update]
            };
        }
        default:
            return state;
    }
}


function subscribeEpic(action$, state$) {
    return action$.pipe(
        ofType(BLOTTER_SUBSCRIBE),
        flatMap(() => {
            const {auth: {accessToken}} = state$.value;
            return subscribe(accessToken).pipe(
                takeUntil(action$.pipe(ofType(BLOTTER_UNSUBSCRIBE)))
            );
        })
    );
}

export {subscribeBlotter, unsubscribeBlotter};
export {subscribeEpic as blotterEpic};
export default blotter;
