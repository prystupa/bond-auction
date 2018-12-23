import {flatMap} from "rxjs/operators";
import {combineEpics, ofType} from "redux-observable";

const PLACE_BID = 'order://place-bid';
const BID_PLACED = 'order://bid-placed';
const PLACE_BID_FAILED = 'order://place-bid-failed';

const placeBid = (auctionId) => ({type: PLACE_BID, auctionId});
const bidPlaced = (order) => ({type: BID_PLACED, order});
const placeBidFailed = (error) => ({type: PLACE_BID_FAILED, error});

const INITIAL_STATE = {
    fetching: false,
    order: null,
    error: null
};

function order(state = INITIAL_STATE, action) {
    switch (action.type) {
        case PLACE_BID:
            return {
                ...state,
                fetching: true,
                order: null,
                error: null
            };
        case BID_PLACED: {
            const {order} = action;
            return {
                ...state,
                fetching: false,
                order
            };
        }
        case PLACE_BID_FAILED: {
            const {error} = action;
            return {
                ...state,
                fetching: false,
                error
            }
        }
        default:
            return state;
    }
}


function placeBidEpic(action$, state$) {
    return action$.pipe(
        ofType(PLACE_BID),
        flatMap(async ({auctionId}) => {
                try {
                    const {auth: {accessToken}} = state$.value;
                    const response = await fetch(
                        `/api/auctions/${auctionId}/orders`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });

                    const order = await response.json();
                    return bidPlaced(order);
                } catch (error) {
                    return placeBidFailed(error);
                }
            }
        )
    );
}

const orderEpic = combineEpics(placeBidEpic);

export {placeBid};
export {orderEpic};
export default order;
