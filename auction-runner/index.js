const process = require('process');
const amqp = require('amqplib');

const auctionRunner = require('./auctionRunner');

const EVENTS_EXCHANGE = "events";
const BLOTTER_EXCHANGE = "blotter";
const CREATE_AUCTION_QUEUE = "create-auction";

function exitOnError(error) {
    if (error) {
        console.error(`Something went wrong, ${error}`);
        process.exit(1);
    }
}

async function provisionAuctions() {
    const connection = await amqp.connect('amqp://message-bus');
    connection.on('close', exitOnError);
    connection.on('error', exitOnError);

    // input messaging infrastructure
    const channel = await connection.createChannel();
    await channel.assertExchange(EVENTS_EXCHANGE, 'topic', {durable: true});
    await channel.assertQueue(CREATE_AUCTION_QUEUE, {durable: true});
    channel.bindQueue(CREATE_AUCTION_QUEUE, EVENTS_EXCHANGE, 'auction.*.create');

    // output messaging infrastructure
    const publishChannel = await connection.createChannel();
    await publishChannel.assertExchange(BLOTTER_EXCHANGE, 'topic', {durable: false});

    console.log(`Waiting to receive message from queue ${CREATE_AUCTION_QUEUE}`);
    return channel.consume(CREATE_AUCTION_QUEUE, (msg) => {
        const content = msg.content.toString();
        console.log(`Received ${content}`);

        const event = JSON.parse(content);
        auctionRunner(event.auction.id);
    }, {noAck: false});
}

provisionAuctions()
    .catch(exitOnError);
