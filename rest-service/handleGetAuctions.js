const mongoose = require('mongoose');

// TODO: this is a copy/paste from capture - refactor for reuse instead
const auctionSchema = new mongoose.Schema({
    id: String,
    events: Object,
    createdBy: String,
    lastSeq: Number
});

const Auction = mongoose.model('Auction', auctionSchema);

mongoose.connect('mongodb://event-sourcing-db/auctions');

function searchAuctions(query) {
    return Auction.find(query).exec();
}

function userTokens(userId) {
    const [names, domains] = userId.split("@");
    return [
        `id:${userId}`,
        ...names.split('.').map(name => `name:${name}`),
        ...domains.split('.').map(domain => `domain:${domain}`)
    ];
}

async function handleGetAuctions(req, res) {
    const tokens = userTokens(req.jwt.claims.sub);
    const auctions = await searchAuctions({
        'entitlements.view': {$in: tokens}
    });
    res.send(auctions);
}

module.exports = handleGetAuctions;
