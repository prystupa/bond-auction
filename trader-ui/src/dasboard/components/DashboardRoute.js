import * as React from "react";

import BlotterConnectivityStatus from "./BlotterConnectivityStatus";
import AppRoute from "../../app/components/AppRoute";
import Dashboard from "./Dashboard";


class DashboardRoute extends React.Component {

    render() {
        return <AppRoute title="Home"
                         statusComponent={BlotterConnectivityStatus}
                         component={Dashboard}/>;
    }
}

export default DashboardRoute;
