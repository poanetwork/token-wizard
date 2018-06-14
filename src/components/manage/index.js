import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { TOAST } from '../../utils/constants'
import '../../assets/stylesheets/application.css'
import {
  successfulFinalizeAlert,
  successfulUpdateCrowdsaleAlert,
  warningOnFinalizeCrowdsale,
  notTheOwner,
  invalidNetworkIDAlert,
  invalidCrowdsaleExecIDAlert
} from '../../utils/alerts'
import {
  getCurrentAccount,
  getNetworkVersion,
  sendTXToContract,
  calculateGasLimit,
  attachToSpecificCrowdsaleContract,
  methodToExec,
  getCrowdsaleStrategy,
  checkWeb3
} from '../../utils/blockchainHelpers'
import { isExecIDValid, isNetworkIDValid, toast } from '../../utils/utils'
import { getCrowdsaleAssets } from '../../stores/utils'
import { getFieldsToUpdate, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'
import { getTiersLength, toBigNumber } from '../crowdsale/utils'
import { updateGlobalMinContribution } from '../stepFour/utils'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { FinalizeCrowdsaleStep } from './FinalizeCrowdsaleStep'
import { ReservedTokensList } from './ReservedTokensList'
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
      loading: true,
      canFinalize: false,
      ownerCurrentUser: false,
      crowdsaleHasEnded: true,
      crowdsaleHasStarted: false,
      crowdsaleIsUpdatable: false,
      crowdsaleIsWhitelisted: false,
      crowdsaleIsFinalized: false,
    }

    this.initialValues = {
      tiers: [],
      minCap: 0
    }
  }

  componentDidMount () {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }

  componentWillMount () {
    const { crowdsaleStore, generalStore, tierStore } = this.props

    this.validateEnvironment()
      .then(() => getCrowdsaleAssets(generalStore.networkID))
      .then(() => this.checkOwner())
      .then(() => getCrowdsaleStrategy(crowdsaleStore.execID))
      .then((strategy) => crowdsaleStore.setProperty('strategy', strategy))
      //.then((strategy) => crowdsaleStore.setProperty('strategy', CROWDSALE_STRATEGIES.DUTCH_AUCTION)) // todo
      .then(() => this.extractContractsData())
      .then(() => this.updateCrowdsaleStatus())
      .then(() => {
        this.initialValues.tiers = JSON.parse(JSON.stringify(tierStore.tiers))
        this.initialValues.minCap = +tierStore.globalMinCap
      })
      .catch((err) => console.error(err))
      .then(() => {
        this.hideLoader()
        if (!this.state.ownerCurrentUser) notTheOwner()
      })
  }

  validateEnvironment = async () => {
    const { generalStore, crowdsaleStore, contractStore, web3Store, match } = this.props

    await checkWeb3()

    if (!web3Store.web3) {
      return Promise.reject('no web3 available')
    }

    const networkID = await getNetworkVersion()
    generalStore.setProperty('networkID', networkID)

    if (!isNetworkIDValid(networkID)) {
      invalidNetworkIDAlert()
      return Promise.reject('invalid networkID')
    }

    const { crowdsaleExecID } = match.params
    crowdsaleStore.setSelectedProperty('execID', crowdsaleExecID)
    crowdsaleStore.setProperty('execID', crowdsaleExecID)
    contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)

    if (!isExecIDValid(crowdsaleExecID)) {
      invalidCrowdsaleExecIDAlert()
      return Promise.reject('invalid exec-id')
    }
  }

  componentWillUnmount () {
    const { tierStore, tokenStore, crowdsaleStore } = this.props
    tierStore.reset()
    tokenStore.reset()
    crowdsaleStore.reset()
  }

  checkOwner = async () => {
    const { contractStore, crowdsaleStore } = this.props

    const targetPrefix = "idx"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { addr } = contractStore.abstractStorage
    const { execID } = crowdsaleStore
    const ownerAccount = await methods.getAdmin(addr, execID).call()
    const account = await getCurrentAccount()

    const ownerCurrentUser = account === ownerAccount
    this.setState({ ownerCurrentUser })
    contractStore.setContractProperty('crowdsale', 'account', account)
  }

  extractContractsData = async () => {
    try {
      const { crowdsaleStore, contractStore, tierStore } = this.props
      const { addr: abstractStorageAddr } = contractStore.abstractStorage
      const { isMintedCappedCrowdsale, isDutchAuction, execID } = crowdsaleStore

      const num_of_tiers = await getTiersLength()
      console.log("num_of_tiers:", num_of_tiers)

      const { methods } = await attachToSpecificCrowdsaleContract(`idx${crowdsaleStore.contractTargetSuffix}`)
      const {
        getCrowdsaleInfo,
        getTokenInfo,
        getReservedTokenDestinationList,
        getCrowdsaleTier,
        getTierStartAndEndDates,
        getCrowdsaleStatus,
        getCrowdsaleStartAndEndTimes,
        getReservedDestinationInfo,
        getTierWhitelist,
        getWhitelistStatus,
        getCrowdsaleWhitelist,
        getTokensSold
      } = methods

      const crowdsale = await getCrowdsaleInfo(abstractStorageAddr, execID).call()
      const token = await getTokenInfo(abstractStorageAddr, execID).call()

      const tiers = []
      const reserved_tokens_info = []

      if (isMintedCappedCrowdsale) {
        for (let tier_num = 0; tier_num < num_of_tiers; tier_num++) {
          const tier_data = await getCrowdsaleTier(abstractStorageAddr, execID, tier_num).call()
          const tier_dates = await getTierStartAndEndDates(abstractStorageAddr, execID, tier_num).call()

          if (tier_data.whitelist_enabled) {
            const { whitelist } = await getTierWhitelist(abstractStorageAddr, execID, tier_num).call()

            console.log("whitelist:", whitelist)

            for (let whitelist_item_index = 0; whitelist_item_index < whitelist.length; whitelist_item_index++) {
              const whitelist_item_addr = whitelist[whitelist_item_index]
              const {
                max_spend_remaining,
                minimum_contribution
              } = await getWhitelistStatus(abstractStorageAddr, execID, tier_num, whitelist_item_addr).call()

              if (max_spend_remaining > 0) {
                if (!tier_data.whitelist) tier_data.whitelist = []

                tier_data.whitelist.push({
                  addr: whitelist_item_addr,
                  min: minimum_contribution,
                  max: max_spend_remaining
                })
              }
            }
          }

          tiers.push(Object.assign(tier_data, tier_dates))
        }

        const { _reserved_destinations } = await getReservedTokenDestinationList(abstractStorageAddr, execID).call()

        if (_reserved_destinations) {
          for (let destination_index = 0; destination_index < _reserved_destinations.length; destination_index++) {
            const reserved_addr = _reserved_destinations[destination_index]
            const {
              num_tokens,
              num_percent,
              percent_decimals
            } = await getReservedDestinationInfo(abstractStorageAddr, execID, reserved_addr).call()

            if (num_tokens > 0) {
              reserved_tokens_info.push({
                addr: reserved_addr,
                dim: "tokens",
                val: toBigNumber(num_tokens).times(`1e-${token._token_decimals}`).toFixed()
              })
            }

            if (num_percent > 0) {
              reserved_tokens_info.push({
                addr: reserved_addr,
                dim: "percentage",
                val: toBigNumber(num_percent).times(`1e-${percent_decimals}`).toFixed()
              })
            }
          }
        }

      } else if (isDutchAuction) {
        const tier_data = await getCrowdsaleStatus(abstractStorageAddr, execID).call()
        const tier_dates = await getCrowdsaleStartAndEndTimes(abstractStorageAddr, execID).call()
        const { num_whitelisted, whitelist } = await getCrowdsaleWhitelist(abstractStorageAddr, execID).call()
        const tokens_sold = await getTokensSold(abstractStorageAddr, execID).call()

        if (num_whitelisted !== '0') {
          // TODO: remove this attribute overwrite after auth_os implement whitelist_enabled for Dutch Auction
          tier_data.whitelist_enabled = true

          for (let whitelist_item_index = 0; whitelist_item_index < whitelist.length; whitelist_item_index++) {
            const whitelist_item_addr = whitelist[whitelist_item_index]
            const {
              max_spend_remaining,
              minimum_contribution
            } = await getWhitelistStatus(abstractStorageAddr, execID, whitelist_item_addr).call()

            if (max_spend_remaining > 0) {
              if (!tier_data.whitelist) tier_data.whitelist = []

              tier_data.whitelist.push({
                addr: whitelist_item_addr,
                min: minimum_contribution,
                max: max_spend_remaining
              })
            }
          }
        }

        tiers.push(Object.assign(tier_data, tier_dates, tokens_sold))
      }

      console.log('tiers:', tiers)

      tiers.forEach((tier, index) => processTier(tier, crowdsale, token, reserved_tokens_info, index))

      tierStore.setGlobalMinCap(toBigNumber(crowdsale.minimum_contribution).div(`1e${token._token_decimals}`).toFixed())

    } catch (err) {
      return Promise.reject(err)
    }
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
    const { execID, selected } = crowdsaleStore
    const { addr } = contractStore.abstractStorage
    const { initialTiersValues } = selected

    const targetPrefix = "idx"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { getCrowdsaleStartAndEndTimes, getCrowdsaleInfo } = methods
    const { _start_time, _end_time } = await getCrowdsaleStartAndEndTimes(addr, execID).call()
    const { is_finalized } = await getCrowdsaleInfo(addr, execID).call()

    this.setState({
      crowdsaleHasEnded: _end_time * 1000 <= Date.now(),
      crowdsaleHasStarted: _start_time * 1000 >= Date.now(),
      crowdsaleIsUpdatable: initialTiersValues.some(tier => tier.updatable),
      crowdsaleIsWhitelisted: initialTiersValues.some(tier => tier.isWhitelisted),
      crowdsaleIsFinalized: is_finalized
    })
  }

  canFinalize = async () => {
    const { contractStore, crowdsaleStore } = this.props
    const { addr } = contractStore.abstractStorage
    const { execID } = crowdsaleStore

    const targetPrefix = "idx"
    const targetSuffix = crowdsaleStore.contractTargetSuffix
    const target = `${targetPrefix}${targetSuffix}`

    const { methods } = await attachToSpecificCrowdsaleContract(target)
    const { getCrowdsaleInfo, isCrowdsaleFull } = methods

    try {
      const { is_finalized } = await getCrowdsaleInfo(addr, execID).call()
      const { is_crowdsale_full } = await isCrowdsaleFull(addr, execID).call()

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

    let encodedParameters = web3.eth.abi.encodeParameters(methodInterface, []);
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
                    const methodInterface = []

                    let methodName
                    let targetPrefix
                    if (crowdsaleStore.isMintedCappedCrowdsale) {
                      methodName = "finalizeCrowdsaleAndToken"
                      targetPrefix = "tokenManager"
                    } else if (crowdsaleStore.isDutchAuction) {
                      methodName = "finalizeCrowdsale"
                      targetPrefix = "crowdsaleConsole"
                    }

                    let paramsToExec = [methodInterface]
                    const method = methodToExec("registryExec", `${methodName}(${methodInterface.join(',')})`, this.getFinalizeCrowdsaleParams, paramsToExec)

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
    const { initialTiersValues } = crowdsaleStore.selected
    const { globalMinCap, tiers, modifiedStoredWhitelist, individuallyValidTiers } = tierStore

    // TODO: review validations after this fix: https://github.com/final-form/react-final-form/issues/151
    // once done, can be replaced with _pristine_ state value

    const validTiers = initialTiersValues.every(tier => individuallyValidTiers[tier.index])
    const fieldsToUpdate = validTiers ? getFieldsToUpdate(initialTiersValues, tiers) : []
    const modifiedMinCap = globalMinCap ? !toBigNumber(this.initialValues.minCap).eq(globalMinCap) : false
    const valuesChanged = modifiedStoredWhitelist || fieldsToUpdate.length > 0 || modifiedMinCap
    const canSave = ownerCurrentUser && valuesChanged && !crowdsaleHasEnded

    return {
      canSave,
      fieldsToUpdate,
      globalMinCap: modifiedMinCap ? globalMinCap : null
    }
  }

  saveDisplayed = () => {
    const { ownerCurrentUser, crowdsaleHasEnded, crowdsaleIsFinalized, canFinalize } = this.state
    return ownerCurrentUser && !crowdsaleHasEnded && (!crowdsaleIsFinalized || !canFinalize)
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
          .then(() => canSaveObj.globalMinCap !== null ? updateGlobalMinContribution()[0]() : Promise.resolve())
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
    tierStore.setGlobalMinCap(values.minCap)
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

        tierStore.setTierProperty(value, 'startTime', nextTierIndex)
        tierStore.setTierProperty(nextEnd, 'endTime', nextTierIndex)
      }

      return newValue
    }
  })

  render () {
    const {
      canFinalize,
      ownerCurrentUser,
      crowdsaleIsFinalized,
      crowdsaleHasEnded,
      crowdsaleIsWhitelisted,
      loading
    } = this.state

    return (
      <section className="manage">

        <FinalizeCrowdsaleStep
          disabled={!ownerCurrentUser || crowdsaleIsFinalized || !canFinalize}
          handleClick={this.finalizeCrowdsale}
        />

        <ReservedTokensList owner={ownerCurrentUser}/>

        <Form
          onSubmit={this.saveCrowdsale}
          mutators={{ ...arrayMutators }}
          decorators={[this.calculator]}
          initialValues={{ ...this.initialValues }}
          component={ManageForm}
          canEditTiers={ownerCurrentUser && !canFinalize && !crowdsaleIsFinalized}
          canEditMinCap={ownerCurrentUser && !crowdsaleHasEnded && !crowdsaleIsWhitelisted}
          handleChange={this.updateTierStore}
          canSave={loading ? null : this.canBeSaved().canSave}
          displaySave={this.saveDisplayed()}
        />

        <Loader show={this.state.loading}/>

      </section>
    )
  }
}
