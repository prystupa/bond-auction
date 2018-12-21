import {RxStomp} from "@stomp/rx-stomp";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";

const CONNECTED = 'blotter-service://connected';
const CONNECTION_STATE = 'blotter-service://connection-state';
const BLOTTER_UPDATE = 'blotter-service://update';

const BLOTTER_DESTINATION = '/exchange/blotter/#';

const blotterConnected = (message) => ({type: CONNECTED, message});
const blotterConnectionState = (message) => ({type: CONNECTION_STATE, message});
const blotterError = (message) => ({type: 'blotter-service://error', message});
const blotterUpdate = (message) => ({type: BLOTTER_UPDATE, message});

function subscribe() {
    return Observable.create((observer) => {

        const rxStomp = new RxStomp();
        rxStomp.configure({
            brokerURL: "wss://localhost:8444/ws",
            connectHeaders: {
                login: 'guest',
                passcode: 'guest'
            }
        });
        const connectedSubscription = rxStomp.connected$
            .pipe(map(message => (blotterConnected(message))))
            .subscribe(observer);
        const connectionStateSubscription = rxStomp.connectionState$
            .pipe(
                tap(state => console.log('connection state', state)),
                map(message => (blotterConnectionState(message)))
            )
            .subscribe(observer);
        const errorsSubscription = rxStomp.stompErrors$
            .pipe(
                tap(error => console.log('stomp errors', error)),
                map(message => blotterError(message))
            )
            .subscribe(observer);
        const blotterSubscription = rxStomp.watch(BLOTTER_DESTINATION)
            .pipe(map(message => blotterUpdate(message.body)))
            .subscribe(observer);

        rxStomp.activate();
        return () => {
            connectedSubscription.unsubscribe();
            connectionStateSubscription.unsubscribe();
            errorsSubscription.unsubscribe();
            blotterSubscription.unsubscribe();
            return rxStomp.deactivate();
        };
    });
}


export {CONNECTION_STATE, BLOTTER_UPDATE};
export {subscribe};
