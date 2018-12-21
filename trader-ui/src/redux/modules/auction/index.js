import {flatMap} from "rxjs/operators";
import {combineEpics, ofType} from "redux-observable";

const AUCTION_CREATE = "auction://create";
const AUCTION_CREATED = "auction://created";
const AUCTION_CREATE_FAILED = "auction://create-failed";
const PLACE_BID = 'auction://place-bid';
const BID_PLACED = 'auction://bid-placed';
const PLACE_BID_FAILED = 'auction://place-bid-failed';

const createAuction = () => ({type: AUCTION_CREATE});
const auctionCreated = (auction) => ({type: AUCTION_CREATED, auction});
const createAuctionFailed = (error) => ({type: AUCTION_CREATE_FAILED, error});
const placeBid = (auctionId) => ({type: PLACE_BID, auctionId});
const bidPlaced = (order) => ({type: BID_PLACED, order});
const placeBidFailed = (error) => ({type: PLACE_BID_FAILED, error});

const INITIAL_STATE = {
    fetching: false,
    auction: null,
    error: null
};

function auction(state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUCTION_CREATE:
            return {
                ...state,
                fetching: true,
                auction: null,
                error: null
            };
        case AUCTION_CREATED: {
            const {auction} = action;
            return {
                ...state,
                fetching: false,
                auction
            };
        }
        case AUCTION_CREATE_FAILED: {
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

function createAuctionEpic(action$) {
    return action$.pipe(
        ofType(AUCTION_CREATE),
        flatMap(async () => {
                try {
                    const response = await fetch(
                        '/api/auctions',
                        {
                            method: 'POST'
                        });

                    const auction = await response.json();
                    return auctionCreated(auction);
                } catch (error) {
                    return createAuctionFailed(error);
                }
            }
        )
    );
}

function placeBidEpic(action$) {
    return action$.pipe(
        ofType(PLACE_BID),
        flatMap(async ({auctionId}) => {
                try {
                    const response = await fetch(
                        `/api/auctions/${auctionId}/orders`,
                        {
                            method: 'POST'
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

const auctionEpic = combineEpics(createAuctionEpic, placeBidEpic);

export {createAuction, placeBid};
export {auctionEpic};
export default auction;
