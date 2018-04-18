const { concurrent, series } = require('nps-utils')

const combineSolidityScript = 'submodules/solidity-flattener/index.js'
const tokenMarketNetPath = 'submodules/poa-token-market-net-ico/contracts/'
const contractFolder = './public/contracts'
const extensionPath = './scripts/POAExtendedCrowdSale.sol'

const safeMathLibContractName = 'SafeMathLibExt'
const crowdsaleContractName = 'MintedTokenCappedCrowdsaleExt'
const crowdsaleTokenContractName = 'CrowdsaleTokenExt'
const crowdsalePricingStrategyContractName = 'FlatPricingExt'
const nullFinalizeAgentContractName = 'NullFinalizeAgentExt'
const finalizeAgentContractName = 'ReservedTokensFinalizeAgent'
const registryContractName = 'Registry'

module.exports = {
  scripts: {
    build: {
      default: series(
        'git submodule update --init --recursive --remote', 'cd submodules/solidity-flattener', 'npm install', 'cd ../../',
        'npm install',
        'cd submodules/poa-web3-1.0', 'npm install', 'cd ../../',
        'npm install --no-save submodules/poa-web3-1.0/packages/web3',
        //'nps contracts',
        'node scripts/build.js',
        'cp ./build/index.html ./build/invest.html',
        'cp ./build/index.html ./build/crowdsale.html',
        'cp ./build/index.html ./build/manage.html'
      )
    },
    contracts: {
      default: series.nps('contracts.generate', 'contracts.compile'),
      generate: {
        default: concurrent.nps(
          'contracts.generate.safeMathLib',
          'contracts.generate.crowdsale',
          'contracts.generate.crowdsaleToken',
          'contracts.generate.crowdsalePricingStrategy',
          'contracts.generate.crowdsaleNullFinalizeAgent',
          'contracts.generate.crowdsaleFinalizeAgent',
          'contracts.generate.registry'
        ),
        safeMathLib: `node ${combineSolidityScript} ${tokenMarketNetPath}/${safeMathLibContractName}.sol ${contractFolder} SafeMathLibExt`,
        crowdsale: `node ${combineSolidityScript} ${tokenMarketNetPath}/${crowdsaleContractName}.sol ${contractFolder} CrowdsaleWhiteListWithCap`,
        crowdsaleToken: `node ${combineSolidityScript} ${tokenMarketNetPath}/${crowdsaleTokenContractName}.sol ${contractFolder} CrowdsaleWhiteListWithCapToken`,
        crowdsalePricingStrategy: `node ${combineSolidityScript} ${tokenMarketNetPath}/${crowdsalePricingStrategyContractName}.sol ${contractFolder} CrowdsaleWhiteListWithCapPricingStrategy`,
        crowdsaleNullFinalizeAgent: `node ${combineSolidityScript} ${tokenMarketNetPath}/${nullFinalizeAgentContractName}.sol ${contractFolder} NullFinalizeAgent`,
        crowdsaleFinalizeAgent: `node ${combineSolidityScript} ${tokenMarketNetPath}/${finalizeAgentContractName}.sol ${contractFolder} FinalizeAgent`,
        registry: `node ${combineSolidityScript} ${tokenMarketNetPath}/${registryContractName}.sol ${contractFolder} Registry`,
      },
      compile: {
        default: concurrent.nps(
          'contracts.compile.safeMathLibExt',
          'contracts.compile.crowdsale',
          'contracts.compile.crowdsaleToken',
          'contracts.compile.crowdsalePricingStrategy',
          'contracts.compile.crowdsaleNullFinalizeAgent',
          'contracts.compile.crowdsaleFinalizeAgent',
          'contracts.compile.registry'
        ),
        safeMathLibExt: `node ./scripts/compileContract.js ${contractFolder}/SafeMathLibExt_flat.sol ${contractFolder} ${extensionPath} false ${safeMathLibContractName} SafeMathLibExt`,
        crowdsale: `node ./scripts/compileContract.js ${contractFolder}/CrowdsaleWhiteListWithCap_flat.sol ${contractFolder} ${extensionPath} false ${crowdsaleContractName} CrowdsaleWhiteListWithCap`,
        crowdsaleToken: `node ./scripts/compileContract.js ${contractFolder}/CrowdsaleWhiteListWithCapToken_flat.sol ${contractFolder} ${extensionPath} false ${crowdsaleTokenContractName} CrowdsaleWhiteListWithCapToken`,
        crowdsalePricingStrategy: `node ./scripts/compileContract.js ${contractFolder}/CrowdsaleWhiteListWithCapPricingStrategy_flat.sol ${contractFolder} ${extensionPath} false ${crowdsalePricingStrategyContractName} CrowdsaleWhiteListWithCapPricingStrategy`,
        crowdsaleNullFinalizeAgent: `node ./scripts/compileContract.js ${contractFolder}/NullFinalizeAgent_flat.sol ${contractFolder} ${extensionPath} false ${nullFinalizeAgentContractName} NullFinalizeAgent`,
        crowdsaleFinalizeAgent: `node ./scripts/compileContract.js ${contractFolder}/FinalizeAgent_flat.sol ${contractFolder} ${extensionPath} false ${finalizeAgentContractName} FinalizeAgent`,
        registry: `node ./scripts/compileContract.js ${contractFolder}/Registry_flat.sol ${contractFolder} ${extensionPath} false ${registryContractName} Registry`
      }
    },
    dev: {
      default: 'npm run installWeb3 && nps contracts.generate.registry && nps contracts.compile.registry && npm run deployRegistry && npm start',
      fast: 'npm run installWeb3 && nps contracts.generate.registry && nps contracts.compile.registry && npm run deployRegistry && node scripts/start.js'
    },
    test: {
      default: series(
        'bash ./start_testrpc.sh',
        'cd ./submodules/poa-token-market-net-ico/',
        'npm install',
        'node_modules/.bin/truffle migrate --network testrpc',
        'node_modules/.bin/truffle test --network testrpc',
        'cd ../../',
        'nps test.e2e'
      ),
      e2e: {
        default: series(
          'nps test.e2e.prepare',
          'nps test.e2e.start',
          'npm run delay',
          'cd submodules/token-wizard-test-automation',
          'npm run test1'
        ),
        prepare: series(
          'nps contracts',
          'cd submodules/token-wizard-test-automation',
          'npm i',
          'npm run e2e-deployRegistry',
          'cp .env ../../.env'
        ),
        start: 'PORT=3000 BROWSER=none node scripts/start.js &'
      }
    }
  }
}
