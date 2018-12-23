const OktaJwtVerifier = require("@okta/jwt-verifier");

const config = {
    issuer: `${process.env.APP_OKTA_ORG_URL}/oauth2/default`,
    clientId: `${process.env.APP_OKTA_CLIENT_ID}`,
    assertClaims: {
        aud: 'api://default'
    }
};
const oktaJwtVerifier = new OktaJwtVerifier(config);

function requireAuthentication(req, res, next) {

    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.*)/);

    if (!match) {
        return res.status(401).end();
    }

    const accessToken = match[1];

    return oktaJwtVerifier.verifyAccessToken(accessToken)
        .then(jwt => {
            req.jwt = jwt;
            next();
        }).catch(err => {
            res.status(401).send(err.message);
        });
}

module.exports = requireAuthentication;
