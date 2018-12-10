import {flatMap} from "rxjs/operators";
import {ofType} from "redux-observable";

const AUCTION_CREATE = "auction://create";
const AUCTION_CREATED = "auction://created";
const AUCTION_CREATE_FAILED = "auction://create-failed";

const createAuction = () => ({type: AUCTION_CREATE});
const auctionCreated = (auction) => ({type: AUCTION_CREATED, auction});
const createAuctionFailed = (error) => ({type: AUCTION_CREATE_FAILED, error});

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

export {createAuction};
export {createAuctionEpic as auctionEpic};
export default auction;
