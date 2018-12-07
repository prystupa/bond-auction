import {Typography} from "@material-ui/core";
import * as React from "react";
import {connect} from "react-redux";
import {subscribeBlotter, unsubscribeBlotter} from "../../redux/modules/blotter";
import {withAuth} from "@okta/okta-react";


class Dashboard extends React.PureComponent {

    state = {
        user: {}
    };

    componentDidMount() {
        this.props.subscribeBlotter();
        this._getUser();
    }

    componentWillUnmount() {
        this.props.unsubscribeBlotter();
    }

    render() {
        const {user: {name}} = this.state;
        return <Typography variant="body1">Welcome, {name}</Typography>;
    }

    async _getUser() {
        const user = await this.props.auth.getUser();
        this.setState({user});
    }
}

export default connect(null, {subscribeBlotter, unsubscribeBlotter})(withAuth(Dashboard));
