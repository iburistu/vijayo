import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

import './main.css';

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept();
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
