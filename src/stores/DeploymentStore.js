import { action, computed, observable } from 'mobx'
import autosave from './autosave'

class DeploymentStore {
  @observable txMap = new Map()
  @observable deploymentStep = null
  @observable hasEnded = false
  @observable deployerAccount = null
  @observable invalidAccount = false

  constructor() {
    autosave(this, 'DeploymentStore', (store) => {
      const txMap = new Map()
      Object.keys(store.txMap).forEach(key => {
        txMap.set(key, store.txMap[key])
      })
      store.txMap = txMap

      return store
    })
  }

  @action initialize = (hasReservedToken, hasWhitelist, tiers, globalMinCap) => {
    console.log("hasReservedToken:", hasReservedToken)
    console.log("hasWhitelist:", hasWhitelist)
    console.log("globalMinCap:", globalMinCap)
    const listOfTx = [
      //{ name: 'deployProxy', dependsOnTiers: false, required: true }, //todo
      { name: 'crowdsaleCreate', dependsOnTiers: false, required: true },
      { name: 'token', dependsOnTiers: false, required: true },
      { name: 'setReservedTokens', dependsOnTiers: false, required: hasReservedToken },
      { name: 'updateGlobalMinContribution', dependsOnTiers: true, required: globalMinCap > 0 },
      { name: 'createCrowdsaleTiers', dependsOnTiers: false, required: tiers.length > 1 },
      { name: 'whitelist', dependsOnTiers: true, required: hasWhitelist },
      { name: 'crowdsaleInit', dependsOnTiers: false, required: true },
    ]
    const byTierWhitelistInitialValues = tiers.map((tier) => {
      if (tier.whitelistEnabled === 'yes') {
        if (tier.whitelist.length > 0) {
          return false
        }
      }
      return null
    })

    listOfTx.forEach(tx => {
      if (tx.required) {
        if (tx.dependsOnTiers) {
          if (tx.name === 'whitelist') {
            return this.txMap.set(tx.name, byTierWhitelistInitialValues)
          } else if (tx.aneme === 'updateGlobalMinContribution') {
            return this.txMap.set(tx.name, [false])
          }
        }
        return this.txMap.set(tx.name, [false])
      }
      this.txMap.set(tx.name, [])
    })

    this.logTxMap()
  }

  @action initializePersonalized = (hasReservedToken, hasWhitelist, tiers, listOfTx, globalMinCap) => {
    this.initialize(hasReservedToken, hasWhitelist, tiers, globalMinCap)
    // TODO: based on listOfTx, modify this.txMap so it reflects the required amount of steps
  }

  @action setAsSuccessful = (txName) => {
    const txStatus = this.txMap.get(txName)

    if (!txStatus) return

    const toBeUpdated = txStatus.findIndex((isSuccess) => {
      if (isSuccess !== null) {
        return !isSuccess
      }
    })

    if (toBeUpdated !== -1) {
      txStatus[toBeUpdated] = true
      this.txMap.set(txName, txStatus)
    }

    this.logTxMap()
  }

  @action setDeploymentStep = (index) => {
    this.deploymentStep = index
  }

  @action setDeployerAccount = (account) => {
    if (!this.deployerAccount) {
      this.deployerAccount = account
    }
  }

  @action handleAccountChange = (account) => {
    if (!this.deployerAccount) {
      // If there is no deployment in progress, do nothing
      return
    }

    this.invalidAccount = account !== this.deployerAccount
  }

  @action resetDeploymentStep = () => {
    this.deploymentStep = null
  }

  @action setHasEnded(value) {
    this.hasEnded = value
  }

  logTxMap = () => {
    if (process.env.NODE_ENV !== 'development') return

    const table = []

    this.txMap.forEach((txStatus, txName) => {
      const tiersStatuses = {}
      txStatus.forEach((value, index) => tiersStatuses[`Tier ${index+1}`] = value)
      table.push({ txName, ...tiersStatuses })
    })

    console.table(table)
  }

  @computed
  get deploymentHasFinished () {
    return this.txMap.values().every(statuses => statuses.every(status => status))
  }

  @computed
  get nextPendingTransaction () {
    for (let [tx, txStatuses] of this.txMap) {
      if (txStatuses.some(status => !status)) return tx
    }
  }

  @computed
  get deployInProgress () {
    return this.deploymentStep !== null
  }
}

export default DeploymentStore
