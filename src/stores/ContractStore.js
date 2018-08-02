import { observable, action } from 'mobx'
import autosave from './autosave'

class ContractStore {
  @observable MintedCappedProxy
  @observable DutchProxy
  @observable ProxiesRegistry
  @observable abstractStorage
  @observable registryIdx
  @observable provider
  @observable registryExec
  @observable idxMintedCapped
  @observable saleMintedCapped
  @observable saleManagerMintedCapped
  @observable tokenMintedCapped
  @observable tokenManagerMintedCapped
  @observable idxDutch
  @observable saleDutch
  @observable tokenDutch
  @observable crowdsale
  @observable downloadStatus

  constructor() {
    this.reset()
    autosave(this, 'ContractStore')
  }

  @action
  setContract = (contractName, contractObj) => {
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
    this.MintedCappedProxy = undefined
    this.DutchProxy = undefined
    this.ProxiesRegistry = undefined
    this.abstractStorage = undefined
    this.registryIdx = undefined
    this.provider = undefined
    this.registryExec = undefined
    this.idxMintedCapped = undefined
    this.saleMintedCapped = undefined
    this.saleManagerMintedCapped = undefined
    this.tokenMintedCapped = undefined
    this.tokenManagerMintedCapped = undefined
    this.idxDutch = undefined
    this.saleDutch = undefined
    this.tokenDutch = undefined
    this.crowdsale = undefined
    this.downloadStatus = undefined
  }
}

export default ContractStore
