const request = require("request");
const uuid = require('uuid/v4');

function handleSendOrder(req, res) {
    const auctionId = req.params.id;
    const id = uuid();
    const order = {
        ...req.body,
        id,
        placedBy: req.jwt.claims.sub
    };

    const event = {
        auction: {id: auctionId},
        order,
        key: `auction.${auctionId}.order.${id}.send`
    };

    request({
        url: 'http://event-sourcing:3000/api/events',
        method: 'POST',
        json: event
    }, (error, response, body) => {
        if (error) {
            res.status(response.statusCode).send(body);
        } else {
            res.send(order);
        }
    });
}

module.exports = handleSendOrder;
