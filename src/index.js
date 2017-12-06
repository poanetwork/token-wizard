import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import * as stores from './stores';
useStrict(true);


ReactDOM.render(
  <Provider { ...stores }>
    <App />
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
