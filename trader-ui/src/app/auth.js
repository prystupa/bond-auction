import React from "react";
import {connect} from "react-redux";
import {withAuth} from "@okta/okta-react";

import {authenticated} from "../redux/modules/auth";

function captureAuth(Component) {

    class Auth extends React.PureComponent {

        async componentDidMount() {
            const {auth, authenticated} = this.props;
            const accessToken = await auth.getAccessToken();
            authenticated(accessToken);
        }

        render() {
            return <Component/>;
        }
    }

    return connect(null, {authenticated})(withAuth(Auth));
}

export {
    captureAuth
};
