import {Typography} from "@material-ui/core";
import * as React from "react";
import {connect} from "react-redux";
import {subscribeBlotter} from "../redux/modules/blotter";

interface IDashboard {
    subscribeBlotter: () => void
}

class Dashboard extends React.PureComponent<IDashboard> {

    public componentDidMount() {
        this.props.subscribeBlotter();
    }

    public render() {
        return <Typography variant="body1">TODO - Blotter</Typography>;
    }
}

export default connect(
    null,
    {subscribeBlotter}
)(Dashboard);
