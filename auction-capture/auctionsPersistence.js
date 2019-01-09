const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    id: String,
    events: Object,
    createdBy: String,
    lastSeq: Number
});

auctionSchema.index({id: 1}, {unique: true});

const Auction = mongoose.model('Auction', auctionSchema);

const initialized = mongoose.connect('mongodb://event-sourcing-db/auctions')
    .then(async () => {
        console.log('Connected to event sourcing database, auctions collection');
        await Auction.ensureIndexes();
    }).catch(error => {
        console.error(`Something went wrong, ${error}`);
        process.exit(1);
    });

async function saveAuction(auction) {
    await initialized;
    await Auction.findOneAndUpdate({id: auction.id}, auction, {upsert: true});
}

module.exports = {
    saveAuction
};
