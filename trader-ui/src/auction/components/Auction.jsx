import * as React from "react";
import {CircularProgress, Typography, Button, Grid} from "@material-ui/core";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction} from "../../redux/modules/auction";

function Auction({fetching, auction, error, messages, createAuction}) {
    return (
        <Grid container={true} spacing={8}>
            <Grid container={true} item={true} alignItems="center" spacing={8}>
                <Grid item={true}>
                    <Button variant="contained" onClick={createAuction}>Create Auction</Button>
                </Grid>
                {fetching &&
                <Grid item={true}><CircularProgress size={20}/></Grid>}
                {auction && <Grid item={true}><Done color="primary"/></Grid>}
                {error && <Grid item={true}><Error color="error"/></Grid>}
            </Grid>

            {auction &&
            <Grid container={true} item={true}>{JSON.stringify(auction)}</Grid>}

            <Grid item={true} xs={12}>
                <Typography variant={"h6"}>Blotter</Typography>
            </Grid>
            {messages.length === 0 &&
            <Grid item={true} xs={12}>
                <Typography variant="body1">You have no messages to display</Typography>
            </Grid>
            }
            {messages.length > 0 &&
            <Grid item={true} xs={12}>
                <Typography variant="body1">You have {messages.length} messages</Typography>
            </Grid>
            }
        </Grid>
    );
}

const stateMap = (
    {
        auction: {fetching, auction, error},
        blotter: {messages}
    }) => ({fetching, auction, error, messages});

export default connect(stateMap, {createAuction})(Auction);
