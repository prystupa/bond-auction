const request = require("request");
const uuid = require('uuid/v4');

function handleCreateAuction(req, res) {
    const id = uuid();
    const auction = {
        ...req.body,
        id,
        createdBy: req.jwt.claims.sub
    };

    const event = {
        auction,
        key: `auction.${id}.create`
    };

    request({
        url: 'http://event-sourcing:3000/api/events',
        method: 'POST',
        json: event
    }, (error, response, body) => {
        if (error) {
            res.status(response.statusCode).send(body);
        } else {
            res.send(auction);
        }
    });
}

module.exports = handleCreateAuction;
