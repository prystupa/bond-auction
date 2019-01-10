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
- name temporary queues with functional prefix, so it is easier to debug and troubleshoot
- Add a simple field to auction called "openTo", which is a list of 
users allowed to participate. Use this field to demonstrate attribute-based
entitlements (i.e. auction is only broadcast to blotters of allowed
participants)
- Create a test script for demo that includes at least three
different participants and demonstrate both functional and non-functional
capabilities of the POC

### Demo Script
- quickly walk over poject structure in IntelliJ to show the breadth of the prototype, including:
  - UI
  - fontend proxy, scalability, https/wss
  - rest frontend services
  - push frontend services
  - message bus
  - database
  - event sourcing services
  - auction execution engines
- run ```docker-compose up -d --scale auction-runner=2``` to demonstrate how the whole environment comes up in minutes and ready to work with/develop with
- start two web browser windows side-by-side and navigate to the app: [https://localhost:8443](https://localhost:8443), optionally demonstrate https access is enforced
