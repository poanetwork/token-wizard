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
import { getTiersLength, toBigNumber } from '../crowdsale/utils'
import { generateContext, updateGlobalMinContribution } from '../stepFour/utils'
import { toJS } from 'mobx'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { FinalizeCrowdsaleStep } from './FinalizeCrowdsaleStep'
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
      ownerCurrentUser: false,
      initialGlobalMinCap: 0
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
        .then(this.extractContractsData)
        .then(() => {
          this.initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
          this.setState({ initialGlobalMinCap: tierStore.globalMinCap })
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

  extractContractsData = async () => {
    try {
      const { crowdsaleStore, contractStore, tierStore, match } = this.props
      const { crowdsaleExecID } = match.params
      const { addr: registryStorageAddr } = toJS(contractStore.registryStorage)
      const { isMintedCappedCrowdsale, isDutchAuction } = crowdsaleStore
      const account = await getCurrentAccount()

      contractStore.setContractProperty('crowdsale', 'account', account)
      contractStore.setContractProperty('crowdsale', 'execID', crowdsaleExecID)

      const num_of_tiers = await getTiersLength()
      console.log("num_of_tiers:", num_of_tiers)

      const { methods } = await attachToSpecificCrowdsaleContract(`initCrowdsale${crowdsaleStore.contractTargetSuffix}`)
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
      } = methods

      const crowdsale = await getCrowdsaleInfo(registryStorageAddr, crowdsaleExecID).call()
      const token = await getTokenInfo(registryStorageAddr, crowdsaleExecID).call()

      const tiers = []
      const reserved_tokens_info = []

      if (isMintedCappedCrowdsale) {
        for (let tier_num = 0; tier_num < num_of_tiers; tier_num++) {
          const tier_data = await getCrowdsaleTier(registryStorageAddr, crowdsaleExecID, tier_num).call()
          const tier_dates = await getTierStartAndEndDates(registryStorageAddr, crowdsaleExecID, tier_num).call()

          if (tier_data.whitelist_enabled) {
            const { whitelist } = await getTierWhitelist(registryStorageAddr, crowdsaleExecID, tier_num).call()

            for (let whitelist_item_index = 0; whitelist_item_index < whitelist.length; whitelist_item_index++) {
              const whitelist_item_addr = whitelist[whitelist_item_index]
              const {
                max_spend_remaining,
                minimum_contribution
              } = await getWhitelistStatus(registryStorageAddr, crowdsaleExecID, tier_num, whitelist_item_addr).call()

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

        const { reserved_destinations } = await getReservedTokenDestinationList(registryStorageAddr, crowdsaleExecID).call()

        for (let destination_index = 0; destination_index < reserved_destinations.length; destination_index++) {
          const reserved_addr = reserved_destinations[destination_index]
          const {
            num_tokens,
            num_percent,
            percent_decimals
          } = await getReservedDestinationInfo(registryStorageAddr, crowdsaleExecID, reserved_addr).call()

          if (num_tokens > 0) {
            reserved_tokens_info.push({
              addr: reserved_addr,
              dim: "tokens",
              val: toBigNumber(num_tokens).times(`1e-${token.token_decimals}`).toFixed()
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

      } else if (isDutchAuction) {
        const tier_data = await getCrowdsaleStatus(registryStorageAddr, crowdsaleExecID).call()
        const tier_dates = await getCrowdsaleStartAndEndTimes(registryStorageAddr, crowdsaleExecID).call()
        const { num_whitelisted, whitelist } = await getCrowdsaleWhitelist(registryStorageAddr, crowdsaleExecID).call()

        if (num_whitelisted) {
          // TODO: remove this attribute overwrite after auth_os implement whitelist_enabled for Dutch Auction
          tier_data.whitelist_enabled = true

          for (let whitelist_item_index = 0; whitelist_item_index < whitelist.length; whitelist_item_index++) {
            const whitelist_item_addr = whitelist[whitelist_item_index]
            const {
              max_spend_remaining,
              minimum_contribution
            } = await getWhitelistStatus(registryStorageAddr, crowdsaleExecID, whitelist_item_addr).call()

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

      console.log('tiers:', tiers)

      tiers.forEach((tier, index) => processTier(tier, crowdsale, token, reserved_tokens_info, index))

      tierStore.setGlobalMinCap(toBigNumber(crowdsale.minimum_contribution).div(`1e${token.token_decimals}`).toFixed())

      await this.updateCrowdsaleStatus()

    } catch (err) {
      console.error(err)
    }

    this.hideLoader()
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
    const { updatable } = crowdsaleStore.selected
    const { globalMinCap } = tierStore

    // TODO: review validations after this fix: https://github.com/final-form/react-final-form/issues/151
    // once done, can be replaced with _pristine_ state value

    const updatableTiersMintedCappedCrowdsale = crowdsaleStore.selected.initialTiersValues.filter(tier => tier.updatable)
    const updatableTiers = crowdsaleStore.isMintedCappedCrowdsale ? updatableTiersMintedCappedCrowdsale : crowdsaleStore.isDutchAuction ? crowdsaleStore.selected.initialTiersValues : []
    const isValidTier = tierStore.individuallyValidTiers
    const validTiers = updatableTiers.every(tier => isValidTier[tier.index])
    const modifiedMinCap = globalMinCap !== '' ? !toBigNumber(this.state.initialGlobalMinCap).eq(globalMinCap) : false

    let fieldsToUpdate = []
    if (updatableTiers.length && validTiers) {
      fieldsToUpdate = getFieldsToUpdate(updatableTiers, tierStore.tiers)
    }

    let canSave = ownerCurrentUser && (tierStore.modifiedStoredWhitelist || fieldsToUpdate.length > 0 || modifiedMinCap) && !crowdsaleHasEnded && updatable

    const canSaveObj = {
      canSave,
      fieldsToUpdate,
      globalMinCap: modifiedMinCap ? globalMinCap : null
    }

    return canSaveObj
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
      }

      return newValue
    }
  })

  render () {
    const { canFinalize, ownerCurrentUser } = this.state
    const { crowdsaleStore } = this.props
    const { finalized } = crowdsaleStore.selected

    return (
      <section className="manage">

        <FinalizeCrowdsaleStep
          disabled={!ownerCurrentUser || finalized || !canFinalize}
          handleClick={this.finalizeCrowdsale}
        />

        <Form
          onSubmit={this.saveCrowdsale}
          mutators={{ ...arrayMutators }}
          decorators={[this.calculator]}
          initialValues={{
            tiers: this.initialTiers,
            minCap: this.state.initialGlobalMinCap
          }}
          component={ManageForm}
          canEditTiers={ownerCurrentUser && !canFinalize && !finalized}
          handleChange={this.updateTierStore}
          canSave={this.canBeSaved().canSave}
        />

        <Loader show={this.state.loading}/>

      </section>
    )
  }
}
