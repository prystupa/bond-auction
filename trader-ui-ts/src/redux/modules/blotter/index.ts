import {RxStompState} from "@stomp/rx-stomp";
import {Action} from "redux";
import {ofType} from "redux-observable";
import {Observable} from "rxjs";
import {flatMap, takeUntil} from "rxjs/operators";
import {CONNECTION_STATE, subscribe} from "./service";

const BLOTTER_SUBSCRIBE = "blotter://subscribe";
const BLOTTER_UNSUBSCRIBE = "blotter://unsubscribe";

const subscribeBlotter = () => ({type: BLOTTER_SUBSCRIBE});
const unsubscribeBlotter = () => ({type: BLOTTER_UNSUBSCRIBE});

interface IBlotterState {
    connectionState: RxStompState
}

const INITIAL_STATE: IBlotterState = {
    connectionState: RxStompState.CLOSED
};

function blotter(state = INITIAL_STATE, action: any) {
    switch (action.type) {
        case CONNECTION_STATE:
            const {message} = action;

            return {
                ...state,
                connectionState: message
            };
    }

    return state;
}


function subscribeEpic(action$: Observable<Action>): Observable<Action> {
    return action$.pipe(
        ofType(BLOTTER_SUBSCRIBE),
        flatMap(() => {
            return subscribe().pipe(
                takeUntil(action$.pipe(ofType(BLOTTER_UNSUBSCRIBE)))
            );
        })
    );
}

export {subscribeBlotter, unsubscribeBlotter};
export {subscribeEpic as blotterEpic};
export {IBlotterState};
export default blotter;
