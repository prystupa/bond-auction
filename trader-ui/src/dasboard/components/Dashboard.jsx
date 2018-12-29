import * as React from "react";
import {connect} from "react-redux";
import {Typography, Grid} from "@material-ui/core";

import {subscribeBlotter, unsubscribeBlotter} from "../../redux/modules/blotter";
import {withAuth} from "@okta/okta-react";
import Auction from "../../auction/components/Auction";
import Blotter from "../../blotter/components/Blotter";


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
        return (
            <Grid container={true} spacing={16}>
                <Grid item={true} xs={12}>
                    <Typography variant="body1">Welcome, {name}</Typography>
                </Grid>
                <Grid item={true} xs={12}>
                    <Auction/>
                </Grid>
                <Grid item={true} xs={12}>
                    <Typography variant={"h6"}>Blotter</Typography>
                </Grid>
                <Grid item={true} xs={12}>
                    <Blotter/>
                </Grid>
            </Grid>
        );
    }

    async _getUser() {
        try {
            const user = await this.props.auth.getUser();
            this.setState({user});
        } catch (e) {
            this.setState({user: {name: '[Unknown]'}})
        }
    }
}

export default connect(null, {subscribeBlotter, unsubscribeBlotter})(withAuth(Dashboard));
