import {RxStomp} from "@stomp/rx-stomp";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";

const CONNECTED = 'blotter-service://connected';
const CONNECTION_STATE = 'blotter-service://connection-state';
const BLOTTER_SNAPSHOT = 'blotter-service://snapshot';
const BLOTTER_UPDATE = 'blotter-service://update';

const BLOTTER_DESTINATION = '/exchange/blotter/#';

const blotterConnected = (message) => ({type: CONNECTED, message});
const blotterConnectionState = (message) => ({type: CONNECTION_STATE, message});
const blotterError = (message) => ({type: 'blotter-service://error', message});
const blotterSnapshot = (messages) => ({type: BLOTTER_SNAPSHOT, messages});
const blotterUpdate = (message) => ({type: BLOTTER_UPDATE, message});

async function getSnapshot(accessToken) {
    const response = await fetch(
        '/api/auctions',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

    return await response.json();
}

function subscribe(accessToken) {
    return Observable.create(async (observer) => {

        // TODO: multiple .subscribe(observer) is not a good pattern - redo
        // TODO: get-snapshot then subscribe for updates can loose events - redo

        const auctions = await getSnapshot(accessToken);
        observer.next(blotterSnapshot(auctions));

        const rxStomp = new RxStomp();
        rxStomp.configure({
            brokerURL: "wss://localhost:8444/ws",
            connectHeaders: {
                login: 'guest',
                passcode: 'guest',
                Authorization: `Bearer ${accessToken}`
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
            .pipe(map(message => blotterUpdate(JSON.parse(message.body))))
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


export {CONNECTION_STATE, BLOTTER_SNAPSHOT, BLOTTER_UPDATE};
export {subscribe};
