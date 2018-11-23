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
import {Menu as MenuIcon} from "@material-ui/icons";
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
    }
});


interface IProps {
    classes: {
        brand: string,
        main: string
    },
    title: string,
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
        const {classes, title, component: Component} = this.props;

        return (
            <React.Fragment>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton onClick={this.handleDrawerOpen}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            {title}
                        </Typography>
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
                        <AppLink to="/" text="Blotter"/>
                        <AppLink to="/auction" text="Auction"/>
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
