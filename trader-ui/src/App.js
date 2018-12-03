import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {CssBaseline} from "@material-ui/core";

import AuctionRoute from "./auction/components/AuctionRoute";
import DashboardRoute from "./dasboard/components/DashboardRoute";


class App extends Component {
    render() {
        return (
            <Router>
                <React.Fragment>
                    <CssBaseline/>
                    <Route exact={true} path="/" component={DashboardRoute}/>
                    <Route path="/auction" component={AuctionRoute}/>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
