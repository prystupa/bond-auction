import * as React from "react";
import {CircularProgress, Button, Grid, InputLabel, Input, FormControl, InputAdornment} from "@material-ui/core";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction} from "../../redux/modules/auction";


class Auction extends React.PureComponent {

    render() {
        const {
            auctionFetching,
            auction,
            auctionError,
            openTo,
            createAuction
        } = this.props;

        return (
            <Grid container={true} spacing={8} alignItems="flex-end">
                <Grid item={true} xs={11}>
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor="auction-open-to">Open To</InputLabel>
                        <Input id="auction-open-to"
                               value={openTo}
                               endAdornment={
                                   <InputAdornment position={"end"}>
                                       <Button variant="text" onClick={createAuction}>Create</Button>
                                   </InputAdornment>
                               }/>
                    </FormControl>
                </Grid>
                {auctionFetching &&
                <Grid item={true} xs={1}><CircularProgress size={20}/></Grid>}
                {!auctionFetching && auction && <Grid item={true}><Done color="primary"/></Grid>}
                {auctionError && <Grid item={true} xs={1}><Error color="error"/></Grid>}
            </Grid>
        );
    }
}

const stateMap = (
    {
        auction: {fetching: auctionFetching, auction, error: auctionError, openTo},
        order: {fetching: orderFetching, order, error: orderError}
    }) => ({
    auctionFetching, auction, auctionError, openTo,
    orderFetching, order, orderError
});

export default connect(stateMap, {createAuction})(Auction);
