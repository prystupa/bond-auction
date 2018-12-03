import * as React from "react";

import AppRoute from "../../app/components/AppRoute";
import Auction from "./Auction";

class AuctionRoute extends React.Component {

    render() {
        return <AppRoute title="Auction" component={Auction}/>;
    }
}

export default AuctionRoute;
