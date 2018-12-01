import * as React from "react";

import BlotterConnectivityStatus from "../../blotter/components/BlotterConnectivityStatus";
import AppRoute from "../../components/AppRoute";
import Dashboard from "./Dashboard";


class DashboardRoute extends React.Component {

    public render() {
        return <AppRoute title="Blotter" statusComponent={BlotterConnectivityStatus} component={Dashboard}/>;
    }
}

export default DashboardRoute;
