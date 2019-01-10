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
- login to the app as User-1 in one window and User-2 in another, demonstrate integration with Okta
- demonstrate that UI application has established a webscoket connection (white WiFi icon) for realtime communication, demonstrate resiliency when forcing connection down by restarting proxy and/or push-services, simulating offline in Chrome
- User-1 creates an auction by clicking button in UI, both users see the auction immediately in their blotters, demonstrate rest services/event-sourcing/push-services working
  - demonstrate Okta integration on the service by examining rest services/push services logs, demonstrate Okta token validation and user identity (authentication) integration
- User-2 creates an auction by clicking button in UI
  - demonstrate new auction makes it to blotters of both users
  - demoonstate auction engines scalability by observing auction-runners logs and sharing of the work by 2 instances
- Do multiple bids on both auctions by both users
  - demonstrate blotter updates flow to both UIs in realtime
  - demonstrate each auciton-runner handles its own share of auctions
- Using ```docker kill bond-auction_auction-runner_1``` demonstrate failover capabitlity by examining logs and confirming remaining instance took over the auctions from failed instance; demonstrate new bids are still coming through and flow to blotters
- Demonstrate useful developer tools embedded in the framework:
  - changes in UI reflected automatically (create-react-app)
  - changes in push-services reflected automatically (Java, Vert.x)
  - web dashboard for Mongo database for data mining/debugging/troubleshooting
  - web dashboard for RabbitMQ queue for message mining/debugging/troubleshooting
