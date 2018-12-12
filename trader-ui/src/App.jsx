import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {CssBaseline} from "@material-ui/core";
import {Security, SecureRoute, ImplicitCallback} from "@okta/okta-react";

import AuctionRoute from "./auction/components/AuctionRoute";
import DashboardRoute from "./dasboard/components/DashboardRoute";

const config = {
    issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
    redirect_uri: window.location.origin + '/implicit/callback',
    client_id: `${process.env.REACT_APP_OKTA_CLIENT_ID}`
};

class App extends Component {
    render() {
        return (
            <Router>
                <Security {...config}>
                    <CssBaseline/>
                    <SecureRoute exact={true} path="/" component={DashboardRoute}/>
                    <SecureRoute path="/auction" component={AuctionRoute}/>
                    <Route path='/implicit/callback' component={ImplicitCallback}/>
                </Security>
            </Router>
        );
    }
}

export default App;
