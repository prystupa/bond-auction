const express = require('express');
const amqp = require('amqplib');

const persistEvent = require('./persistEvent');

const EVENTS_EXCHANGE = "events";


async function sendEventMessage(event) {
    const connection = await amqp.connect('amqp://message-bus');
    const channel = await connection.createConfirmChannel();

    await channel.assertExchange(EVENTS_EXCHANGE, 'topic', {durable: true});

    const payload = JSON.stringify(event);
    console.log(`Publishing ${payload} to exchange ${EVENTS_EXCHANGE}`);
    channel.publish(EVENTS_EXCHANGE, event.key, Buffer.from(JSON.stringify(event)));
    return channel.waitForConfirms().then(() => connection.close());
}

async function handleEvent(req, res) {
    const event = req.body;

    try {
        const persistedEvent = await persistEvent(event);
        await sendEventMessage(persistedEvent);
        res.end();
    } catch (error) {
        res.status(500).send(`Something failed while handling event, ${error}`);
    }
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from bond-auction event-sourcing REST services!');
});

app.post('/api/event', handleEvent);

app.listen(3000, () => console.log('Listening on port 3000'));
