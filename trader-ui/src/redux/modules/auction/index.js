import {flatMap} from "rxjs/operators";
import {combineEpics, ofType} from "redux-observable";

const AUCTION_CREATE = "redux://auction/create";
const AUCTION_CREATED = "redux://auction/created";
const AUCTION_CREATE_FAILED = "redux://auction/create-failed";
const AUCTION_UPDATE_OPEN_TO = "redux://auction/update-open-to";

const createAuction = () => ({type: AUCTION_CREATE});
const auctionCreated = (auction) => ({type: AUCTION_CREATED, auction});
const createAuctionFailed = (error) => ({type: AUCTION_CREATE_FAILED, error});
const updateAuctionOpenTo = (openTo) => ({type: AUCTION_UPDATE_OPEN_TO, openTo});

const INITIAL_STATE = {
    openTo: 'domain:com',
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
                auction: null,
                error
            }
        }
        case AUCTION_UPDATE_OPEN_TO: {
            const {openTo} = action;
            return {
                ...state,
                openTo
            };
        }
        default:
            return state;
    }
}

function createAuctionEpic(action$, state$) {
    return action$.pipe(
        ofType(AUCTION_CREATE),
        flatMap(async () => {
                try {
                    const {
                        auction: {openTo},
                        auth: {accessToken}
                    } = state$.value;
                    const response = await fetch(
                        '/api/auctions',
                        {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({openTo})
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

const auctionEpic = combineEpics(createAuctionEpic);

export {createAuction, updateAuctionOpenTo};
export {auctionEpic};
export default auction;
