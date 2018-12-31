// mock auction logic - state is an array of sequencer IDs of events
function auctionReducer(state = {events: []}, event) {
    const {seq} = event;
    const {events} = state;

    return {
        ...state,
        ...event.auction,
        lastSeq: seq,
        events: [...events, seq]
    };
}

module.exports = auctionReducer;
