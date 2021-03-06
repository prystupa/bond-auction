import * as React from "react";
import {
    Button,
    Grid,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    Tooltip
} from "@material-ui/core";
import {Security} from "@material-ui/icons";
import {connect} from "react-redux";
import {placeBid} from "../../redux/modules/order";

function nickname(email) {
    return email.substring(0, email.indexOf("@"));
}

class Blotter extends React.PureComponent {
    _placeBidHandlers = {};
    _placeBidHandler = (id) => {
        const {placeBid} = this.props;

        if (!this._placeBidHandlers[id]) {
            this._placeBidHandlers[id] = () => placeBid(id);
        }

        return this._placeBidHandlers[id];
    };

    render() {
        const {messages} = this.props;

        return (
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Auction</TableCell>
                            <TableCell>Bids</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.map((message, index) =>
                            <TableRow key={`message-${index}`}>
                                <TableCell>
                                    <Grid container={true} spacing={8} wrap="nowrap">
                                        <Grid item={true}>
                                            <Tooltip title={
                                                <pre>
                                                    {JSON.stringify(message.entitlements, null, 2)}
                                                </pre>}>
                                                <Security/>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item={true}>
                                            {message.id}
                                            <div>{`${nickname(message.created.userId)} (${message.created.seq})`}</div>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    {message.montage.map(({userId, seq}) => (
                                        <div key={seq}>{`${nickname(userId)} (${seq})`}</div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Button size="small" color="primary"
                                            onClick={this._placeBidHandler(message.id)}>
                                        Bid
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {messages.length === 0 &&
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>You have no auctions to display</TableCell>
                        </TableRow>
                    </TableFooter>}
                </Table>
            </Paper>
        );
    }
}

const stateMap = ({
                      blotter: {messages}
                  }) => ({messages});

export default connect(stateMap, {placeBid})(Blotter);
