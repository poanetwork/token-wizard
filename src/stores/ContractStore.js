import { action, isObservable, observable } from 'mobx'
import { DOWNLOAD_STATUS } from '../utils/constants'
import autosave from './autosave'

class ContractStore {
  @observable MintedCappedProxy = {}
  @observable DutchProxy = {}
  @observable ProxiesRegistry = {}
  @observable abstractStorage = {}
  @observable registryIdx = {}
  @observable provider = {}
  @observable registryExec = {}
  @observable idxMintedCapped = {}
  @observable saleMintedCapped = {}
  @observable saleManagerMintedCapped = {}
  @observable tokenMintedCapped = {}
  @observable tokenManagerMintedCapped = {}
  @observable idxDutch = {}
  @observable saleDutch = {}
  @observable tokenDutch = {}
  @observable crowdsale = {}
  @observable downloadStatus = {}

  constructor() {
    this.reset()
    autosave(this, 'ContractStore')
  }

  @action
  setContract = (contractName, contractObj) => {
    if (!isObservable(this[contractName])) {
      // A contract must be declared as an observable to have it properly stored in browser's localStorage
      throw new Error(`${contractName} is not declared as an observable property`)
    }
    this[contractName] = contractObj
  }

  @action
  setContractProperty = (contractName, property, value) => {
    let newContract = Object.assign({}, this[contractName])
    newContract[property] = value
    this[contractName] = newContract
  }

  @action
  setProperty = (property, value) => {
    this[property] = value
  }

  @action
  reset = () => {
    this.MintedCappedProxy = {}
    this.DutchProxy = {}
    this.ProxiesRegistry = {}
    this.abstractStorage = {}
    this.registryIdx = {}
    this.provider = {}
    this.registryExec = {}
    this.idxMintedCapped = {}
    this.saleMintedCapped = {}
    this.saleManagerMintedCapped = {}
    this.tokenMintedCapped = {}
    this.tokenManagerMintedCapped = {}
    this.idxDutch = {}
    this.saleDutch = {}
    this.tokenDutch = {}
    this.crowdsale = {}
    this.downloadStatus = DOWNLOAD_STATUS.PENDING
  }
}

export default ContractStore
