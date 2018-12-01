import {
    AppBar,
    Divider,
    Drawer,
    IconButton,
    List,
    Theme,
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

const styles = ({mixins, spacing}: Theme) => ({
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


interface IProps {
    classes: {
        brand: string,
        main: string,
        status: string
    },
    title: string,
    statusComponent?: React.ComponentType<any>,
    component: React.ComponentType<any>
}

interface IState {
    open: boolean
}


class AppRoute extends React.Component<IProps, IState> {
    public state = {
        open: false
    };

    public render() {
        const {classes, title, statusComponent: Status, component: Component} = this.props;

        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton onClick={this.handleDrawerOpen} color={"inherit"}>
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
                        onClose={this.handleDrawerClose}>
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

    private handleDrawerOpen = () => {
        this.setState({open: true});
    };

    private handleDrawerClose = () => {
        this.setState({open: false});
    };
}

export default withStyles(styles)(AppRoute);
