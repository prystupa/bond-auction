import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import 'typeface-roboto';

import App from './App';
import store from "./redux/store";
import registerServiceWorker from './registerServiceWorker';
import './style/index.css';

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
