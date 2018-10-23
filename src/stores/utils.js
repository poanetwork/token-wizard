import { contractStore } from './index'
import { REACT_PREFIX } from '../utils/constants'
import { setFlatFileContentToState } from '../utils/utils'
import logdown from 'logdown'

const logger = logdown('TW:stores:utils')

export const getCrowdsaleAssets = async networkID => {
  const whenMintedCappedProxy = getCrowdsaleAsset(null, 'MintedCappedProxy', networkID)
  const whenDutchProxy = getCrowdsaleAsset(null, 'DutchProxy', networkID)
  const whenProxiesRegistry = getCrowdsaleAsset('TW_PROXIES_REGISTRY', 'ProxiesRegistry', networkID)
  const whenRegistry = getCrowdsaleAsset('ABSTRACT_STORAGE', 'abstractStorage', networkID)
  const whenRegistryIdx = getCrowdsaleAsset('REGISTRY_IDX', 'registryIdx', networkID)
  const whenRegistryExec = getCrowdsaleAsset('REGISTRY_EXEC', 'registryExec', networkID)
  const whenProvider = getCrowdsaleAsset('PROVIDER', 'provider', networkID)
  const whenMintedCappedIdx = getCrowdsaleAsset('MINTED_CAPPED_IDX', 'idxMintedCapped', networkID)
  const whenMintedCappedSale = getCrowdsaleAsset('MINTED_CAPPED_CROWDSALE', 'saleMintedCapped', networkID)
  const whenMintedCappedSaleManager = getCrowdsaleAsset(
    `MINTED_CAPPED_CROWDSALE_MANAGER`,
    'saleManagerMintedCapped',
    networkID
  )
  const whenMintedCappedToken = getCrowdsaleAsset(`MINTED_CAPPED_TOKEN`, 'tokenMintedCapped', networkID)
  const whenMintedCappedTokenManager = getCrowdsaleAsset(
    `MINTED_CAPPED_TOKEN_MANAGER`,
    'tokenManagerMintedCapped',
    networkID
  )
  const whenDutchIdx = getCrowdsaleAsset(`DUTCH_IDX`, 'idxDutch', networkID)
  const whenDutchSale = getCrowdsaleAsset(`DUTCH_CROWDSALE`, 'saleDutch', networkID)
  const whenDutchToken = getCrowdsaleAsset(`DUTCH_TOKEN`, 'tokenDutch', networkID)
  const whenPromises = [
    whenMintedCappedProxy,
    whenDutchProxy,
    whenProxiesRegistry,
    whenRegistry,
    whenRegistryIdx,
    whenRegistryExec,
    whenProvider,
    whenMintedCappedIdx,
    whenMintedCappedSale,
    whenMintedCappedSaleManager,
    whenMintedCappedToken,
    whenMintedCappedTokenManager,
    whenDutchIdx,
    whenDutchSale,
    whenDutchToken
  ]
  return Promise.all(whenPromises)
}

async function getCrowdsaleAsset(contractName, stateProp, networkID) {
  logger.log(contractName, stateProp, networkID)
  const whenSrc =
    stateProp === 'MintedCappedProxy' || stateProp === 'DutchProxy'
      ? setFlatFileContentToState(`./contracts/${stateProp}.sol`)
      : Promise.resolve()
  const whenBin =
    stateProp === 'MintedCappedProxy' || stateProp === 'DutchProxy'
      ? setFlatFileContentToState(`./contracts/${stateProp}.bin`)
      : Promise.resolve()
  let abi
  //todo: get ABI or from file or from here
  switch (stateProp) {
    case 'MintedCappedProxy':
      abi = [
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'provider',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleMaxRaise',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_from',
              type: 'address'
            },
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'transferFrom',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'proxy_admin',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleInfo',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'address'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              name: '',
              type: 'uint8'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_tier',
              type: 'uint256'
            },
            {
              name: '_buyer',
              type: 'address'
            }
          ],
          name: 'getWhitelistStatus',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleTierList',
          outputs: [
            {
              name: '',
              type: 'bytes32[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleStartAndEndTimes',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_calldata',
              type: 'bytes'
            }
          ],
          name: 'exec',
          outputs: [
            {
              name: 'success',
              type: 'bool'
            }
          ],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'registry_exec_id',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'decreaseApproval',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_name',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getAdmin',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getReservedTokenDestinationList',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'address[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_storage',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_idx',
              type: 'uint256'
            }
          ],
          name: 'getTierStartAndEndDates',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [],
          name: 'buy',
          outputs: [],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'transfer',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_idx',
              type: 'uint256'
            }
          ],
          name: 'getCrowdsaleTier',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_destination',
              type: 'address'
            }
          ],
          name: 'getReservedDestinationInfo',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'isCrowdsaleFull',
          outputs: [
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'increaseApproval',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_exec_id',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_index',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_version',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            },
            {
              name: '_spender',
              type: 'address'
            }
          ],
          name: 'allowance',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getTokensSold',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCurrentTierInfo',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_tier_idx',
              type: 'uint256'
            }
          ],
          name: 'getTierWhitelist',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'address[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '',
              type: 'address'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bytes32'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'address'
            }
          ],
          name: 'init',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleUniqueBuyers',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              name: '_storage',
              type: 'address'
            },
            {
              name: '_registry_exec_id',
              type: 'bytes32'
            },
            {
              name: '_provider',
              type: 'address'
            },
            {
              name: '_app_name',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          payable: true,
          stateMutability: 'payable',
          type: 'fallback'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'execution_id',
              type: 'bytes32'
            },
            {
              indexed: false,
              name: 'message',
              type: 'string'
            }
          ],
          name: 'StorageException',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              name: 'to',
              type: 'address'
            },
            {
              indexed: false,
              name: 'amt',
              type: 'uint256'
            }
          ],
          name: 'Transfer',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'owner',
              type: 'address'
            },
            {
              indexed: true,
              name: 'spender',
              type: 'address'
            },
            {
              indexed: false,
              name: 'amt',
              type: 'uint256'
            }
          ],
          name: 'Approval',
          type: 'event'
        }
      ]
      break
    case 'DutchProxy':
      abi = [
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'provider',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'approve',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'totalSupply',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_from',
              type: 'address'
            },
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'transferFrom',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'proxy_admin',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleInfo',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'address'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              name: '',
              type: 'uint8'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleWhitelist',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'address[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleStartAndEndTimes',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_calldata',
              type: 'bytes'
            }
          ],
          name: 'exec',
          outputs: [
            {
              name: 'success',
              type: 'bool'
            }
          ],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'registry_exec_id',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleStatus',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'decreaseApproval',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_name',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getAdmin',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            }
          ],
          name: 'balanceOf',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_storage',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [
            {
              name: '',
              type: 'string'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [],
          name: 'buy',
          outputs: [],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'transfer',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '',
              type: 'address'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'address'
            },
            {
              name: '',
              type: 'bool'
            }
          ],
          name: 'init',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'isCrowdsaleFull',
          outputs: [
            {
              name: '',
              type: 'bool'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            {
              name: '_spender',
              type: 'address'
            },
            {
              name: '_amt',
              type: 'uint256'
            }
          ],
          name: 'increaseApproval',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_exec_id',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_buyer',
              type: 'address'
            }
          ],
          name: 'getWhitelistStatus',
          outputs: [
            {
              name: '',
              type: 'uint256'
            },
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_index',
          outputs: [
            {
              name: '',
              type: 'address'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_version',
          outputs: [
            {
              name: '',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address'
            },
            {
              name: '_spender',
              type: 'address'
            }
          ],
          name: 'allowance',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getTokensSold',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getCrowdsaleUniqueBuyers',
          outputs: [
            {
              name: '',
              type: 'uint256'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            {
              name: '_storage',
              type: 'address'
            },
            {
              name: '_registry_exec_id',
              type: 'bytes32'
            },
            {
              name: '_provider',
              type: 'address'
            },
            {
              name: '_app_name',
              type: 'bytes32'
            }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          payable: true,
          stateMutability: 'payable',
          type: 'fallback'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'execution_id',
              type: 'bytes32'
            },
            {
              indexed: false,
              name: 'message',
              type: 'string'
            }
          ],
          name: 'StorageException',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'from',
              type: 'address'
            },
            {
              indexed: true,
              name: 'to',
              type: 'address'
            },
            {
              indexed: false,
              name: 'amt',
              type: 'uint256'
            }
          ],
          name: 'Transfer',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: 'owner',
              type: 'address'
            },
            {
              indexed: true,
              name: 'spender',
              type: 'address'
            },
            {
              indexed: false,
              name: 'amt',
              type: 'uint256'
            }
          ],
          name: 'Approval',
          type: 'event'
        }
      ]
      break
    case 'ProxiesRegistry':
      abi = [
        {
          constant: true,
          inputs: [],
          name: 'abstractStorageAddr',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: 'deployer', type: 'address' }],
          name: 'getCrowdsalesForUser',
          outputs: [{ name: '', type: 'address[]' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: 'deployer', type: 'address' }],
          name: 'countCrowdsalesForUser',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [],
          name: 'renounceOwnership',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: 'newMintedCappedIdxAddr', type: 'address' }],
          name: 'changeMintedCappedIdx',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: 'newDutchIdxAddr', type: 'address' }],
          name: 'changeDutchIdxAddr',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'owner',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'dutchIdxAddr',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'mintedCappedIdxAddr',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: 'newAbstractStorageAddr', type: 'address' }],
          name: 'changeAbstractStorage',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: 'proxyAddress', type: 'address' }],
          name: 'trackCrowdsale',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_newOwner', type: 'address' }],
          name: 'transferOwnership',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [
            { name: '_abstractStorage', type: 'address' },
            { name: '_mintedCappedIdx', type: 'address' },
            { name: '_dutchIdx', type: 'address' }
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'constructor'
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'sender', type: 'address' },
            { indexed: true, name: 'proxyAddress', type: 'address' },
            { indexed: false, name: 'appExecID', type: 'bytes32' }
          ],
          name: 'Added',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }],
          name: 'OwnershipRenounced',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'previousOwner', type: 'address' },
            { indexed: true, name: 'newOwner', type: 'address' }
          ],
          name: 'OwnershipTransferred',
          type: 'event'
        }
      ]
      break
    case 'registryExec':
      abi = [
        {
          constant: true,
          inputs: [],
          name: 'provider',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'bytes32' }],
          name: 'deployed_by',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_deployer', type: 'address' }],
          name: 'getDeployedLength',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            { name: '_app_name', type: 'bytes32' },
            { name: '_version_name', type: 'bytes32' },
            { name: '_index', type: 'address' },
            { name: '_selectors', type: 'bytes4[]' },
            { name: '_implementations', type: 'address[]' }
          ],
          name: 'registerAppVersion',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_exec_id', type: 'bytes32' }],
          name: 'setRegistryExecID',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            { name: '_exec_admin', type: 'address' },
            { name: '_app_storage', type: 'address' },
            { name: '_provider', type: 'address' }
          ],
          name: 'configure',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'registry_exec_id',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_admin', type: 'address' }],
          name: 'setAdmin',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_index', type: 'address' }, { name: '_implementation', type: 'address' }],
          name: 'createRegistryInstance',
          outputs: [{ name: 'exec_id', type: 'bytes32' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'bytes32' }],
          name: 'registry_instance_info',
          outputs: [{ name: 'index', type: 'address' }, { name: 'implementation', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'app_storage',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_exec_id', type: 'bytes32' }, { name: '_calldata', type: 'bytes' }],
          name: 'exec',
          outputs: [{ name: 'success', type: 'bool' }],
          payable: true,
          stateMutability: 'payable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'bytes32' }],
          name: 'instance_info',
          outputs: [
            { name: 'current_provider', type: 'address' },
            { name: 'current_registry_exec_id', type: 'bytes32' },
            { name: 'app_exec_id', type: 'bytes32' },
            { name: 'app_name', type: 'bytes32' },
            { name: 'version_name', type: 'bytes32' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [
            { name: '_app_name', type: 'bytes32' },
            { name: '_index', type: 'address' },
            { name: '_selectors', type: 'bytes4[]' },
            { name: '_implementations', type: 'address[]' }
          ],
          name: 'registerApp',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'exec_admin',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'address' }, { name: '', type: 'uint256' }],
          name: 'deployed_registry_instances',
          outputs: [{ name: 'index', type: 'address' }, { name: 'implementation', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [],
          name: 'getRegistryImplementation',
          outputs: [{ name: 'indx', type: 'address' }, { name: 'implementation', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_provider', type: 'address' }],
          name: 'setProvider',
          outputs: [],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: false,
          inputs: [{ name: '_app_name', type: 'bytes32' }, { name: '_init_calldata', type: 'bytes' }],
          name: 'createAppInstance',
          outputs: [{ name: 'exec_id', type: 'bytes32' }, { name: 'version', type: 'bytes32' }],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'address' }, { name: '', type: 'uint256' }],
          name: 'deployed_instances',
          outputs: [
            { name: 'current_provider', type: 'address' },
            { name: 'current_registry_exec_id', type: 'bytes32' },
            { name: 'app_exec_id', type: 'bytes32' },
            { name: 'app_name', type: 'bytes32' },
            { name: 'version_name', type: 'bytes32' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '', type: 'bytes32' }, { name: '', type: 'uint256' }],
          name: 'app_instances',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_exec_id', type: 'bytes32' }],
          name: 'getInstanceImplementation',
          outputs: [
            { name: 'index', type: 'address' },
            { name: 'functions', type: 'bytes4[]' },
            { name: 'implementations', type: 'address[]' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_app_name', type: 'bytes32' }],
          name: 'getInstances',
          outputs: [{ name: '', type: 'bytes32[]' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        { payable: true, stateMutability: 'payable', type: 'fallback' },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'creator', type: 'address' },
            { indexed: true, name: 'execution_id', type: 'bytes32' },
            { indexed: false, name: 'index', type: 'address' },
            { indexed: false, name: 'implementation', type: 'address' }
          ],
          name: 'RegistryInstanceCreated',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'creator', type: 'address' },
            { indexed: true, name: 'execution_id', type: 'bytes32' },
            { indexed: false, name: 'app_name', type: 'bytes32' },
            { indexed: false, name: 'version_name', type: 'bytes32' }
          ],
          name: 'AppInstanceCreated',
          type: 'event'
        },
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'execution_id', type: 'bytes32' },
            { indexed: false, name: 'message', type: 'string' }
          ],
          name: 'StorageException',
          type: 'event'
        }
      ]
      break
    case 'idxMintedCapped':
      abi = [
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_owner', type: 'address' },
            { name: '_spender', type: 'address' }
          ],
          name: 'allowance',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getTokensSold',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_tier_index', type: 'uint256' }
          ],
          name: 'getTierWhitelist',
          outputs: [{ name: 'num_whitelisted', type: 'uint256' }, { name: 'whitelist', type: 'address[]' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_tier_index', type: 'uint256' },
            { name: '_buyer', type: 'address' }
          ],
          name: 'getWhitelistStatus',
          outputs: [
            { name: 'minimum_purchase_amt', type: 'uint256' },
            { name: 'max_tokens_remaining', type: 'uint256' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_index', type: 'uint256' }
          ],
          name: 'getTierStartAndEndDates',
          outputs: [{ name: 'tier_start', type: 'uint256' }, { name: 'tier_end', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_index', type: 'uint256' }
          ],
          name: 'getCrowdsaleTier',
          outputs: [
            { name: 'tier_name', type: 'bytes32' },
            { name: 'tier_sell_cap', type: 'uint256' },
            { name: 'tier_price', type: 'uint256' },
            { name: 'tier_min', type: 'uint256' },
            { name: 'tier_duration', type: 'uint256' },
            { name: 'duration_is_modifiable', type: 'bool' },
            { name: 'is_whitelisted', type: 'bool' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'totalSupply',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleStartAndEndTimes',
          outputs: [{ name: 'start_time', type: 'uint256' }, { name: 'end_time', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'symbol',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_owner', type: 'address' }
          ],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleMaxRaise',
          outputs: [{ name: 'wei_raise_cap', type: 'uint256' }, { name: 'total_sell_cap', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_agent', type: 'address' }
          ],
          name: 'getTransferAgentStatus',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_destination', type: 'address' }
          ],
          name: 'getReservedDestinationInfo',
          outputs: [
            { name: 'destination_list_index', type: 'uint256' },
            { name: 'num_tokens', type: 'uint256' },
            { name: 'num_percent', type: 'uint256' },
            { name: 'percent_decimals', type: 'uint256' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'isCrowdsaleFull',
          outputs: [{ name: 'is_crowdsale_full', type: 'bool' }, { name: 'max_sellable', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleUniqueBuyers',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getAdmin',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getReservedTokenDestinationList',
          outputs: [
            { name: 'num_destinations', type: 'uint256' },
            { name: 'reserved_destinations', type: 'address[]' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getTokenInfo',
          outputs: [
            { name: 'token_name', type: 'bytes32' },
            { name: 'token_symbol', type: 'bytes32' },
            { name: 'token_decimals', type: 'uint256' },
            { name: 'total_supply', type: 'uint256' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleInfo',
          outputs: [
            { name: 'wei_raised', type: 'uint256' },
            { name: 'team_wallet', type: 'address' },
            { name: 'is_initialized', type: 'bool' },
            { name: 'is_finalized', type: 'bool' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'name',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCurrentTierInfo',
          outputs: [
            { name: 'tier_name', type: 'bytes32' },
            { name: 'tier_index', type: 'uint256' },
            { name: 'tier_ends_at', type: 'uint256' },
            { name: 'tier_tokens_remaining', type: 'uint256' },
            { name: 'tier_price', type: 'uint256' },
            { name: 'tier_min', type: 'uint256' },
            { name: 'duration_is_modifiable', type: 'bool' },
            { name: 'is_whitelisted', type: 'bool' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleTierList',
          outputs: [{ name: 'crowdsale_tiers', type: 'bytes32[]' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_team_wallet', type: 'address' },
            { name: '_start_time', type: 'uint256' },
            { name: '_initial_tier_name', type: 'bytes32' },
            { name: '_initial_tier_price', type: 'uint256' },
            { name: '_initial_tier_duration', type: 'uint256' },
            { name: '_initial_tier_token_sell_cap', type: 'uint256' },
            { name: '_initial_tier_min_purchase', type: 'uint256' },
            { name: '_initial_tier_is_whitelisted', type: 'bool' },
            { name: '_initial_tier_duration_is_modifiable', type: 'bool' },
            { name: '_admin', type: 'address' }
          ],
          name: 'init',
          outputs: [],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ]
      break
    case 'idxDutch':
      abi = [
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_owner', type: 'address' },
            { name: '_spender', type: 'address' }
          ],
          name: 'allowance',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getTokensSold',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_buyer', type: 'address' }
          ],
          name: 'getWhitelistStatus',
          outputs: [
            { name: 'minimum_purchase_amt', type: 'uint256' },
            { name: 'max_tokens_remaining', type: 'uint256' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'totalSupply',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleStartAndEndTimes',
          outputs: [{ name: 'start_time', type: 'uint256' }, { name: 'end_time', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'symbol',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_owner', type: 'address' }
          ],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_storage', type: 'address' },
            { name: '_exec_id', type: 'bytes32' },
            { name: '_agent', type: 'address' }
          ],
          name: 'getTransferAgentStatus',
          outputs: [{ name: '', type: 'bool' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'isCrowdsaleFull',
          outputs: [{ name: 'is_crowdsale_full', type: 'bool' }, { name: 'max_sellable', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleUniqueBuyers',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleStatus',
          outputs: [
            { name: 'start_rate', type: 'uint256' },
            { name: 'end_rate', type: 'uint256' },
            { name: 'current_rate', type: 'uint256' },
            { name: 'sale_duration', type: 'uint256' },
            { name: 'time_remaining', type: 'uint256' },
            { name: 'tokens_remaining', type: 'uint256' },
            { name: 'is_whitelisted', type: 'bool' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getAdmin',
          outputs: [{ name: '', type: 'address' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleWhitelist',
          outputs: [{ name: 'num_whitelisted', type: 'uint256' }, { name: 'whitelist', type: 'address[]' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getTokenInfo',
          outputs: [
            { name: 'token_name', type: 'bytes32' },
            { name: 'token_symbol', type: 'bytes32' },
            { name: 'token_decimals', type: 'uint256' },
            { name: 'total_supply', type: 'uint256' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [
            { name: '_wallet', type: 'address' },
            { name: '_total_supply', type: 'uint256' },
            { name: '_max_amount_to_sell', type: 'uint256' },
            { name: '_starting_rate', type: 'uint256' },
            { name: '_ending_rate', type: 'uint256' },
            { name: '_duration', type: 'uint256' },
            { name: '_start_time', type: 'uint256' },
            { name: '_sale_is_whitelisted', type: 'bool' },
            { name: '_admin', type: 'address' },
            { name: '_burn_excess', type: 'bool' }
          ],
          name: 'init',
          outputs: [],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'getCrowdsaleInfo',
          outputs: [
            { name: 'wei_raised', type: 'uint256' },
            { name: 'team_wallet', type: 'address' },
            { name: 'minimum_contribution', type: 'uint256' },
            { name: 'is_initialized', type: 'bool' },
            { name: 'is_finalized', type: 'bool' },
            { name: 'burn_excess', type: 'bool' }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        },
        {
          constant: true,
          inputs: [{ name: '_storage', type: 'address' }, { name: '_exec_id', type: 'bytes32' }],
          name: 'name',
          outputs: [{ name: '', type: 'bytes32' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ]
      break
    default:
      abi = []
      break
  }
  const addr = contractName ? JSON.parse(process.env[`${REACT_PREFIX}${contractName}_ADDRESS`] || {})[networkID] : null

  logger.log(abi, addr)

  const [src, bin] = await Promise.all([whenSrc, whenBin])
  addContractsToState(src, bin, abi, addr, stateProp)
  Promise.resolve()
}

function addContractsToState(src, bin, abi, addr, contract) {
  contractStore.setContract(contract, {
    src,
    bin,
    abi: abi ? abi : contractStore[contract] ? contractStore[contract].abi : null,
    addr: addr ? addr : contractStore[contract] ? contractStore[contract].addr : null
  })
}
