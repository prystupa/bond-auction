import {PermScanWifiTwoTone as PermScanWifi, Wifi, WifiOff} from "@material-ui/icons";
import {RxStompState} from "@stomp/rx-stomp";
import * as React from "react";
import {connect} from "react-redux";


function BlotterConnectivityStatus({connectionState}) {
    switch (connectionState) {
        case RxStompState.CLOSED:
        case RxStompState.CLOSING:
            return (
                <span title="Error connecting to blotter service">
                    <WifiOff fontSize={"small"} color={"error"} style={{display: "flex"}}/>
                </span>);
        case RxStompState.OPEN:
            return (
                <span title="Connected to blotter service">
                    <Wifi fontSize={"small"} style={{display: "flex"}}/>
                </span>);
        case RxStompState.CONNECTING:
            return (
                <span title="Connecting to blotter service...">
                    <PermScanWifi fontSize={"small"} style={{display: "flex"}}/>
                </span>);
        default:
            return <span>{`Unknown state ${connectionState}`}</span>;
    }
}

const mapStateToProps = ({blotter: {connectionState}}) => ({
    connectionState
});

export default connect(mapStateToProps)(BlotterConnectivityStatus);
