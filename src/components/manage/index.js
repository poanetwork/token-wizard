import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { TOAST, VALIDATION_TYPES, CROWDSALE_STRATEGIES } from '../../utils/constants'
import '../../assets/stylesheets/application.css'
import {
  successfulFinalizeAlert,
  successfulUpdateCrowdsaleAlert,
  warningOnFinalizeCrowdsale,
  notTheOwner
} from '../../utils/alerts'
import {
  getCurrentAccount,
  getNetworkVersion,
  sendTXToContract,
  calculateGasLimit,
  attachToSpecificCrowdsaleContract,
  methodToExec,
  getCrowdsaleStrategy
} from '../../utils/blockchainHelpers'
import { toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { getFieldsToUpdate, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'
import { getTiers } from '../crowdsale/utils'
import { generateContext } from '../stepFour/utils'
import { toJS } from 'mobx'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { AboutCrowdsale } from './AboutCrowdsale'
import { FinalizeCrowdsaleStep } from './FinalizeCrowdsaleStep'
import { ManageForm } from './ManageForm'

const { VALID } = VALIDATION_TYPES

@inject(
  'crowdsaleStore',
  'web3Store',
  'tierStore',
  'contractStore',
  'generalStore',
  'tokenStore',
  'gasPriceStore'
)
@observer
export class Manage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formPristine: true,
      loading: true,
      canFinalize: false,
      ownerCurrentUser: true
    }

    this.initialTiers = []
  }

  componentDidMount () {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }

  componentWillMount () {
    const { crowdsaleStore, generalStore, match, tierStore } = this.props
    const crowdsaleExecID = match.params.crowdsaleExecID
    console.log("crowdsaleExecID:", crowdsaleExecID)

    crowdsaleStore.setSelectedProperty('execID', crowdsaleExecID)
    crowdsaleStore.setProperty('execID', crowdsaleExecID)

    // networkID
    getNetworkVersion().then(networkID => {
      generalStore.setProperty('networkID', networkID)
      getWhiteListWithCapCrowdsaleAssets(networkID)
        .then(_newState => { this.setState(_newState) })
        .then(() => getCrowdsaleStrategy(crowdsaleExecID))
        .then((strategy) => crowdsaleStore.setProperty('strategy', strategy))
        //.then((strategy) => crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)) // to do
        .then(this.extractContractsData)
        .then(() => {
          this.initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
          console.log("strategy:", crowdsaleStore.strategy)
        })
    })
  }

  componentWillUnmount () {
    const { tierStore, tokenStore, crowdsaleStore } = this.props
    tierStore.reset()
    tokenStore.reset()
    crowdsaleStore.reset()
  }

  checkOwner = () => {
    const { contractStore, web3Store, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`
    return attachToSpecificCrowdsaleContract(target)
      .then((initCrowdsaleContract) => {
        let registryStorageObj = toJS(contractStore.registryStorage)
        const whenOwner = initCrowdsaleContract.methods.getAdmin(registryStorageObj.addr, contractStore.crowdsale.execID).call()
        const whenAccounts = web3Store.web3.eth.getAccounts()

        return Promise.all([whenOwner, whenAccounts])
      })
      .then(([ownerAccount, accounts]) => this.setState({ ownerCurrentUser: accounts[0] === ownerAccount }))
      .then(() => {
        if (!this.state.ownerCurrentUser) {
          notTheOwner()
        }
      })
  }

  extractContractsData = () => {
    const { crowdsaleStore, contractStore, match } = this.props
    contractStore.setContractProperty('crowdsale', 'execID', match.params.crowdsaleExecID)

    return getTiers()
      .then(numOfTiers => {
        console.log("numOfTiers:", numOfTiers)
        return getCurrentAccount()
          .then(account => {
            contractStore.setContractProperty('crowdsale', 'account', account)
            const targetPrefix = "initCrowdsale"
            const targetSuffix = crowdsaleStore.contractTargetSuffix
            const target = `${targetPrefix}${targetSuffix}`
            return attachToSpecificCrowdsaleContract(target)
              .then((initCrowdsaleContract) => {
                console.log(initCrowdsaleContract)
                let registryStorageObj = toJS(contractStore.registryStorage)
                let whenCrowdsaleData = [];
                let whenCrowdsale = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                whenCrowdsaleData.push(initCrowdsaleContract)
                whenCrowdsaleData.push(whenCrowdsale)
                let whenToken = initCrowdsaleContract.methods.getTokenInfo(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                whenCrowdsaleData.push(whenToken)

                if (crowdsaleStore.isMintedCappedCrowdsale) {
                  for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                    let whenTierData = initCrowdsaleContract.methods.getCrowdsaleTier(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call();
                    let whenTierDates = initCrowdsaleContract.methods.getTierStartAndEndDates(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call();
                    whenCrowdsaleData.push(whenTierData);
                    whenCrowdsaleData.push(whenTierDates);
                  }
                } else if (crowdsaleStore.isDutchAuction) {
                  let whenDutchAuctionData = initCrowdsaleContract.methods.getCrowdsaleStatus(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                  let whenDutchAuctionDates = initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                  whenCrowdsaleData.push(whenDutchAuctionData);
                  whenCrowdsaleData.push(whenDutchAuctionDates);
                }
                return Promise.all(whenCrowdsaleData)
              })
              .then((crowdsaleData) => {
                console.log("crowdsaleData:");
                console.log(crowdsaleData);
                let initCrowdsaleContract = crowdsaleData[0];
                let crowdsale = crowdsaleData[1];
                let token = crowdsaleData[2];
                crowdsaleData.shift();
                crowdsaleData.shift();
                crowdsaleData.shift();

                let tiers = [];
                let tierExtendedObj = {};
                let tiersAndDates = crowdsaleData.slice();
                console.log("tiersAndDates:", tiersAndDates)
                tiersAndDates.reduce((prevEl, curEl, index) => {
                  let isTierObj = curEl.hasOwnProperty("tier_name")
                  if (index == 1) {
                    tierExtendedObj = Object.assign(prevEl, curEl)
                    tiers.push(tierExtendedObj)
                    tierExtendedObj = {}
                  } else {
                    if (!isTierObj) {
                      tierExtendedObj = Object.assign(tierExtendedObj, curEl)
                      tiers.push(tierExtendedObj)
                      tierExtendedObj = {}
                    } else {
                      tierExtendedObj = curEl
                    }
                  }
                  return curEl
                })
                console.log("tiers:")
                console.log(tiers)

                //get whitelists for tiers
                let whenWhiteListsData = [];
                let registryStorageObj = toJS(contractStore.registryStorage)
                if (crowdsaleStore.isMintedCappedCrowdsale) {
                  for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                    if (tiers[tierNum].whitelist_enabled) {
                      let whenTierWhitelist = initCrowdsaleContract.methods.getTierWhitelist(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call()
                      whenWhiteListsData.push(whenTierWhitelist);
                    } else {
                      whenWhiteListsData.push(null);
                    }
                  }
                }

                return Promise.all(whenWhiteListsData)
                  .then((whiteListsData) => {
                    console.log("whiteListsData:", whiteListsData)
                    let whitelistPromises = []
                    for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                      if (tiers[tierNum].whitelist_enabled) {
                        tiers[tierNum].whitelist = []
                        for (let whiteListItemNum = 0; whiteListItemNum < whiteListsData[tierNum].whitelist.length; whiteListItemNum++) {
                          let newWhitelistPromise = new Promise((resolve) => {
                            initCrowdsaleContract.methods.getWhitelistStatus(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum, whiteListsData[tierNum].whitelist[whiteListItemNum]).call()
                              .then(whitelistStatus => {
                                console.log("whitelistStatus:", whitelistStatus)
                                tiers[tierNum].whitelist.push({
                                  addr: whiteListsData[tierNum].whitelist[whiteListItemNum],
                                  min: whitelistStatus.minimum_contribution,
                                  max: whitelistStatus.max_spend_remaining
                                })
                                resolve();
                              })
                          })
                          whitelistPromises.push(newWhitelistPromise)
                        }
                      }
                    }
                    return Promise.all(whitelistPromises)
                      .then(() => {
                        console.log(tiers)
                        return tiers.reduce((promise, tier, index) => {
                          return promise.then(() => processTier(tier, crowdsale, token, index))
                        }, Promise.resolve())
                      })
                  })
                  .catch((err) => {
                    console.log(tiers)
                    return tiers.reduce((promise, tier, index) => {
                      return promise.then(() => processTier(tier, crowdsale, token, index))
                    }, Promise.resolve())
                  })
              })
              .then(this.updateCrowdsaleStatus)
              .catch(err => {
                this.hideLoader()
                console.log(err)
              })
              .then(this.hideLoader)
          })
          .catch(err => {
            console.log(err)
            this.hideLoader()
          })
      })
      .catch(err => {
        console.log(err)
        this.hideLoader()
      })
  }

  hideLoader = () => {
    this.setState({ loading: false })
  }

  showLoader = () => {
    this.setState({ loading: true })
  }

  updateCrowdsaleStatus = () => {
    return this.setCrowdsaleInfo()
      .then(this.canFinalize)
      .then(this.checkOwner)
  }

  setCrowdsaleInfo = () => {
    const { contractStore, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`
    return attachToSpecificCrowdsaleContract(target)
      .then((initCrowdsaleContract) => {
        let registryStorageObj = toJS(contractStore.registryStorage)
        return initCrowdsaleContract.methods.getCrowdsaleStartAndEndTimes(registryStorageObj.addr, contractStore.crowdsale.execID).call();
      })
      .then(crowdsaleStartAndEndTimes => {
        console.log("crowdsaleStartAndEndTimes.end_time:", crowdsaleStartAndEndTimes.end_time)
        this.setState({ crowdsaleHasEnded: crowdsaleStartAndEndTimes.end_time * 1000 <= Date.now() || crowdsaleStore.selected.finalized })
      })
  }

  canFinalize = () => {
    const { contractStore, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    return attachToSpecificCrowdsaleContract(target)
      .then((initCrowdsaleContract) => {
        let registryStorageObj = toJS(contractStore.registryStorage)
        const whenCrowdsaleInfo = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, contractStore.crowdsale.execID).call();
        const whenIsCrowdsaleFull = initCrowdsaleContract.methods.isCrowdsaleFull(registryStorageObj.addr, contractStore.crowdsale.execID).call();
        return Promise.all([whenCrowdsaleInfo, whenIsCrowdsaleFull])
      })
      .then(
        ([crowdsaleInfo, isCrowdsaleFullObj]) => {
          const isCrowdsaleFull = isCrowdsaleFullObj.is_crowdsale_full
          const isFinalized = crowdsaleInfo.is_finalized
          if (isFinalized) {
            this.setState({ canFinalize: false })
          } else {
            const { crowdsaleHasEnded } = this.state

            this.setState({
              canFinalize: (crowdsaleHasEnded || isCrowdsaleFull)
            })
          }
        },
        () => this.setState({ canFinalize: false })
      )
  }

  getFinalizeCrowdsaleParams = (methodInterface) => {
    const { web3Store } = this.props
    const { web3 } = web3Store

    let context = generateContext(0);
    let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, [context]);
    return encodedParameters;
  }

  finalizeCrowdsale = () => {
    this.updateCrowdsaleStatus()
      .then(() => {
        const { crowdsaleStore } = this.props

        if (!crowdsaleStore.selected.finalized && this.state.canFinalize) {
          warningOnFinalizeCrowdsale()
            .then(result => {
              if (result.value) {
                this.showLoader()

                getCurrentAccount()
                  .then(account => {
                    const methodInterface = ["bytes"]

                    let methodName
                    let targetPrefix
                    if (crowdsaleStore.isMintedCappedCrowdsale) {
                      methodName = "finalizeCrowdsale"
                      targetPrefix = "tokenConsole"
                    } else if (crowdsaleStore.isDutchAuction) {
                      methodName = "finalizeCrowdsaleAndToken"
                      targetPrefix = "crowdsaleConsole"
                    }
                    const targetSuffix = crowdsaleStore.contractTargetSuffix
                    const target = `${targetPrefix}${targetSuffix}`

                    let paramsToExec = [methodInterface]
                    const method = methodToExec(`${methodName}(${methodInterface.join(',')})`, target, this.getFinalizeCrowdsaleParams, paramsToExec)

                    let opts = {
                      gasPrice: this.props.generalStore.gasPrice,
                      from: account
                    }

                    method.estimateGas(opts)
                      .then(estimatedGas => {
                        console.log("estimatedGas:",estimatedGas)
                        opts.gasLimit = calculateGasLimit(estimatedGas)
                        return sendTXToContract(method.send(opts))
                      })
                      .then(() => {
                        crowdsaleStore.setSelectedProperty('finalized', true)
                        this.setState({ canFinalize: false }, () => {
                          successfulFinalizeAlert().then(() => {
                            this.setState({ loading: true })
                            setTimeout(() => window.location.reload(), 500)
                          })
                        })
                      })
                      .catch((err) => {
                        console.log(err)
                        toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.FINALIZE_FAIL })
                      })
                      .then(this.hideLoader)
                  })
              }
            })
        }
      })
      .catch(console.error)
  }

  saveCrowdsale = () => {
    this.showLoader()

    this.updateCrowdsaleStatus()
      .then(() => {
        const { crowdsaleStore, tierStore } = this.props
        const updatableTiers = crowdsaleStore.selected.initialTiersValues.filter(tier => tier.updatable)
        const isValidTier = tierStore.individuallyValidTiers
        const validTiers = updatableTiers.every(tier => isValidTier[tier.index])

        if (updatableTiers.length && validTiers) {
          const fieldsToUpdate = getFieldsToUpdate(updatableTiers, tierStore.tiers)

          fieldsToUpdate
            .reduce((promise, { key, newValue, tier }) => {
              return promise.then(() => updateTierAttribute(key, newValue, tier))
            }, Promise.resolve())
            .then(() => {
              this.hideLoader()
              successfulUpdateCrowdsaleAlert()
            })
            .catch(err => {
              console.log(err)
              this.hideLoader()
              toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
            })

        } else {
          this.hideLoader()
        }
      })
      .catch(error => {
        console.error(error)
        this.hideLoader()
      })
  }

  updateTierStore = ({ values }) => {
    const { tierStore } = this.props
    values.tiers.forEach((tier, index) => {
      tierStore.setTierProperty(tier.tier, 'tier', index)
      tierStore.setTierProperty(tier.updatable, 'updatable', index)
      tierStore.setTierProperty(tier.startTime, 'startTime', index)
      tierStore.setTierProperty(tier.endTime, 'endTime', index)
      tierStore.updateRate(tier.rate, VALID, index)
      tierStore.setTierProperty(tier.supply, 'supply', index)
      tierStore.validateTiers('supply', index)
    })
  }

  render () {
    const { canFinalize, crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { generalStore, tierStore, tokenStore, crowdsaleStore } = this.props
    const { finalized, updatable } = crowdsaleStore.selected
    const { execID } = crowdsaleStore

    return (
      <section className="manage">
        <FinalizeCrowdsaleStep
          disabled={!ownerCurrentUser || finalized || !canFinalize}
          handleClick={this.finalizeCrowdsale}
        />

        <Form
          onSubmit={this.saveCrowdsale}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: this.initialTiers, }}
          component={ManageForm}
          canEditTiers={ownerCurrentUser && !canFinalize && !finalized}
          crowdsaleStore={crowdsaleStore}
          decimals={tokenStore.decimals}
          aboutTier={
            <AboutCrowdsale
              name={tokenStore.name}
              ticker={tokenStore.ticker}
              execID={execID}
              networkID={generalStore.networkID}
            />
          }
          handleChange={this.updateTierStore}
          canSave={ownerCurrentUser && tierStore.modifiedStoredWhitelist && !crowdsaleHasEnded && updatable}
        />

        <Loader show={this.state.loading}/>

      </section>
    )
  }
}
