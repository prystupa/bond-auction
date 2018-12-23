# bond-auction POC
POC for bond auction trading system.
Before you begin you need to have a valid Okta organization URL and client ID. 
If you don't have one you can create a free developer organization at [Okta Developer](https://developer.okta.com).

Then export your client ID and organization URL, then run docker-compose:

```bash
export APP_OKTA_CLIENT_ID={clientId}
export APP_OKTA_ORG_URL=https://{yourOktaDomain}
docker-compose up -d
```
Or, if working on/testing fail-over for various components,
scale up with --scale, e.g.:

```bash
docker-compose up -d --scale auction-runner=2
```

### Backlog
- Implement service to fetch a snapshot of the blotter, wire UI to call it
to populate the blotter with snapshot (currently blotter onbly populated
via real-time updates)
- Replace RabbitMQ STOMP bridge with Vert.x based STOMP push-service, 
have client authenticate itself sending accessToken in Connect frame,
use JWT verifier to authenticate/authorize blotter subscription 
(follow rest-service pattern)
- Add a simple field to auction called "openTo", which is a list of 
users allowed to participate. Use this field to demonstrate attribute-based
entitlements (i.e. auction is only broadcast to blotters of allowed
participants)
- Create a test script for demo that includes at least three
different participants and demonstrate both functional and non-functional
capabilities of the POC

