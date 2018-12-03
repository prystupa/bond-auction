import {
    AppBar,
    Divider,
    Drawer,
    IconButton,
    List,
    Toolbar,
    Typography,
    withStyles
} from "@material-ui/core";
import {
    DashboardOutlined as DashboardIcon,
    Menu as MenuIcon,
    WatchLaterOutlined as AuctionIcon
} from "@material-ui/icons";
import * as React from "react";
import AppLink from "./AppLink";

const styles = ({mixins, spacing}) => ({
    brand: {
        ...mixins.gutters(),
        paddingBottom: spacing.unit,
        paddingTop: spacing.unit
    },
    main: {
        ...mixins.gutters(),
        paddingBottom: spacing.unit * 2,
        paddingTop: spacing.unit * 2
    },
    status: {
        marginLeft: 'auto'
    }
});


class AppRoute extends React.Component {
    state = {
        open: false
    };

    render() {
        const {classes, title, statusComponent: Status, component: Component} = this.props;

        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton onClick={this._handleDrawerOpen} color={"inherit"}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            {title}
                        </Typography>
                        {!!Status && <div className={classes.status}><Status/></div>}
                    </Toolbar>
                </AppBar>
                <Drawer variant="temporary"
                        open={this.state.open}
                        onClose={this._handleDrawerClose}>
                    <div className={classes.brand}>
                        <Typography variant="h6">Bond Trader</Typography>
                        <Typography variant="caption">Auction POC</Typography>
                    </div>
                    <Divider/>
                    <List component="nav">
                        <AppLink to="/" exact={true} primary="Dashboard" icon={<DashboardIcon/>}/>
                        <AppLink to="/auction" primary="Auction" icon={<AuctionIcon/>}/>
                    </List>
                </Drawer>

                <main className={classes.main}>
                    <Component/>
                </main>
            </React.Fragment>
        );
    }

    _handleDrawerOpen = () => {
        this.setState({open: true});
    };

    _handleDrawerClose = () => {
        this.setState({open: false});
    };
}

export default withStyles(styles)(AppRoute);
