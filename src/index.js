import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import * as stores from './stores';
useStrict(true);

if (!process.env['REACT_APP_REGISTRY_ADDRESS']) {
  throw new Error('REACT_APP_REGISTRY_ADDRESS env variable is not present')
}

ReactDOM.render(
  <Provider { ...stores }>
    <App />
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
