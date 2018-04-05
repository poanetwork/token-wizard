import { setFlatFileContentToState, toFixed } from '../utils/utils'
import { contractStore, tokenStore, tierStore, web3Store } from './index'
import { BigNumber } from 'bignumber.js'

export function getWhiteListWithCapCrowdsaleAssets(networkID) {
  return new Promise((resolve) => {
    getCrowdsaleAsset("REACT_APP_INIT_CROWDSALE", "initCrowdsale", networkID)
    getCrowdsaleAsset("REACT_APP_TOKEN_CONSOLE", "tokenConsole", networkID)
    getCrowdsaleAsset("REACT_APP_CROWDSALE_CONSOLE", "crowdsaleConsole", networkID)
    getCrowdsaleAsset("REACT_APP_REGISTRY_STORAGE", "registryStorage", networkID)
    getCrowdsaleAsset("REACT_APP_SCRIPT_EXEC", "scriptExec", networkID)
    getCrowdsaleAsset("REACT_APP_CROWDSALE_BUY_TOKENS", "crowdsaleBuyTokens", networkID)
    resolve(contractStore);
  })
}

function getCrowdsaleAsset(contractName, stateProp, networkID) {
  const src = "" //to do
  const bin = process.env[`${contractName}_BIN`] || ''
  const abi = JSON.parse(process.env[`${contractName}_ABI`] || [])
  const addr = JSON.parse(process.env[`${contractName}_ADDRESS`] || {})[networkID]

  return Promise.all([src, bin, abi, addr])
    .then(result => addContractsToState(...result, stateProp))
}

function addContractsToState(src, bin, abi, addr, contract) {
  contractStore.setContract(contract, {
    src,
    bin,
    abi: abi,
    addr: addr,
    abiConstructor: []
  });
}

export const getconstructorParams = (abiConstructor, vals, crowdsaleNum, isCrowdsale) => {
  let params = {"types": [], "vals": []};
  if (!abiConstructor) return params;

  for (let j = 0; j < abiConstructor.length; j++) {
    let inp = abiConstructor[j];
    params.types.push(inp.type);
    if (vals.length > 0) {
      params.vals.push(vals[j]);
    } else {
      switch(inp.name) {
        case "_start":
          params.vals.push(toFixed(new Date(tierStore.tiers[crowdsaleNum].startTime).getTime() / 1000).toString());
          break;
        case "_end":
          params.vals.push(toFixed(new Date(tierStore.tiers[crowdsaleNum].endTime).getTime() / 1000).toString());
          break;
        case "_rate":
          params.vals.push(tierStore.tiers[crowdsaleNum].rate);
          break;
        case "_multisigWallet":
          //params.vals.push(contractStore.multisig.addr);
          params.vals.push(tierStore.tiers[0].walletAddress);
          break;
        case "_pricingStrategy":
          params.vals.push(contractStore.pricingStrategy.addr[crowdsaleNum]);
          break;
        case "_token":
          params.vals.push(contractStore.token.addr);
          break;
        case "_crowdsale":
          params.vals.push(contractStore.crowdsale.addr[crowdsaleNum]);
          break;
        case "_name":
          if (isCrowdsale) {
            params.vals.push(tierStore.tiers[crowdsaleNum].tier);
          } else {
            params.vals.push(tokenStore.name);
          }
          break;
        case "_symbol":
          params.vals.push(tokenStore.ticker);
          break;
        case "_decimals":
          params.vals.push(tokenStore.decimals);
          break;
        case "_globalMinCap":
          params.vals.push(tierStore.tiers[0].whitelistEnabled !== 'yes' ? tokenStore.globalmincap ? toFixed(tokenStore.globalmincap * 10 ** tokenStore.decimals).toString() : 0 : 0)
          break;
        case "_initialSupply":
          params.vals.push(tokenStore.supply);
          break;
        case "_maximumSellableTokens":
          params.vals.push(toFixed(tierStore.tiers[crowdsaleNum].supply * 10**tokenStore.decimals).toString());
          break;
        case "_minimumFundingGoal":
          params.vals.push(0);
          break;
        case "_mintable":
          params.vals.push(true);
          break;
        case "_oneTokenInWei":
          BigNumber.config({ DECIMAL_PLACES: 18 })
          const rate = new BigNumber(tierStore.tiers[crowdsaleNum].rate)
          const tokenInEther = rate.pow(-1).toFixed()
          params.vals.push(web3Store.web3.utils.toWei(tokenInEther, "ether"))
          break;
        case "_isUpdatable":
          params.vals.push(tierStore.tiers[crowdsaleNum].updatable ? tierStore.tiers[crowdsaleNum].updatable==="on" ? true : false : false);
          break;
        case "_isWhiteListed":
          params.vals.push(tierStore.tiers[0].whitelistEnabled ? tierStore.tiers[0].whitelistEnabled === "yes" : false)
          break;
        default:
          params.vals.push("");
          break;
      }
    }
  }
  return params;
}
