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

checkEnvVariable('REACT_APP_REGISTRY_STORAGE_ADDRESS');
checkEnvVariable('REACT_APP_INIT_REGISTRY_ADDRESS');
checkEnvVariable('REACT_APP_SCRIPT_EXEC_ADDRESS');
checkEnvVariable('REACT_APP_INIT_CROWDSALE_ADDRESS');
checkEnvVariable('REACT_APP_TOKEN_CONSOLE_ADDRESS');
checkEnvVariable('REACT_APP_CROWDSALE_CONSOLE_ADDRESS');
checkEnvVariable('REACT_APP_CROWDSALE_BUY_TOKENS_ADDRESS');
checkEnvVariable('REACT_APP_MINTED_CAPPED_CROWDSALE_APP_NAME');
checkEnvVariable('REACT_APP_DUTCH_CROWDSALE_APP_NAME');

const devEnvironment = process.env.NODE_ENV === 'development';
if (devEnvironment && !window.web3) {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

function checkEnvVariable(envVar) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} env variable is not present`)
  }
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
