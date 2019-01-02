const mongoose = require('mongoose');

let seq;

const eventSchema = new mongoose.Schema({
    key: String,
    auction: Object,
    order: Object,
    seq: Number
});

eventSchema.index({seq: 1}, {unique: true});
eventSchema.index({'auction.id': 1});

const Event = mongoose.model('Event', eventSchema);

const initialized = mongoose.connect('mongodb://event-sourcing-db/events')
    .then(async () => {
        console.log('Connected to event sourcing database');
        await Event.ensureIndexes();
        return Event.estimatedDocumentCount().exec().then(count => seq = count);
    });

async function saveEvent(event) {
    await initialized;
    const persistedEvent = {
        ...event,
        seq: seq++
    };

    await new Event(persistedEvent).save();
    return persistedEvent;
}

function searchEvents(query) {
    return Event.find(query).exec();
}


module.exports = {
    saveEvent,
    searchEvents
};
