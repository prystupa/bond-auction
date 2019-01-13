import * as React from "react";
import PropTypes from "prop-types";
import {
    CircularProgress,
    Button,
    Grid,
    InputLabel,
    Input,
    FormControl,
    InputAdornment,
    FormHelperText
} from "@material-ui/core";
import {Done, ErrorOutline as Error} from "@material-ui/icons";
import {connect} from "react-redux";

import {createAuction, updateAuctionOpenTo} from "../../redux/modules/auction";


class Auction extends React.PureComponent {

    _onOpenToChange = (e) => {
        const {updateAuctionOpenTo} = this.props;
        updateAuctionOpenTo(e.target.value);
    };

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
                               onChange={this._onOpenToChange}
                               endAdornment={
                                   <InputAdornment position={"end"}>
                                       <Button variant="text" onClick={createAuction}>Create</Button>
                                   </InputAdornment>}
                        />
                    </FormControl>
                </Grid>
                {auctionFetching &&
                <Grid item={true}><CircularProgress size={20}/></Grid>}
                {!auctionFetching && auction && <Grid item={true}><Done color="primary"/></Grid>}
                {auctionError && <Grid item={true}><Error color="error"/></Grid>}
                <Grid item={true} xs={12}>
                    <FormHelperText>
                        Specify space separated set of tokens to define new auction's
                        visibility. Only users with at least one of the specified tokens in their profile will be able
                        to see it.
                    </FormHelperText>
                    <FormHelperText>
                        In this POC user tokens are assigned based on email in Okta. E.g.
                        <strong> john.smith@gmail.com </strong>
                        will have the following tokens:
                        <strong> id:john.smith@gmail.com, name:john, name:smith, domain:gmail, domain:com</strong>.
                    </FormHelperText>
                </Grid>
            </Grid>
        );
    }

    static propTypes = {
        createAuction: PropTypes.func.isRequired,
        updateAuctionOpenTo: PropTypes.func.isRequired
    };
}

const stateMap = (
    {
        auction: {fetching: auctionFetching, auction, error: auctionError, openTo},
        order: {fetching: orderFetching, order, error: orderError}
    }) => ({
    auctionFetching, auction, auctionError, openTo,
    orderFetching, order, orderError
});

export default connect(stateMap, {createAuction, updateAuctionOpenTo})(Auction);
