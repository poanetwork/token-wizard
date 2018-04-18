import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { TEXT_FIELDS, TOAST, VALIDATION_MESSAGES, DESCRIPTION } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import '../../assets/stylesheets/application.css'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
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
  methodToExec
} from '../../utils/blockchainHelpers'
import { toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { getFieldsToUpdate, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'
import { getTiers } from '../crowdsale/utils'
import { generateContext } from '../stepFour/utils'
import classNames from 'classnames'
import { toJS } from 'mobx'

const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME } = TEXT_FIELDS

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
  }

  componentDidMount () {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }

  componentWillMount () {
    const { crowdsaleStore, generalStore, match } = this.props
    const crowdsaleExecID = match.params.crowdsaleExecID
    console.log("crowdsaleExecID:", crowdsaleExecID)

    crowdsaleStore.setSelectedProperty('execID', crowdsaleExecID)

    // networkID
    getNetworkVersion().then(networkID => {
      generalStore.setProperty('networkID', networkID)
      getWhiteListWithCapCrowdsaleAssets(networkID)
        .then(_newState => {
          this.setState(_newState)
          this.extractContractsData()
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
    const { contractStore, web3Store } = this.props

    return attachToSpecificCrowdsaleContract("initCrowdsale")
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
    const { contractStore, match } = this.props
    contractStore.setContractProperty('crowdsale', 'execID', match.params.crowdsaleExecID)

    getTiers()
      .then(numOfTiers => {
        console.log("numOfTiers:", numOfTiers)
        getCurrentAccount()
          .then(account => {
            contractStore.setContractProperty('crowdsale', 'account', account)
            attachToSpecificCrowdsaleContract("initCrowdsale")
              .then((initCrowdsaleContract) => {
                console.log(initCrowdsaleContract)
                let registryStorageObj = toJS(contractStore.registryStorage)
                let whenCrowdsaleData = [];
                let whenCrowdsale = initCrowdsaleContract.methods.getCrowdsaleInfo(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                whenCrowdsaleData.push(initCrowdsaleContract)
                whenCrowdsaleData.push(whenCrowdsale)
                let whenToken = initCrowdsaleContract.methods.getTokenInfo(registryStorageObj.addr, contractStore.crowdsale.execID).call();
                whenCrowdsaleData.push(whenToken)
                for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                  let whenTierData = initCrowdsaleContract.methods.getCrowdsaleTier(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call();
                  let whenTierDates = initCrowdsaleContract.methods.getTierStartAndEndDates(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call();
                  whenCrowdsaleData.push(whenTierData);
                  whenCrowdsaleData.push(whenTierDates);
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
                for (let tierNum = 0; tierNum < numOfTiers; tierNum++) {
                  if (tiers[tierNum].whitelist_enabled) {
                    let whenTierWhitelist = initCrowdsaleContract.methods.getTierWhitelist(registryStorageObj.addr, contractStore.crowdsale.execID, tierNum).call()
                    whenWhiteListsData.push(whenTierWhitelist);
                  } else {
                    whenWhiteListsData.push(null);
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

    return attachToSpecificCrowdsaleContract("initCrowdsale")
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
    const { contractStore } = this.props

    return attachToSpecificCrowdsaleContract("initCrowdsale")
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
                    let paramsToExec = [methodInterface]
                    const method = methodToExec(`finalizeCrowdsale(${methodInterface.join(',')})`, "crowdsaleConsole", this.getFinalizeCrowdsaleParams, paramsToExec)

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

  saveCrowdsale = e => {
    this.showLoader()

    e.preventDefault()
    e.stopPropagation()

    this.updateCrowdsaleStatus()
      .then(() => {
        const { crowdsaleStore, tierStore } = this.props
        const { formPristine, crowdsaleHasEnded } = this.state
        const updatableTiers = crowdsaleStore.selected.initialTiersValues.filter(tier => tier.updatable)
        const isValidTier = tierStore.individuallyValidTiers
        const validTiers = updatableTiers.every(tier => isValidTier[tier.index])

        if ((!formPristine || tierStore.modifiedStoredWhitelist) && !crowdsaleHasEnded && updatableTiers.length && validTiers) {
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

  whitelistInputBlock = index => {
    const { tokenStore } = this.props
    return (
      <WhitelistInputBlock
        key={index.toString()}
        num={index}
        decimals={tokenStore.decimals}
      />
    )
  }

  readOnlyWhitelistedAddresses = tier => {
    if (!tier.whitelist.length) {
      return (
        <div className="white-list-item-container">
          <div className="white-list-item-container-inner">
            <span className="white-list-item white-list-item-left">no addresses loaded</span>
          </div>
        </div>
      )
    }

    return tier.whitelist.map(item => (
      <div className={'white-list-item-container no-style'} key={item.addr}>
        <div className="white-list-item-container-inner">
          <span className="white-list-item white-list-item-left">{item.addr}</span>
          <span className="white-list-item white-list-item-middle">{item.min}</span>
          <span className="white-list-item white-list-item-right">{item.max}</span>
        </div>
      </div>
    ))
  }

  renderWhitelistInputBlock = (tier, index) => {
    const { crowdsaleStore, tierStore } = this.props

    if (tierStore.tiers[0].whitelistEnabled !== 'yes') {
      return null
    }

    return (
      <div>
        <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        {tier.updatable && !crowdsaleStore.selected.finalized && !this.tierHasEnded(index) && this.state.ownerCurrentUser
          ? this.whitelistInputBlock(index)
          : this.readOnlyWhitelistedAddresses(tier)
        }
      </div>
    )
  }

  updateTierStore = (event, property, index) => {
    const { tierStore } = this.props
    const value = event.target.value

    tierStore.setTierProperty(value, property, index)

    if (property === 'endTime' || property === 'startTime') {
      tierStore.validateEditedTier(property, index)
    } else {
      tierStore.validateTiers(property, index)
    }

    if (this.state.formPristine) {
      this.setState({ formPristine: false })
    }
  }

  tierHasStarted = (index) => {
    const initialTierValues = this.props.crowdsaleStore.selected.initialTiersValues[index]
    return initialTierValues && new Date(initialTierValues.startTime).getTime() < Date.now()
  }

  tierHasEnded = (index) => {
    const initialTierValues = this.props.crowdsaleStore.selected.initialTiersValues[index]
    return initialTierValues && new Date(initialTierValues.endTime).getTime() <= Date.now()
  }

  render () {
    const { formPristine, canFinalize, crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { generalStore, tierStore, tokenStore, crowdsaleStore } = this.props
    const { finalized, updatable, execID } = crowdsaleStore.selected

    const canEditTier = ownerCurrentUser && !canFinalize && !finalized

    const aboutStep = (
      <div className="about-step">
        <div className="swal2-icon swal2-info warning-logo">!</div>
        <p className="title">Finalize Crowdsale</p>
        <p className="description">Finalize - Finalization is the last step of the crowdsale.
          You can make it only after the end of the last tier. After finalization, it's not possible to update tiers,
          buy tokens. All tokens will be movable, reserved tokens will be issued.</p>
        <Link to='#' onClick={() => this.finalizeCrowdsale()}>
          <span className={`button button_${!ownerCurrentUser || finalized || !canFinalize ? 'disabled' : 'fill'}`}>Finalize Crowdsale</span>
        </Link>
      </div>
    )

    const aboutTier = (
      <div className="about-step">
        <div className="step-icons step-icons_crowdsale-setup"/>
        <p className="title">{tokenStore.name} ({tokenStore.ticker}) Settings</p>
        <p className="description">The most important and exciting part of the crowdsale process. Here you can define
          parameters of your crowdsale campaign.</p>
        <Link to={`/crowdsale/?exec-id=${execID}&networkID=${generalStore.networkID}`}
              className="crowdsale-page-link"
        >Crowdsale page</Link>
      </div>
    )

    const saveButton = () => {
      let buttonStyle = 'button_disabled'

      if (ownerCurrentUser && (!formPristine || tierStore.modifiedStoredWhitelist) && !crowdsaleHasEnded) {
        buttonStyle = 'button_fill'
      }

      return (
        <Link to='/2' onClick={e => this.saveCrowdsale(e)}>
          <span
            className={classNames('no-arrow', 'button', buttonStyle)}>Save</span>
        </Link>
      )
    }

    const tierNameAndWallet = (tier) => {
      return <div className='input-block-container'>
        <InputField
          side='left'
          type='text'
          title={CROWDSALE_SETUP_NAME}
          value={tier.tier}
          disabled={true}
        />
        <InputField
          side='right'
          type='text'
          title={WALLET_ADDRESS}
          value={tier.walletAddress}
          disabled={true}
        />
      </div>
    }

    const tierStartAndEndTime = (tier, index) => {
      const disabledStartDate = true
      const disabledEndDate = !canEditTier || !tier.updatable || this.tierHasEnded(index)

      return <div className='input-block-container'>
        <InputField
          side='left'
          type='datetime-local'
          title={START_TIME}
          value={tier.startTime}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].startTime}
          errorMessage={VALIDATION_MESSAGES.EDITED_START_TIME}
          onChange={e => this.updateTierStore(e, 'startTime', index)}
          description={DESCRIPTION.START_TIME}
          disabled={disabledStartDate}
        />
        <InputField
          side='right'
          type='datetime-local'
          title={END_TIME}
          value={tier.endTime}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].endTime}
          errorMessage={VALIDATION_MESSAGES.EDITED_END_TIME}
          onChange={e => this.updateTierStore(e, 'endTime', index)}
          description={DESCRIPTION.END_TIME}
          disabled={disabledEndDate}
        />
      </div>
    }

    const tierRateAndSupply = (tier, index) => {
      const disabled = true //!canEditTier || !tier.updatable || this.tierHasEnded(index) || this.tierHasStarted(index)

      return <div className='input-block-container'>
        <InputField
          side='left'
          type='number'
          title={RATE}
          value={tier.rate}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].rate}
          errorMessage={VALIDATION_MESSAGES.RATE}
          onChange={e => this.updateTierStore(e, 'rate', index)}
          description={DESCRIPTION.RATE}
          disabled={disabled}
        />
        <InputField
          side='right'
          type='number'
          title={SUPPLY}
          value={tier.supply}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].supply}
          errorMessage={VALIDATION_MESSAGES.SUPPLY}
          onChange={e => this.updateTierStore(e, 'supply', index)}
          description={DESCRIPTION.SUPPLY}
          disabled={disabled}
        />
      </div>
    }

    return (
      <section className="manage">
        <div className="steps-content container">
          {aboutStep}
        </div>
        {tierStore.tiers.map((tier, index) => (
          <div className="steps" key={index.toString()}>
            <div className="steps-content container">
              {index === 0 ? aboutTier : null}
              <div className={`hidden ${tierStore.tiers[0].whitelistEnabled === 'yes' ? 'divisor' : ''}`}>
                {tierNameAndWallet(tier)}
                {tierStartAndEndTime(tier, index)}
                {tierRateAndSupply(tier, index)}
              </div>
              {this.renderWhitelistInputBlock(tier, index)}
            </div>
          </div>
        ))}
        <div className="steps">
          <div className="button-container">
            {!crowdsaleHasEnded && updatable ? saveButton() : null}
          </div>
        </div>
        <Loader show={this.state.loading}/>
      </section>
    )
  }
}
