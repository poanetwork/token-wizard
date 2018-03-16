import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import 'airbnb-js-shims'
import 'font-awesome/css/font-awesome.css'

useStrict(true);

if (!process.env['REACT_APP_REGISTRY_ADDRESS']) {
  throw new Error('REACT_APP_REGISTRY_ADDRESS env variable is not present')
}

const devEnvironment = process.env.NODE_ENV === 'development';
if (devEnvironment && !window.web3) {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

function renderApp(App) {
  ReactDOM.render(
    <Provider { ...stores }>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}

renderApp(App)

if (module.hot) {
  module.hot.accept(() => {
    const NextApp = require('./App').default
    renderApp(NextApp)
  })
}


registerServiceWorker();
