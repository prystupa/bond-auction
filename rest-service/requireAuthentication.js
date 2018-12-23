function requireAuthentication(req, res, next) {

    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.*)/);

    if (!match) {
        return res.status(401).end();
    }

    next();
}

module.exports = requireAuthentication;
