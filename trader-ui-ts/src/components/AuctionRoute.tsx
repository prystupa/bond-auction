import * as React from "react";

import AppRoute from "./AppRoute";
import Auction from "./Auction";

class AuctionRoute extends React.Component {

    public render() {
        return <AppRoute title="Auction" component={Auction}/>;
    }
}

export default AuctionRoute;
