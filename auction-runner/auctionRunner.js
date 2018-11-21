const request = require('request-promise-native');
const amqp = require('amqplib');

const auctionReducer = require('./auctionReducer');

const EVENTS_EXCHANGE = "events";

async function auctionRunner(auctionId) {
    console.log(`Starting auction handler for ${auctionId}`);

    const connection = await amqp.connect('amqp://message-bus');
    const channel = await connection.createChannel();

    const queue = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(queue.queue, EVENTS_EXCHANGE, `auction.${auctionId}.#`);

    let state = undefined;
    let lastSeq = -1;
    let eventsRequest;

    function applyEvent(event, {quiet} = {}) {
        const {seq} = event;

        if (seq > lastSeq) {
            state = auctionReducer(state, event);
            if (!quiet) {
                console.log(`Auction runner ${auctionId}, state = `, state);
            }
            lastSeq = seq;
        }
    }

    console.log(`Waiting to receive message from queue ${queue.queue} for auction ${auctionId}`);
    channel.consume(queue.queue, async function (msg) {
        await eventsRequest;

        const event = JSON.parse(msg.content.toString());
        console.log(`Auction runner ${auctionId}, received`, event);
        applyEvent(event);
    }, {noAck: true})
        .then(async () => {
            eventsRequest = request({
                url: 'http://event-sourcing:3000/api/events/_search',
                method: 'GET',
                json: {'auction.id': auctionId}
            });

            const events = await eventsRequest;
            events.forEach(event => applyEvent(event, {quiet: true}));
        });
}

module.exports = auctionRunner;
