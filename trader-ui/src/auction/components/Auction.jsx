import * as React from "react";
import {CircularProgress, Button, Grid} from "@material-ui/core";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction} from "../../redux/modules/auction";

function TradeAction({title, fetching, response, error, action}) {
    return (
        <>
            <Grid container={true} item={true} alignItems="center" spacing={8}>
                <Grid item={true}>
                    <Button variant="contained" onClick={action}>{title}</Button>
                </Grid>
                {fetching &&
                <Grid item={true}><CircularProgress size={20}/></Grid>}
                {!fetching && response && <Grid item={true}><Done color="primary"/></Grid>}
                {error && <Grid item={true}><Error color="error"/></Grid>}
            </Grid>
        </>
    );
}

class Auction extends React.PureComponent {

    render() {
        const {
            auctionFetching,
            auction,
            auctionError,
            createAuction
        } = this.props;

        return (
            <Grid container={true} spacing={8}>
                <TradeAction title="Create Auction"
                             fetching={auctionFetching}
                             error={auctionError}
                             response={auction}
                             action={createAuction}/>
            </Grid>
        );
    }
}

const stateMap = (
    {
        auction: {fetching: auctionFetching, auction, error: auctionError},
        order: {fetching: orderFetching, order, error: orderError}
    }) => ({
    auctionFetching, auction, auctionError,
    orderFetching, order, orderError
});

export default connect(stateMap, {createAuction})(Auction);
