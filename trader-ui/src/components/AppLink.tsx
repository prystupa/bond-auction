import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import * as React from "react";
import {Link, Route} from "react-router-dom";

interface IAppLink {
    to: string,
    exact?: boolean,
    primary: string,
    secondary?: string,
    icon?: any
}

class AppLink extends React.Component<IAppLink> {

    public render() {
        const {to, exact} = this.props;

        return (
            <Route path={to} exact={exact} children={this.renderListItem}/>
        );
    }

    private renderListItem = ({match}: any) => {
        const {primary, secondary, icon} = this.props;

        return (
            <ListItem button={true} component={this.renderLink} selected={!!match}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={primary} secondary={secondary}/>
            </ListItem>
        );
    };

    private renderLink = (itemProps: {}) => <Link to={this.props.to} {...itemProps}/>;
}

export default AppLink;
