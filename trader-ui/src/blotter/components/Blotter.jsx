import * as React from "react";
import {
    Button,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableFooter
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
            <Paper>
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
                                    <Button size="small" color="primary"
                                            onClick={this._placeBidHandler(message.id)}>Place
                                        Bid</Button>
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
