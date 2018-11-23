import * as React from "react";

import AppRoute from "./AppRoute";
import Blotter from "./Blotter";

class BlotterRoute extends React.Component {

    public render() {
        return <AppRoute title="Blotter" component={Blotter}/>;
    }
}

export default BlotterRoute;
