import { TRUNC_TO_DECIMALS } from '../utils/constants'
import { floorToDecimals, setFlatFileContentToState, toFixed } from '../utils/utils'
import { contractStore, tokenStore, tierStore, web3Store } from './index'

export function getWhiteListWithCapCrowdsaleAssets() {
  const contractsRoute = './contracts/'
  const crowdsaleFilename = 'CrowdsaleWhiteListWithCap'
  const binAbi = ['bin', 'abi']

  const crowdsaleFiles = ['sol', ...binAbi].map(ext => `${contractsRoute}${crowdsaleFilename}_flat.${ext}`)
  const tokenFiles = binAbi.map(ext => `${contractsRoute}${crowdsaleFilename}Token_flat.${ext}`)
  const pricingFiles = binAbi.map(ext => `${contractsRoute}${crowdsaleFilename}PricingStrategy_flat.${ext}`)
  const finalizeFiles = binAbi.map(ext => `${contractsRoute}FinalizeAgent_flat.${ext}`)
  const nullFiles = binAbi.map(ext => `${contractsRoute}NullFinalizeAgent_flat.${ext}`)
  const registryFiles = binAbi.map(ext => `${contractsRoute}Registry_flat.${ext}`)

  const states = crowdsaleFiles.concat(tokenFiles, pricingFiles, finalizeFiles, nullFiles, registryFiles)
    .map(setFlatFileContentToState)

  return Promise.all(states)
    .then(state => {
      contractStore.setContractProperty('crowdsale', 'src', state[0])
      contractStore.setContractProperty('crowdsale', 'bin', state[1])
      contractStore.setContractProperty('crowdsale', 'abi', JSON.parse(state[2]))
      contractStore.setContractProperty('token', 'bin', state[3])
      contractStore.setContractProperty('token', 'abi', JSON.parse(state[4]))
      contractStore.setContractProperty('pricingStrategy', 'bin', state[5])
      contractStore.setContractProperty('pricingStrategy', 'abi', JSON.parse(state[6]))
      contractStore.setContractProperty('finalizeAgent', 'bin', state[7])
      contractStore.setContractProperty('finalizeAgent', 'abi', JSON.parse(state[8]))
      contractStore.setContractProperty('nullFinalizeAgent', 'bin', state[9])
      contractStore.setContractProperty('nullFinalizeAgent', 'abi', JSON.parse(state[10]))
      contractStore.setContractProperty('registry', 'bin', state[11])
      contractStore.setContractProperty('registry', 'abi', JSON.parse(state[12]))
      return contractStore
    })
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
          let oneTokenInETHRaw = toFixed(1 / tierStore.tiers[crowdsaleNum].rate).toString()
          let oneTokenInETH = floorToDecimals(TRUNC_TO_DECIMALS.DECIMALS18, oneTokenInETHRaw)
          params.vals.push(web3Store.web3.utils.toWei(oneTokenInETH, "ether"));
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
