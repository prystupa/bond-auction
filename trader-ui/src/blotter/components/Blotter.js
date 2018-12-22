import * as React from "react";
import {Grid, Typography, withStyles} from "@material-ui/core";
import {connect} from "react-redux";


const styles = {
    duplicate: {
        textDecoration: 'line-through'
    }
};

function Blotter({classes, messages}) {

    return (
        <Grid container={true}>
            {messages.length === 0 &&
            <Grid item={true} xs={12}>
                <Typography variant="body1">You have no messages to display</Typography>
            </Grid>
            }
            {messages.map((message, index) =>
                <Grid key={`message-${index}`} item={true} xs={12}>
                    <Typography variant="body1"
                                className={message._duplicate ? classes.duplicate : ''}>
                        {JSON.stringify(message)}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
}

const stateMap = ({
                      blotter: {messages}
                  }) => ({messages});

export default connect(stateMap)(withStyles(styles)(Blotter));
