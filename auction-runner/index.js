const process = require('process');
const amqp = require('amqplib');

const auctionRunner = require('./auctionRunner');

const EVENTS_EXCHANGE = "events";
const CREATE_AUCTION_QUEUE = "create-auction";

async function provisionAuctions() {
    const connection = await amqp.connect('amqp://message-bus');
    const channel = await connection.createChannel();

    await channel.assertExchange(EVENTS_EXCHANGE, 'topic', {durable: true});
    await channel.assertQueue(CREATE_AUCTION_QUEUE, {durable: true});
    channel.bindQueue(CREATE_AUCTION_QUEUE, EVENTS_EXCHANGE, 'auction.*.create');

    console.log(`Waiting to receive message from queue ${CREATE_AUCTION_QUEUE}`);
    return channel.consume(CREATE_AUCTION_QUEUE, (msg) => {
        const content = msg.content.toString();
        console.log(`Received ${content}`);

        const event = JSON.parse(content);
        auctionRunner(event.auction.id);
    }, {noAck: true});
}

provisionAuctions()
    .catch(error => {
        console.error(`Something went wrong, ${error}`);
        process.exit(1);
    });
