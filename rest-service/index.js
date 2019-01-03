const express = require('express');
const requireAuthentication = require('./requireAuthentication');
const handleGetAuctions = require('./handleGetAuctions');
const handleCreateAuction = require('./handleCreateAuction');
const handleSendOrder = require('./handleSendOrder');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from bond-auction REST services!');
});

app.get('/api/auctions', requireAuthentication, handleGetAuctions);
app.post('/api/auctions', requireAuthentication, handleCreateAuction);
app.post('/api/auctions/:id/orders', requireAuthentication, handleSendOrder);

app.listen(3000, () => console.log('Listening on port 3000'));
