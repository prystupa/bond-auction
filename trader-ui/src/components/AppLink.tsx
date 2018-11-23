import {ListItem, ListItemText} from "@material-ui/core";
import {LocationDescriptor} from "history";
import * as React from "react";
import {NavLink} from "react-router-dom";

interface IAppLink {
    to: LocationDescriptor,
    text: string
}

class AppLink extends React.Component<IAppLink> {

    public render() {
        const {text} = this.props;

        return (
            <ListItem button={true} component={this.renderLink}>
                <ListItemText primary={text}/>
            </ListItem>
        );
    }

    private renderLink = (itemProps: {}) => <NavLink to={this.props.to} {...itemProps}/>;
}

export default AppLink;
