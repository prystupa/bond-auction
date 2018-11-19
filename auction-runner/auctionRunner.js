const amqp = require('amqplib');

const EVENTS_EXCHANGE = "events";

async function auctionRunner(auctionId) {
    console.log(`Starting auction handler for ${auctionId}`);

    const connection = await amqp.connect('amqp://message-bus');
    const channel = await connection.createChannel();

    const queue = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(queue.queue, EVENTS_EXCHANGE, `auction.${auctionId}.#`);

    console.log(`Waiting to receive message from queue ${queue.queue} for auction ${auctionId}`);
    return channel.consume(queue.queue, function (msg) {
        console.log(`Auction runner ${auctionId}, received ${msg.content.toString()}`);
    }, {noAck: true});
}

module.exports = auctionRunner;
