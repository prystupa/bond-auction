import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import * as React from "react";
import {Link, Route} from "react-router-dom";

class AppLink extends React.Component {

    render() {
        const {to, exact} = this.props;

        return (
            <Route path={to} exact={exact} children={this._renderListItem}/>
        );
    }

    _renderListItem = ({match}) => {
        const {primary, secondary, icon} = this.props;

        return (
            <ListItem button={true} component={this._renderLink} selected={!!match}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={primary} secondary={secondary}/>
            </ListItem>
        );
    };

    _renderLink = (itemProps) => <Link to={this.props.to} {...itemProps}/>;
}

export default AppLink;
