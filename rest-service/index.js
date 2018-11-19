const express = require('express');
const handleCreateAuction = require('./handleCreateAuction');
const handleSendOrder = require('./handleSendOrder');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from bond-auction REST services!');
});

app.post('/api/auctions', handleCreateAuction);
app.post('/api/auctions/:id/orders', handleSendOrder);

app.listen(3000, () => console.log('Listening on port 3000'));
