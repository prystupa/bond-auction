const express = require('express');
const amqp = require('amqplib');

const {saveEvent, searchEvents} = require('./eventsPersistence');

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

async function handleSaveEvent(req, res) {
    const event = req.body;

    try {
        const persistedEvent = await saveEvent(event);
        await sendEventMessage(persistedEvent);
        res.end();
    } catch (error) {
        res.status(500).send(`Something failed while handling event, ${error}`);
    }
}

async function handleSearchEvents(req, res) {
    const query = req.body;
    const events = await searchEvents(query);
    res.send(events);
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Hello from bond-auction event-sourcing REST services!'));
app.post('/api/events', handleSaveEvent);
app.get('/api/events/_search', handleSearchEvents);

app.listen(3000, () => console.log('Listening on port 3000'));
