import {Typography} from "@material-ui/core";
import * as React from "react";
import {connect} from "react-redux";
import {subscribeBlotter, unsubscribeBlotter} from "../../redux/modules/blotter";


class Dashboard extends React.PureComponent {

    componentDidMount() {
        this.props.subscribeBlotter();
    }

    componentWillUnmount() {
        this.props.unsubscribeBlotter();
    }

    render() {
        return <Typography variant="body1">TODO - Blotter</Typography>;
    }
}

export default connect(
    null,
    {subscribeBlotter, unsubscribeBlotter}
)(Dashboard);
