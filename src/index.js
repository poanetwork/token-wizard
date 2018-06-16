import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { REACT_PREFIX } from './utils/constants'
import * as stores from './stores';
import 'airbnb-js-shims'
import 'font-awesome/css/font-awesome.css'

useStrict(true);

//todo: remove unused contracts
checkEnvVariable(`${REACT_PREFIX}REGISTRY_IDX_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}PROVIDER_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}REGISTRY_EXEC_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_IDX_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_CROWDSALE_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_CROWDSALE_MANAGER_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_TOKEN_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_TOKEN_MANAGER_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_IDX_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_CROWDSALE_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_CROWDSALE_MANAGER_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_TOKEN_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_TOKEN_MANAGER_ADDRESS`);
checkEnvVariable(`${REACT_PREFIX}MINTED_CAPPED_APP_NAME`);
checkEnvVariable(`${REACT_PREFIX}DUTCH_APP_NAME`);

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
