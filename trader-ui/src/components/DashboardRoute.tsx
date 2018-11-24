import * as React from "react";

import AppRoute from "./AppRoute";
import Dashboard from "./Dashboard";

class DashboardRoute extends React.Component {

    public render() {
        return <AppRoute title="Blotter" component={Dashboard}/>;
    }
}

export default DashboardRoute;
