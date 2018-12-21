import * as React from "react";
import {CircularProgress, Typography, Button, Grid} from "@material-ui/core";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction} from "../../redux/modules/auction";
import {placeBid} from "../../redux/modules/order";

function TradeAction({title, fetching, response, error, action}) {
    return (
        <>
            <Grid container={true} item={true} alignItems="center" spacing={8}>
                <Grid item={true}>
                    <Button variant="contained" onClick={action}>{title}</Button>
                </Grid>
                {fetching &&
                <Grid item={true}><CircularProgress size={20}/></Grid>}
                {response && <Grid item={true}><Done color="primary"/></Grid>}
                {error && <Grid item={true}><Error color="error"/></Grid>}
            </Grid>
            {response &&
            <Grid item={true} xs={12}>{JSON.stringify(response)}</Grid>
            }
        </>
    );
}

class Auction extends React.PureComponent {
    _placeBid = () => {
        const {placeBid, auction: {id}} = this.props;
        placeBid(id);
    };

    render() {
        const {
            auctionFetching, auction, auctionError,
            orderFetching, order, orderError,
            messages,
            createAuction
        } = this.props;

        return (
            <Grid container={true} spacing={8}>
                <TradeAction title="Create Auction"
                             fetching={auctionFetching}
                             error={auctionError}
                             response={auction}
                             action={createAuction}/>

                {auction &&
                <TradeAction title="Place Bid"
                             fetching={orderFetching}
                             error={orderError}
                             response={order}
                             action={this._placeBid}/>
                }

                <Grid item={true} xs={12}>
                    <Typography variant={"h6"}>Blotter</Typography>
                </Grid>
                {messages.length === 0 &&
                <Grid item={true} xs={12}>
                    <Typography variant="body1">You have no messages to display</Typography>
                </Grid>
                }
                {messages.map((message, index) =>
                    <Grid key={`message-${index}`} item={true} xs={12}>
                        <Typography variant="body1">{JSON.stringify(message)}</Typography>
                    </Grid>
                )}
            </Grid>
        );
    }
}

const stateMap = (
    {
        auction: {fetching: auctionFetching, auction, error: auctionError},
        order: {fetching: orderFetching, order, error: orderError},
        blotter: {messages}
    }) => ({
    auctionFetching, auction, auctionError,
    orderFetching, order, orderError,
    messages
});

export default connect(stateMap, {createAuction, placeBid})(Auction);
