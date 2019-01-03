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

async function handleGetAuctions(req, res) {
    const auctions = await searchAuctions({});
    res.send(auctions);
}

module.exports = handleGetAuctions;
