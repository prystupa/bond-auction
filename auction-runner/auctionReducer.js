function updateMontage(montage, order, seq) {
    const userId = order.placedBy;

    return [{
        userId,
        seq
    },
        ...montage.filter(row => row.userId !== userId)
    ];
}

function viewEntitlements(openTo = '') {
    return openTo.split(/[, ]+/).filter(s => s !== '');
}

// mock auction logic - last bidder always moves to the top
function auctionReducer(state = {
    id: undefined,
    created: undefined,
    montage: [],
    lastSeq: undefined
}, event) {
    const {seq, auction: {id, createdBy, openTo}, order} = event;
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
            entitlements: {
                view: [`id:${createdBy}`, ...viewEntitlements(openTo)]
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
