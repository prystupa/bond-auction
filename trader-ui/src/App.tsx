import {CssBaseline} from "@material-ui/core";
import * as React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import AuctionRoute from "./components/AuctionRoute";
import BlotterRoute from "./components/BlotterRoute";


class App extends React.Component {

    public render() {

        return (
            <Router>
                <React.Fragment>
                    <CssBaseline/>
                    <Route exact={true} path="/" component={BlotterRoute}/>
                    <Route path="/auction" component={AuctionRoute}/>
                </React.Fragment>
            </Router>
        );
    }
}


export default App;
