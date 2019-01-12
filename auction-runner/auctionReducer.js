function updateMontage(montage, order, seq) {
    const userId = order.placedBy;

    return [{
        userId,
        seq
    },
        ...montage.filter(row => row.userId !== userId)
    ];
}

// mock auction logic - last bidder always moves to the top
function auctionReducer(state = {
    id: undefined,
    created: undefined,
    montage: [],
    lastSeq: undefined
}, event) {
    const {seq, auction: {id, createdBy}, order} = event;
    const {montage} = state;

    if (createdBy) {
        // new auction
        return {
            ...state,
            id,
            created: {
                userId: createdBy,
                seq
            },
            lastSeq: seq,
        }
    }

    if (order) {
        return {
            ...state,
            montage: updateMontage(montage, order, seq),
            lastSeq: seq
        }
    }

    return state;
}

module.exports = auctionReducer;
