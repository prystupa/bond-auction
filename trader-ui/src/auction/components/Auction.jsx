import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction} from "../../redux/modules/auction";

function Auction({fetching, auction, error, createAuction}) {
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
        </Grid>
    );
}

const stateMap = ({auction: {fetching, auction, error}}) => ({fetching, auction, error});

export default connect(stateMap, {createAuction})(Auction);
