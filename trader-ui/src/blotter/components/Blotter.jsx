import * as React from "react";
import {
    Button,
    Grid,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from "@material-ui/core";
import {connect} from "react-redux";
import {placeBid} from "../../redux/modules/order";


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
            <Grid container={true}>
                {messages.length === 0 &&
                <Grid item={true} xs={12}>
                    <Typography variant="body1">You have no auction to display</Typography>
                </Grid>
                }
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Created by</TableCell>
                            <TableCell>Bids</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {messages.map((message, index) =>
                            <TableRow key={`message-${index}`}>
                                <TableCell>{message.id}</TableCell>
                                <TableCell>{message.createdBy}</TableCell>
                                <TableCell>{message.events.join(', ')}</TableCell>
                                <TableCell>
                                    <Button size="small" color="primary" onClick={this._placeBidHandler(message.id)}>Place
                                        Bid</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Grid>
        );
    }
}

const stateMap = ({
                      blotter: {messages}
                  }) => ({messages});

export default connect(stateMap, {placeBid})(Blotter);
