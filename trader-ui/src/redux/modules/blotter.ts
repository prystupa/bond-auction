import {Action} from "redux";
import {ofType} from "redux-observable";
import {interval, Observable} from "rxjs";
import {flatMap, mapTo, takeUntil} from "rxjs/operators";

const BLOTTER_SUBSCRIBE = "blotter://subscribe";
const BLOTTER_UNSUBSCRIBE = "blotter://unsubscribe";

const subscribeBlotter = () => ({type: BLOTTER_SUBSCRIBE});
const unsubscribeBlotter = () => ({type: BLOTTER_UNSUBSCRIBE});

function blotter(state = {}/*, action: Action*/) {
    return state;
}

function subscribeEpic(action$: Observable<Action>): Observable<Action> {
    return action$.pipe(
        ofType(BLOTTER_SUBSCRIBE),
        flatMap(() => {
            return interval(1000).pipe(
                mapTo({type: 'temp-test'}),
                takeUntil(action$.pipe(ofType(BLOTTER_UNSUBSCRIBE)))
            );
        })
    );
}

export {subscribeBlotter, unsubscribeBlotter};
export {subscribeEpic as blotterEpic};
export default blotter;
