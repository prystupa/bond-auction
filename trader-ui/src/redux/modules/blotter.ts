import {Action} from "redux";
import {ofType} from "redux-observable";
import {Observable} from "rxjs";
import {flatMap} from "rxjs/operators";

const BLOTTER_SUBSCRIBE = "blotter://subscribe";

const subscribeBlotter = () => ({type: BLOTTER_SUBSCRIBE});

function blotter(state = {}/*, action: Action*/) {
    return state;
}

function subscribeEpic(action$: Observable<Action>): Observable<Action> {
    return action$.pipe(
        ofType(BLOTTER_SUBSCRIBE),
        flatMap(() => {
            return [];
        })
    );
}

export {subscribeBlotter};
export {subscribeEpic as blotterEpic};
export default blotter;
