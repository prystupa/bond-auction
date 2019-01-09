const {saveAuction} = require("./auctionsPersistence");

const process = require('process');
const amqp = require('amqplib');

const BLOTTER_EXCHANGE = "blotter";

function exitOnError(error) {
    if (error) {
        console.error(`Something went wrong, ${error}`);
        process.exit(1);
    }
}

async function startAuctionCapture() {
    const connection = await amqp.connect('amqp://message-bus');
    connection.on('close', exitOnError);
    connection.on('error', exitOnError);

    // output messaging infrastructure
    const channel = await connection.createChannel();
    await channel.assertExchange(BLOTTER_EXCHANGE, 'topic', {durable: false});

    const queue = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(queue.queue, BLOTTER_EXCHANGE, 'auction.#');

    console.log(`Waiting to receive message from auction capture queue ${queue.queue}`);
    return channel.consume(queue.queue, async (msg) => {
        const content = msg.content.toString();
        console.log(`Received ${content}`);

        const action = JSON.parse(content);
        await saveAuction(action);
    }, {noAck: false});
}

startAuctionCapture()
    .catch(exitOnError);
