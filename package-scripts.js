const {concurrent, series, ncp} = require('nps-utils')
const path = require('path')

const combineSolidityScript = path.join('submodules', 'solidity-flattener', 'index.js')
const tokenMarketNetPath = path.join('submodules', 'poa-token-market-net-ico', 'contracts')
const contractFolder = path.join('.', 'public', 'contracts')
const extensionPath = path.join('.', 'scripts', 'POAExtendedCrowdSale.sol')
const compileContractPath = path.join('.', 'scripts', 'compileContract.js')
const buildContractPath = (...paths) => path.join(tokenMarketNetPath, ...paths)
const buildCompilePath = (...paths) => path.join(contractFolder, ...paths)

module.exports = {
  scripts: {
    build: {
      default: series(
        'git submodule update --init  --recursive --remote',
        'cd submodules/solidity-flattener',
        'npm install',
        'cd ../../',
        'npm install',
        'cd submodules/poa-web3-1.0', 'npm install', 'cd ../../',
        'npm install --no-save submodules/poa-web3-1.0/packages/web3',
        'node scripts/build.js',
        ncp('./build/index.html ./build/invest.html'),
        ncp('./build/index.html ./build/crowdsale.html'),
        ncp('./build/index.html ./build/manage.html'),
        ncp('./build/index.html ./build/stats.html')
      )
    },

    test: {
      default: series(
        'npm run installWeb3',
        'npm run testContractsMintedCappedCrowdsale',
        'npm run testContractsDutchAuction',
        'npm run e2eMintedCappedCrowdsale',
        'npm run e2eDutchAuction'
      ),
      deployContracts: series(
        'npm install truffle',
        'npm install solc',
        './node_modules/.bin/truffle compile',
        './node_modules/.bin/truffle migrate --network development',
        './node_modules/.bin/truffle test --network development'
      ),
      prepare: series(
        'bash ./scripts/start_ganache.sh',
        'cd ./submodules/auth-os-applications/',
        'git checkout -f master',
      ),
      MintedCappedCrowdsale: series(
        'bash ./scripts/start_ganache.sh',
        'cd ./submodules/auth-os-applications',
        'git checkout -f e2e',
        'cd ./TokenWizard/crowdsale/MintedCappedCrowdsale/',
        'npm init -y',
        'npm i',
        'npm i authos-solidity',
        'nps test.deployContracts',
        'cd ../../../../../',
        'bash ./scripts/stop_ganache.sh'
      ),
      DutchAuction: series(
        'bash ./scripts/start_ganache.sh',
        'cd ./submodules/auth-os-applications',
        'git checkout -f e2e',
        'cd ./TokenWizard/crowdsale/DutchCrowdsale/',
        'npm init -y',
        'npm i',
        'npm i authos-solidity',
        'nps test.deployContracts',
        'cd ../../../../../',
        'bash ./scripts/stop_ganache.sh'
      ),
      e2e: {
        default: series(
        ),
        Minted: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMinted',
          'nps test.e2e.stop'
        ),
        MintedUI: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedUI',
          'nps test.e2e.stop'
        ),
        MintedWhitelist: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedWhitelist',
          'nps test.e2e.stop'
        ),
        MintedMincap: series(
          'nps test.e2e.prepareMinted',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eMintedMincap',
          'nps test.e2e.stop'
        ),
        Dutch: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutch',
          'nps test.e2e.stop'
        ),
        DutchUI: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchUI',
          'nps test.e2e.stop'
        ),
        DutchWhitelist: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchWhitelist',
          'nps test.e2e.stop'
        ),
        DutchMincap: series(
          'nps test.e2e.prepareDutch',
          'cd submodules/token-wizard-test-automation',
          'npm run e2eDutchMincap',
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
        start: 'PORT=3000 BROWSER=none node scripts/start.js &',
        stop: series(
          'cd ../../',
          'bash ./scripts/stop_ganache.sh',
          'kill ` lsof -t -i:3000`'
        )
      }
    }
  }
}
