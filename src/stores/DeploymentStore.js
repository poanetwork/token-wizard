import { action, computed, observable } from 'mobx'
import autosave from './autosave'
import logdown from 'logdown'

const logger = logdown('TW:stores:deployment')
const initialTxStatus = {
  active: false,
  confirmationPending: false,
  miningPending: false,
  mined: false,
  txHash: ''
}

class DeploymentStore {
  @observable txMap = new Map()
  @observable deploymentStep = null
  @observable hasEnded = false
  @observable deployerAccount = null
  @observable invalidAccount = false

  constructor() {
    this.reset()
    autosave(this, 'DeploymentStore', store => {
      const txMap = new Map()
      Object.keys(store.txMap).forEach(key => {
        txMap.set(key, store.txMap[key])
      })
      store.txMap = txMap

      return store
    })
  }

  @action
  initialize = (hasReservedToken, hasWhitelist, isDutchAuction, tiers, hasMinCap = false) => {
    logger.log('hasReservedToken:', hasReservedToken)
    logger.log('hasWhitelist:', hasWhitelist)
    const listOfTx = [
      { name: 'deployProxy', dependsOnTiers: false, required: true },
      { name: 'crowdsaleCreate', dependsOnTiers: false, required: true },
      { name: 'token', dependsOnTiers: false, required: true },
      { name: 'setReservedTokens', dependsOnTiers: false, required: hasReservedToken },
      { name: 'updateGlobalMinContribution', dependsOnTiers: false, required: isDutchAuction && hasMinCap },
      { name: 'createCrowdsaleTiers', dependsOnTiers: false, required: tiers.length > 1 },
      { name: 'whitelist', dependsOnTiers: true, required: hasWhitelist },
      { name: 'crowdsaleInit', dependsOnTiers: false, required: true },
      { name: 'trackProxy', dependsOnTiers: false, required: true }
    ]
    const byTierWhitelistInitialValues = tiers.map(tier => {
      if (tier.whitelistEnabled === 'yes') {
        if (tier.whitelist.length > 0) {
          return initialTxStatus
        }
      }
      return null
    })

    listOfTx.forEach(tx => {
      if (tx.required) {
        if (tx.dependsOnTiers) {
          if (tx.name === 'whitelist') {
            return this.txMap.set(tx.name, byTierWhitelistInitialValues)
          } else if (tx.name === 'updateTierMinimum') {
            return this.txMap.set(tx.name, [initialTxStatus])
          }
        }
        return this.txMap.set(tx.name, [initialTxStatus])
      }
      this.txMap.set(tx.name, [])
    })

    this.logTxMap()
  }

  @action
  setAsSuccessful = txName => {
    const txStatuses = this.txMap.get(txName)

    if (!txStatuses) return

    // eslint-disable-next-line array-callback-return
    const toBeUpdated = txStatuses.findIndex(({ mined }) => {
      if (mined !== null) {
        return !mined
      }
    })

    if (toBeUpdated !== -1) {
      txStatuses[toBeUpdated].mined = true
      this.txMap.set(txName, txStatuses)
    }

    this.logTxMap()
  }

  @action
  setDeploymentStep = index => {
    this.deploymentStep = index
  }

  @action
  setDeploymentStepStatus = ({ executionOrder, status }) => {
    if (!this.activeSteps.length) return

    const currentStep = this.activeSteps[executionOrder]
    const txStatuses = this.txMap.get(currentStep.name).map((txStatus, index) => {
      if (currentStep.innerIndex === index) txStatus[status] = true
      return txStatus
    })
    this.txMap.set(currentStep.name, txStatuses)
  }

  @action
  setDeploymentStepTxHash = ({ executionOrder, txHash }) => {
    if (!this.activeSteps.length) return

    const currentStep = this.activeSteps[executionOrder]
    const txStatuses = this.txMap.get(currentStep.name).map((txStatus, index) => {
      if (currentStep.innerIndex === index) txStatus.txHash = txHash
      return txStatus
    })
    this.txMap.set(currentStep.name, txStatuses)
  }

  @action
  setDeployerAccount = account => {
    if (!this.deployerAccount) {
      this.deployerAccount = account
    }
  }

  @action
  handleAccountChange = account => {
    if (!this.deployerAccount) {
      // If there is no deployment in progress, do nothing
      return
    }

    this.invalidAccount = account !== this.deployerAccount
  }

  @action
  resetDeploymentStep = () => {
    this.deploymentStep = null
  }

  @action
  setHasEnded(value) {
    this.hasEnded = value
  }

  @action
  resetTx = tx => {
    if (!tx) return
    const contentToUpdate = this.txMap.get(tx.name)
    contentToUpdate[tx.innerIndex] = initialTxStatus
    this.txMap.set(tx.name, contentToUpdate)
  }

  logTxMap = () => {
    if (process.env.NODE_ENV !== 'development') return

    const table = []

    this.txMap.forEach((txStatus, txName) => {
      const tiersStatuses = {}
      txStatus.forEach((step, index) => {
        if (step) tiersStatuses[`Tier ${index + 1}`] = step.mined
      })
      table.push({ txName, ...tiersStatuses })
    })

    console.table(table)
  }

  @action
  getStepExecutionOrder = step => {
    if (!step) return

    const { name, innerIndex } = step

    return this.activeSteps.findIndex(activeStep => activeStep.name === name && activeStep.innerIndex === innerIndex)
  }

  /**
   * If txHash is available, then the tx is considered as recoverable
   * @returns {*}
   */
  @computed
  get txRecoverable() {
    return this.activeSteps.find(step => step.txHash && (!step.miningPending || !step.mined))
  }

  /**
   * If tx is active, but not txHash available. We will consider it as a lost tx
   * @returns {*}
   */
  @computed
  get txLost() {
    return this.activeSteps.find(step => step.active && step.confirmationPending && !step.txHash)
  }

  @computed
  get activeSteps() {
    let activeSteps = []
    this.txMap.forEach((steps, name) => {
      steps.forEach((step, index) => {
        if (step) activeSteps = activeSteps.concat({ name, innerIndex: index, ...step })
      })
    })
    return activeSteps
  }

  @computed
  get deploymentHasFinished() {
    return this.txMap.values().every(txStatuses => txStatuses.every(status => (status !== null ? status.mined : true)))
  }

  @computed
  get nextPendingTransaction() {
    for (let [tx, txStatuses] of this.txMap) {
      if (txStatuses.some(({ mined }) => !mined)) return tx
    }
  }

  @computed
  get deployInProgress() {
    return this.deploymentStep !== null
  }

  @action
  reset = () => {
    this.txMap = new Map()
    this.deploymentStep = null
    this.hasEnded = false
    this.deployerAccount = null
    this.invalidAccount = false
  }
}

export default DeploymentStore
