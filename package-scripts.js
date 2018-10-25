const { concurrent, series, ncp } = require('nps-utils')

module.exports = {
  scripts: {
    build: {
      default: series(
        'git submodule update -f --init  --recursive --remote',
        'cd submodules/solidity-flattener',
        'npm install',
        'cd ../../',
        'npm install',
        'cd submodules/poa-web3-1.0',
        'npm install',
        'cd ../../',
        'npm install --no-save submodules/poa-web3-1.0/packages/web3',
        'bash ./scripts/generateProxyContracts.sh',
        'npm run moveTruffleConfigBuild',
        'npm run moveSolcVersionOutputBuild',
        'node scripts/build.js',
        ncp('./build/index.html ./build/invest.html'),
        ncp('./build/index.html ./build/crowdsale.html'),
        ncp('./build/index.html ./build/manage.html'),
        ncp('./build/index.html ./build/stats.html')
      )
    },
    dev: {
      default: series('git submodule update --init --recursive --remote', 'npm run installWeb3'),
      Minted: {
        default: series(
          'nps test.e2e.stop',
          'bash ./scripts/start_ganache.sh',
          'cd ./submodules/auth-os-applications',
          'git checkout -f e2e',
          'cd ./TokenWizard/crowdsale/MintedCappedCrowdsale',
          'npm install',
          'npm i authos-solidity',
          'nps test.deployContracts',
          'cp .env ../../../../../.env',
          'cd ../../../../../',
          'npm run installWeb3',
          'bash ./scripts/generateProxyContracts.sh',
          'npm run moveTruffleConfigPublic',
          'npm run moveSolcVersionOutputPublic',
          'nps test.e2e.start'
        )
      },
      Dutch: {
        default: series(
          'nps test.e2e.stop',
          'bash ./scripts/start_ganache.sh',
          'cd ./submodules/auth-os-applications',
          'git checkout -f e2e',
          'cd ./TokenWizard/crowdsale/DutchCrowdsale',
          'npm install',
          'npm i authos-solidity',
          'nps test.deployContracts',
          'cp .env ../../../../../.env',
          'cd ../../../../../',
          'npm run installWeb3',
          'bash ./scripts/generateProxyContracts.sh',
          'npm run moveTruffleConfigPublic',
          'npm run moveSolcVersionOutputPublic',
          'nps test.e2e.start'
        )
      }
    },
    test: {
      default: series(
        'npm run installWeb3',
        'npm run testContractsMintedCappedCrowdsale',
        'npm run testContractsDutchPart1',
        'npm run testContractsDutchPart2',
        'npm run testContractsDutchPart3',
        'npm run testContractsDutchPart4',
        'npm run e2eMinted',
        'npm run e2eDutch'
      ),
      deployContracts: series(
        'npm install truffle',
        'npm install solc',
        './node_modules/.bin/truffle compile',
        './node_modules/.bin/truffle migrate --network development',
        './node_modules/.bin/truffle test --network development'
      ),
      prepareForMinted: series(
        'bash ./scripts/stop_ganache.sh',
        'bash ./scripts/start_ganache.sh',
        'cd ./submodules/auth-os-applications/',
        'git checkout -f master',
        'cd ./TokenWizard/crowdsale/MintedCappedCrowdsale/',
        'npm init -y',
        'npm i',
        'npm i authos-solidity'
      ),
      prepareForDutch: series(
        'bash ./scripts/stop_ganache.sh',
        'bash ./scripts/start_ganache.sh',
        'cd ./submodules/auth-os-applications/',
        'git checkout -f master',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        'npm init -y',
        'npm i',
        'npm i authos-solidity',
        'npm install truffle',
        'npm install solc',
        './node_modules/.bin/truffle compile',
        './node_modules/.bin/truffle migrate --network development'
      ),
      MintedCappedCrowdsale: series(
        'nps test.prepareForMinted',
        'cd ./submodules/auth-os-applications/',
        'cd ./TokenWizard/crowdsale/MintedCappedCrowdsale/',
        'nps test.deployContracts',
        'cd ../../../../../',
        'nps test.e2e.stop'
      ),
      DutchPart1: series(
        'nps test.prepareForDutch',
        'cd ./submodules/auth-os-applications/',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        './node_modules/.bin/truffle test --network development ./test/sale_standart_and_flat_price.js',
        'cd ../../../../../',
        'nps test.e2e.stop'
      ),
      DutchPart2: series(
        'nps test.prepareForDutch',
        'cd ./submodules/auth-os-applications/',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        './node_modules/.bin/truffle test --network development ./test/sale_various_price_decimals0.js',
        'cd ../../../../../',
        'nps test.e2e.stop'
      ),
      DutchPart3: series(
        'nps test.prepareForDutch',
        'cd ./submodules/auth-os-applications/',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        './node_modules/.bin/truffle test --network development ./test/sale_various_price_decimals18.js',
        'cd ../../../../../',
        'nps test.e2e.stop'
      ),
      DutchPart4: series(
        'nps test.prepareForDutch',
        'cd ./submodules/auth-os-applications/',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        './node_modules/.bin/truffle test --network development ./test/admin.js',
        './node_modules/.bin/truffle test --network development ./test/deploy_test.js',
        './node_modules/.bin/truffle test --network development ./test/init_test.js',
        './node_modules/.bin/truffle test --network development ./test/token.js',
        'cd ../../../../../',
        'nps test.e2e.stop'
      ),
      e2e: {
        default: series('nps test.e2e.Minted', 'nps test.e2e.Dutch'),
        Minted: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMinted',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        MintedUI: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedUI',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        MintedWhitelist: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedWhitelist',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        MintedMincap: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedMincap',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        Dutch: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutch',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        DutchUI: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchUI',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        DutchWhitelist: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchWhitelist',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        DutchMincap: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchMincap',
          'cd ../../',
          'nps test.e2e.stop'
        ),
        prepareMinted: series(
          'bash ./scripts/start_ganache.sh',
          'cd ./submodules/auth-os-applications',
          'git checkout -f e2e',
          'cd ./TokenWizard/crowdsale/MintedCappedCrowdsale',
          'npm install',
          'npm i authos-solidity',
          'nps test.deployContracts',
          'cp .env ../../../../../.env',
          'cd ../../../../../',
          'nps test.e2e.start',
          'npm run delay',
          'cd submodules/token-wizard-test-automation',
          'npm install'
        ),
        prepareDutch: series(
          'nps test.e2e.stop',
          'bash ./scripts/start_ganache.sh',
          'cd ./submodules/auth-os-applications',
          'git checkout -f e2e',
          'cd ./TokenWizard/crowdsale/DutchCrowdsale',
          'npm install',
          'npm i authos-solidity',
          'nps test.deployContracts',
          'cp .env ../../../../../.env',
          'cd ../../../../../',
          'nps test.e2e.start',
          'npm run delay',
          'cd submodules/token-wizard-test-automation',
          'npm install'
        ),
        start: 'PORT=3000 BROWSER=none node scripts/start.js &',
        stop: series('bash ./scripts/stop_ganache.sh', 'bash ./scripts/stop_port3000.sh')
      }
    }
  }
}
