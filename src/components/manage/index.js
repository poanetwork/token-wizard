import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { TOAST } from '../../utils/constants'
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
import { getTiersLength } from '../crowdsale/utils'
import { generateContext } from '../stepFour/utils'
import { toJS } from 'mobx'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { AboutCrowdsale } from './AboutCrowdsale'
import { FinalizeCrowdsaleStep } from './FinalizeCrowdsaleStep'
import { DistributeTokensStep } from './DistributeTokensStep'
import { ManageForm } from './ManageForm'
import moment from 'moment'

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
      ownerCurrentUser: false
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

  checkOwner = async () => {
    const { contractStore, web3Store, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { addr } = toJS(contractStore.registryStorage)
    const ownerAccount = await methods.getAdmin(addr, contractStore.crowdsale.execID).call()
    const accounts = await web3Store.web3.eth.getAccounts()

    const ownerCurrentUser = accounts[0] === ownerAccount
    this.setState({ ownerCurrentUser })

    if (!ownerCurrentUser) notTheOwner()
  }

  extractContractsData = () => {
    const { crowdsaleStore, contractStore, match } = this.props
    contractStore.setContractProperty('crowdsale', 'execID', match.params.crowdsaleExecID)

    const registryStorageObj = toJS(contractStore.registryStorage)
    const { addr: registryStorageAddr } = registryStorageObj
    const execID = contractStore.crowdsale.execID
    const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore

    return getTiersLength()
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
                const { methods } = initCrowdsaleContract

                let whenCrowdsale = methods.getCrowdsaleInfo(registryStorageAddr, execID).call()
                let whenToken = methods.getTokenInfo(registryStorageAddr, execID).call()
                const whenReservedTokensDestinations = isMintedCappedCrowdsale ? methods.getReservedTokenDestinationList(registryStorageAddr, execID).call() : null

                let whenCrowdsaleData = []
                let whenCrowdsaleDates = []
                let whenTokensSold = []
                if (isMintedCappedCrowdsale) {
                  for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                    let whenTierData = methods.getCrowdsaleTier(registryStorageAddr, execID, tierNum).call()
                    let whenTierDates = methods.getTierStartAndEndDates(registryStorageAddr, execID, tierNum).call()
                    whenCrowdsaleData.push(whenTierData)
                    whenCrowdsaleDates.push(whenTierDates)
                  }
                } else if (isDutchAuction) {
                  let whenDutchAuctionData = methods.getCrowdsaleStatus(registryStorageAddr, execID).call()
                  let whenDutchAuctionGetTokensSold = methods.getTokensSold(registryStorageAddr, execID).call()
                  let whenDutchAuctionDates = methods.getCrowdsaleStartAndEndTimes(registryStorageAddr, execID).call()
                  whenCrowdsaleData.push(whenDutchAuctionData)
                  whenCrowdsaleDates.push(whenDutchAuctionDates)
                  whenTokensSold.push(whenDutchAuctionGetTokensSold)
                }
                const allPromisesRaw = [methods, whenCrowdsale, whenToken, whenReservedTokensDestinations, whenCrowdsaleData, whenCrowdsaleDates, whenTokensSold]
                const allPromises = allPromisesRaw.map(function(item) {
                  if (Array.isArray(item)) { return Promise.all(item) }
                  else { return item }
                })
                return Promise.all(allPromises)
              })
              .then(([methods, crowdsale, token, reservedTokensDestinationsObj, crowdsaleData, crowdsaleDates, tokensSold]) => {
                let tiers = []
                let tierExtendedObj = {}
                crowdsaleData.forEach((el, ind) => {
                  tierExtendedObj = Object.assign(el, crowdsaleDates[ind])
                  tierExtendedObj.token_sold = tokensSold[ind]
                  tiers.push(tierExtendedObj)
                })
                console.log("tiers:", tiers)

                //get reserved tokens info
                let reservedTokensDestinations = []
                let whenReservedTokensInfoArr = []
                if (isMintedCappedCrowdsale) {
                  reservedTokensDestinations = reservedTokensDestinationsObj.reserved_destinations
                  for (let dest = 0; dest < reservedTokensDestinations.length; dest++) {
                    let destination = reservedTokensDestinations[dest]
                    console.log("destination:", destination)
                    let whenReservedTokensInfo = methods.getReservedDestinationInfo(registryStorageAddr, execID, destination).call()
                    whenReservedTokensInfoArr.push(whenReservedTokensInfo)
                  }
                }

                //get whitelists for tiers
                let whenWhiteListsData = []
                let method
                if (isMintedCappedCrowdsale) {
                  for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                    method = methods.getTierWhitelist(registryStorageAddr, execID, tierNum).call()
                    if (tiers[tierNum].whitelist_enabled) {
                      whenWhiteListsData.push(method)
                    } else {
                      whenWhiteListsData.push(null)
                    }
                  }
                } else if (isDutchAuction) {
                  method = methods.getCrowdsaleWhitelist(registryStorageAddr, execID).call()
                  whenWhiteListsData.push(method)
                }

                console.log("whenReservedTokensInfoArr.length:", whenReservedTokensInfoArr.length)
                console.log("whenWhiteListsData.length:", whenWhiteListsData.length)

                const allPromisesRaw = [whenReservedTokensInfoArr, whenWhiteListsData]
                const allPromises = allPromisesRaw.map(function(item) {
                  if (Array.isArray(item)) { return Promise.all(item) }
                  else { return item }
                })

                return Promise.all(allPromises)
                  .then(([reservedTokensInfoRaw, whiteListsData]) => {
                    console.log("totalData:", [reservedTokensInfoRaw, whiteListsData])

                    console.log("reservedTokensInfoRaw:", reservedTokensInfoRaw)
                    let reservedTokensInfo = []
                    for (let dest = 0; dest < reservedTokensInfoRaw.length; dest++) {
                      let reservedTokensInfoObj = reservedTokensInfoRaw[dest]
                      if (reservedTokensInfoObj.num_tokens > 0) {
                        let reservedTokensObj = {
                          addr: reservedTokensDestinations[dest],
                          dim: "tokens",
                          val: Number(reservedTokensInfoObj.num_tokens) / `1e${token.token_decimals}`
                        }
                        reservedTokensInfo.push(reservedTokensObj)
                      }
                      if (reservedTokensInfoObj.num_percent > 0) {
                        let reservedTokensObj = {
                          addr: reservedTokensDestinations[dest],
                          dim: "percentage",
                          val: Number(reservedTokensInfoObj.num_percent) / `1e${reservedTokensInfoObj.percent_decimals}`
                        }
                        reservedTokensInfo.push(reservedTokensObj)
                      }
                    }

                    const fillWhiteListPromises = (tierNum) => {
                      let whitelist = whiteListsData[tierNum].whitelist
                      for (let whiteListItemNum = 0; whiteListItemNum < whitelist.length; whiteListItemNum++) {
                        let newWhitelistPromise = new Promise((resolve) => {
                          let method
                          if (isMintedCappedCrowdsale) {
                            method = methods.getWhitelistStatus(registryStorageAddr, execID, tierNum, whitelist[whiteListItemNum]).call()
                          } else if (isDutchAuction) {
                            method = methods.getWhitelistStatus(registryStorageAddr, execID, whitelist[whiteListItemNum]).call()
                          }
                          method
                            .then(whitelistStatus => {
                              if (whitelistStatus.max_spend_remaining > 0) {
                                let whitelistItem = {
                                  addr: whitelist[whiteListItemNum],
                                  min: whitelistStatus.minimum_contribution,
                                  max: whitelistStatus.max_spend_remaining
                                }
                                if (!tiers[tierNum].whitelist) tiers[tierNum].whitelist = []
                                tiers[tierNum].whitelist.push(whitelistItem)
                              }
                              resolve();
                            })
                        })
                        whitelistPromises.push(newWhitelistPromise)
                      }
                    }

                    let whitelistPromises = []
                    if (isMintedCappedCrowdsale) {
                      for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                        if (tiers[tierNum].whitelist_enabled) {
                          fillWhiteListPromises(tierNum)
                        }
                      }
                    } else if (isDutchAuction) {
                      fillWhiteListPromises(0)
                    }

                    return Promise.all(whitelistPromises)
                      .then(() => {
                        console.log(tiers)
                        return tiers.reduce((promise, tier, index) => {
                          return promise.then(() => processTier(tier, crowdsale, token, reservedTokensInfo, index))
                        }, Promise.resolve())
                      })
                  })
                  .catch((err) => {
                    console.log(tiers)
                    return tiers.reduce((promise, tier, index) => {
                      return promise.then(() => processTier(tier, crowdsale, token, [], index))
                    }, Promise.resolve())
                  })
              })
              .then(this.updateCrowdsaleStatus)
              .catch((err) => { this.hideLoader(err) })
              .then(this.hideLoader)
          })
          .catch((err) => { this.hideLoader(err) })
      })
      .catch((err) => { this.hideLoader(err) })
  }

  hideLoader = (err) => {
    if (err) {
      console.log(err)
    }
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

  setCrowdsaleInfo = async () => {
    const { contractStore, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { addr } = toJS(contractStore.registryStorage)
    const { end_time } = await methods.getCrowdsaleStartAndEndTimes(addr, contractStore.crowdsale.execID).call()

    console.log("crowdsaleStartAndEndTimes.end_time:", end_time)
    this.setState({ crowdsaleHasEnded: end_time * 1000 <= Date.now() || crowdsaleStore.selected.finalized })
  }

  canFinalize = async () => {
    const { contractStore, crowdsaleStore } = this.props

    const targetPrefix = "initCrowdsale"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { getCrowdsaleInfo, isCrowdsaleFull } = methods
    const { addr } = toJS(contractStore.registryStorage)

    try {
      const { is_finalized } = await getCrowdsaleInfo(addr, contractStore.crowdsale.execID).call()
      const { is_crowdsale_full } = await isCrowdsaleFull(addr, contractStore.crowdsale.execID).call()

      if (is_finalized) {
        this.setState({ canFinalize: false })
      } else {
        const { crowdsaleHasEnded } = this.state

        this.setState({
          canFinalize: crowdsaleHasEnded || is_crowdsale_full
        })
      }
    } catch (e) {
      console.error(e)
      this.setState({ canFinalize: false })
    }
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
                      methodName = "finalizeCrowdsaleAndToken"
                      targetPrefix = "tokenConsole"
                    } else if (crowdsaleStore.isDutchAuction) {
                      methodName = "finalizeCrowdsale"
                      targetPrefix = "crowdsaleConsole"
                    }
                    const targetSuffix = crowdsaleStore.contractTargetSuffix
                    const target = `${targetPrefix}${targetSuffix}`

                    let paramsToExec = [methodInterface]
                    const method = methodToExec("scriptExec", `${methodName}(${methodInterface.join(',')})`, target, this.getFinalizeCrowdsaleParams, paramsToExec)

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

  canBeSaved = () => {
    const { crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { tierStore, crowdsaleStore } = this.props
    const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore
    const { updatable, initialTiersValues } = crowdsaleStore.selected

    const updatableTiersMintedCappedCrowdsale = initialTiersValues.filter(tier => tier.updatable)
    const updatableTiers = isMintedCappedCrowdsale ? updatableTiersMintedCappedCrowdsale : isDutchAuction ? initialTiersValues : []
    const isValidTier = tierStore.individuallyValidTiers
    const validTiers = updatableTiers.every(tier => isValidTier[tier.index])

    let fieldsToUpdate = []
    if (updatableTiers.length && validTiers) {
      fieldsToUpdate = getFieldsToUpdate(updatableTiers, tierStore.tiers)
    }

    const canSaveCommon = ownerCurrentUser && (tierStore.modifiedStoredWhitelist || fieldsToUpdate.length > 0) && !crowdsaleHasEnded
    let canSave = canSaveCommon
    if (isMintedCappedCrowdsale) {
      canSave = canSaveCommon && updatable
    }

    const canSaveObj = {
      canSave,
      fieldsToUpdate
    }

    return canSaveObj
  }

  saveDisplayed = () => {
    const { crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { crowdsaleStore } = this.props
    const { isDutchAuction, isMintedCappedCrowdsale } = crowdsaleStore
    const crowdsaleIsUpdatable = crowdsaleStore.selected.initialTiersValues.some(tier => tier.updatable)
    const crowdsaleIsWhitelisted = crowdsaleStore.selected.initialTiersValues.some(tier => tier.isWhitelisted)
    if (
      !ownerCurrentUser
      || crowdsaleHasEnded
      || (isMintedCappedCrowdsale && !crowdsaleIsUpdatable)
      || (isDutchAuction && !crowdsaleIsWhitelisted)
    ) {
      return false
    }
    return true
  }

  saveCrowdsale = () => {
    const canSaveObj = this.canBeSaved()
    if (!canSaveObj.canSave) return;

    this.showLoader()

    this.updateCrowdsaleStatus()
      .then(() => {
        console.log("fieldsToUpdate:", canSaveObj.fieldsToUpdate)

        canSaveObj.fieldsToUpdate
          .reduce((promise, { key, newValue, tier }) => {
            return promise.then(() => updateTierAttribute(key, newValue, tier))
          }, Promise.resolve())
          .then(() => {
            this.hideLoader()
            successfulUpdateCrowdsaleAlert()
          })
          .catch(err => {
            this.hideLoader(err)
            toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED })
          })

      })
      .catch(error => {
        this.hideLoader(error)
      })
  }

  updateTierStore = ({ values }) => {
    const { tierStore } = this.props
    values.tiers.forEach((tier, index) => {
      tierStore.setTierProperty(tier.endTime, 'endTime', index)
    })
  }

  calculator = createDecorator({
    field: /.+\.endTime/,
    updates: (value, name, allValues) => {
      const nextTierIndex = +name.match(/(\d+)/)[1] + 1
      const { tierStore } = this.props
      const newValue = {}


      if (tierStore.tiers[nextTierIndex]) {
        const currentEnd = moment(allValues.tiers[nextTierIndex].endTime)
        const currentStart = moment(allValues.tiers[nextTierIndex].startTime)
        const duration = moment.duration(currentEnd.diff(currentStart)).as('minutes')
        const nextEnd = moment(value).add(duration, 'm').format('YYYY-MM-DDTHH:mm')

        newValue[`tiers[${nextTierIndex}].startTime`] = value
        newValue[`tiers[${nextTierIndex}].endTime`] = nextEnd
      }

      return newValue
    }
  })

  render () {
    const { canFinalize, ownerCurrentUser } = this.state
    const { generalStore, tokenStore, crowdsaleStore } = this.props
    const { finalized } = crowdsaleStore.selected
    const { execID } = crowdsaleStore

    return (
      <section className="manage">

        <FinalizeCrowdsaleStep
          disabled={!ownerCurrentUser || finalized || !canFinalize}
          handleClick={this.finalizeCrowdsale}
        />

        <DistributeTokensStep
          owner={ownerCurrentUser}
          disabled={!ownerCurrentUser}
          handleClick={this.distributeReservedTokens}
        />

        <Form
          onSubmit={this.saveCrowdsale}
          mutators={{ ...arrayMutators }}
          decorators={[this.calculator]}
          initialValues={{ tiers: this.initialTiers, }}
          component={ManageForm}
          canEditTiers={ownerCurrentUser && !canFinalize && !finalized}
          crowdsaleStore={crowdsaleStore}
          decimals={tokenStore.decimals}
          tokenSupply={tokenStore.supply}
          aboutTier={
            <AboutCrowdsale
              name={tokenStore.name}
              ticker={tokenStore.ticker}
              execID={execID}
              networkID={generalStore.networkID}
            />
          }
          handleChange={this.updateTierStore}
          canSave={this.canBeSaved().canSave}
          displaySave={this.saveDisplayed()}
        />

        <Loader show={this.state.loading}/>

      </section>
    )
  }
}
