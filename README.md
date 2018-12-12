# bond-auction POC
POC for bond auction trading system.
Before you begin you need to have a valid Okta organization URL and client ID. 
If you don't have one you can create a free developer organization at [Okta Developer](https://developer.okta.com).

Then export your client ID and organization URL, then run docker-compose:

```bash
export REACT_APP_OKTA_CLIENT_ID={clientId}
export REACT_APP_OKTA_ORG_URL=https://{yourOktaDomain}
docker-compose up -d
```
Or, if working on/testing fail-over for various components,
scale up with --scale, e.g.:

```bash
docker-compose up -d --scale auction-runner=2
```