import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { isObservableArray } from 'mobx'
import { Link } from 'react-router-dom'
import { CONTRACT_TYPES, TEXT_FIELDS, TOAST, VALIDATION_MESSAGES, DESCRIPTION } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import '../../assets/stylesheets/application.css'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import {
  successfulFinalizeAlert,
  successfulDistributeAlert,
  successfulUpdateCrowdsaleAlert,
  warningOnFinalizeCrowdsale,
  notTheOwner
} from '../../utils/alerts'
import { getNetworkVersion, sendTXToContract, attachToContract, calculateGasLimit } from '../../utils/blockchainHelpers'
import { toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import { getTiers, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'

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
      canDistribute: false,
      shouldDistribute: false,
      ownerCurrentUser: true
    }
  }

  componentDidMount () {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }

  componentWillMount () {
    const { crowdsaleStore, contractStore, generalStore, match } = this.props
    const crowdsaleAddress = match.params.crowdsaleAddress

    crowdsaleStore.setSelectedProperty('address', crowdsaleAddress)

    // networkID
    getNetworkVersion().then(networkId => generalStore.setProperty('networkId', networkId))

    // contractType
    contractStore.setContractType(CONTRACT_TYPES.whitelistwithcap)

    getWhiteListWithCapCrowdsaleAssets().then(this.extractContractData)
  }

  componentWillUnmount () {
    const { tierStore, tokenStore, crowdsaleStore } = this.props
    tierStore.reset()
    tokenStore.reset()
    crowdsaleStore.reset()
  }

  checkOwner = () => {
    const { contractStore, web3Store } = this.props

    return attachToContract(contractStore.crowdsale.abi, contractStore.crowdsale.addr[0])
      .then(crowdsaleContract => {
        const whenOwner = crowdsaleContract.methods.owner().call()
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

  extractContractData = () => {
    const { contractStore, crowdsaleStore } = this.props

    getTiers(crowdsaleStore.selected.address)
      .then(joinedCrowdsales => {
        contractStore.setContractProperty('crowdsale', 'addr', joinedCrowdsales)

        if (!contractStore.crowdsale.addr) {
          this.hideLoader()
          return Promise.reject('no tiers addresses')
        }
      })
      .then(() => {
        return contractStore.crowdsale.addr.reduce((promise, addr, index) => {
          return promise.then(() => processTier(addr, index))
        }, Promise.resolve())
      })
      .then(this.updateCrowdsaleStatus)
      .catch(console.log)
      .then(this.hideLoader)
  }

  hideLoader = () => {
    this.setState({ loading: false })
  }

  showLoader = () => {
    this.setState({ loading: true })
  }

  updateCrowdsaleStatus = () => {
    return this.setCrowdsaleInfo()
      .then(this.shouldDistribute)
      .then(this.canDistribute)
      .then(this.canFinalize)
      .then(this.checkOwner)
  }

  setCrowdsaleInfo = () => {
    const { contractStore, crowdsaleStore } = this.props
    const lastCrowdsaleAddress = contractStore.crowdsale.addr.slice(-1)[0]

    return attachToContract(contractStore.crowdsale.abi, lastCrowdsaleAddress)
      .then(crowdsaleContract => crowdsaleContract.methods.endsAt().call())
      .then(crowdsaleEndTime => this.setState({ crowdsaleHasEnded: crowdsaleEndTime * 1000 <= Date.now() || crowdsaleStore.selected.finalized }))
  }

  shouldDistribute = () => {
    const { contractStore, match } = this.props

    return new Promise(resolve => {
      attachToContract(contractStore.crowdsale.abi, match.params.crowdsaleAddress)
      .then(crowdsaleContract => { // eslint-disable-line no-loop-func
        console.log('attach to crowdsale contract')

        if (!crowdsaleContract) return Promise.reject('No contract available')

        crowdsaleContract.methods.token().call()
        .then(tokenAddress => attachToContract(contractStore.token.abi, tokenAddress))
        .then(tokenContract => tokenContract.methods.reservedTokensDestinationsLen().call())
        .then((reservedTokensDestinationsLen) => {
          if (reservedTokensDestinationsLen > 0)
            this.setState({ shouldDistribute: true })
          else
            this.setState({ shouldDistribute: false })
          resolve(this.state.shouldDistribute)
        })
        .catch(() => {
          this.setState({ shouldDistribute: false })
          resolve(this.state.shouldDistribute)
        })
      })
    })
  }

  canDistribute = () => {
    const { contractStore, match } = this.props

    return new Promise(resolve => {
      attachToContract(contractStore.crowdsale.abi, match.params.crowdsaleAddress)
        .then(crowdsaleContract => { // eslint-disable-line no-loop-func
          console.log('attach to crowdsale contract')

          if (!crowdsaleContract) return Promise.reject('No contract available')

          crowdsaleContract.methods.canDistributeReservedTokens().call((err, canDistributeReservedTokens) => {
            return canDistributeReservedTokens
          }).then((canDistributeReservedTokens) => {
            console.log('#canDistributeReservedTokens:', canDistributeReservedTokens)
            this.setState({ canDistribute: canDistributeReservedTokens })
            resolve(this.state.canDistribute)
          })
          .catch(() => {
            this.setState({ canDistribute: false })
            resolve(this.state.canDistribute)
          })
        })
    })
  }

  canFinalize = () => {
    const { contractStore } = this.props
    const lastCrowdsaleAddress = contractStore.crowdsale.addr.slice(-1)[0]

    return attachToContract(contractStore.crowdsale.abi, lastCrowdsaleAddress)
      .then(crowdsaleContract => crowdsaleContract.methods.isCrowdsaleFull().call())
      .then(
        (isCrowdsaleFull) => {
          const { crowdsaleHasEnded, shouldDistribute, canDistribute } = this.state
          const wasDistributed = shouldDistribute && !canDistribute

          this.setState({
            canFinalize: (crowdsaleHasEnded || isCrowdsaleFull) && (wasDistributed || !shouldDistribute)
          })
        },
        () => this.setState({ canFinalize: false })
      )
  }

  distributeReservedTokens = (addressesPerBatch) => {
    this.updateCrowdsaleStatus()
      .then(() => {
        const { crowdsaleStore } = this.props

        if (!crowdsaleStore.selected.distributed && this.state.canDistribute) {
          this.showLoader()

          const { contractStore } = this.props
          const lastCrowdsaleAddress = contractStore.crowdsale.addr.slice(-1)[0]

          return attachToContract(contractStore.crowdsale.abi, lastCrowdsaleAddress)
            .then(crowdsaleContract => Promise.all([
              crowdsaleContract,
              crowdsaleContract.methods.token().call()
            ]))
            .then(([crowdsaleContract, token]) => {
              attachToContract(contractStore.token.abi, token)
                .then(tokenContract => {
                  tokenContract.methods.reservedTokensDestinationsLen().call()
                    .then(reservedTokensDestinationsLen => {

                      const batchesLen = Math.ceil(reservedTokensDestinationsLen / addressesPerBatch)
                      const distributeMethod = crowdsaleContract.methods.distributeReservedTokens(addressesPerBatch)

                      let opts = {
                        gasPrice: this.props.generalStore.gasPrice
                      }
                      let batches = Array.from(Array(batchesLen).keys())
                      this.distributeReservedTokensRecursive(batches, distributeMethod, opts)
                        .then(() => {
                          successfulDistributeAlert()
                          crowdsaleStore.setSelectedProperty('distributed', true)
                          return this.updateCrowdsaleStatus()
                        })
                        .catch((err) => {
                          console.log(err)
                          toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.DISTRIBUTE_FAIL })
                        })
                        .then(this.hideLoader)
                    })
                })
            })
        }
      })
      .catch(console.error)
  }

  distributeReservedTokensRecursive = (batches, distributeMethod, opts) => {
    return batches.reduce((promise) => {
      return promise
        .then(() => distributeMethod.estimateGas(opts)
          .then(estimatedGas => {
            opts.gasLimit = calculateGasLimit(estimatedGas)
            return sendTXToContract(distributeMethod.send(opts))
          })
        )
    }, Promise.resolve())
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

                let opts = {
                  gasPrice: this.props.generalStore.gasPrice
                }

                const { contractStore } = this.props
                const lastCrowdsaleAddress = contractStore.crowdsale.addr.slice(-1)[0]

                return attachToContract(contractStore.crowdsale.abi, lastCrowdsaleAddress)
                  .then(crowdsaleContract => crowdsaleContract.methods.finalize())
                  .then(finalizeMethod => Promise.all([finalizeMethod, finalizeMethod.estimateGas(opts)]))
                  .then(([finalizeMethod, estimatedGas]) => {
                    opts.gasLimit = calculateGasLimit(estimatedGas)
                    return sendTXToContract(finalizeMethod.send(opts))
                  })
                  .then(() => {
                    successfulFinalizeAlert()
                    crowdsaleStore.setSelectedProperty('finalized', true)
                    this.setState({ canFinalize: false })
                  })
                  .catch((err) => {
                    console.log(err)
                    toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.FINALIZE_FAIL })
                  })
                  .then(this.hideLoader)
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
        const updatableTiers = crowdsaleStore.selected.initialTiersValues.filter(tier => tier.updatable)
        const isValidTier = tierStore.individuallyValidTiers
        const validTiers = updatableTiers.every(tier => isValidTier[tier.index])

        if (!this.state.formPristine && !this.state.crowdsaleHasEnded && updatableTiers.length && validTiers) {
          const keys = Object
            .keys(updatableTiers[0])
            .filter(key => key !== 'index' && key !== 'updatable' && key !== 'addresses' && key !== 'whitelistElements')

          updatableTiers
            .reduce((toUpdate, tier) => {
              keys.forEach(key => {
                const { addresses } = tier
                let newValue = tierStore.tiers[tier.index][key]

                if (isObservableArray(newValue)) {
                  if (newValue.length > tier[key].length) {
                    newValue = newValue.slice(tier[key].length).filter(whitelist => !whitelist.deleted)
                    if (newValue.length) {
                      toUpdate.push({ key, newValue, addresses })
                    }
                  }

                } else if (newValue !== tier[key]) {
                  toUpdate.push({ key, newValue, addresses })
                }
              })
              return toUpdate
            }, [])
            .reduce((promise, { key, newValue, addresses }) => {
              return promise.then(() => updateTierAttribute(key, newValue, addresses))
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

  changeState = (event, parent, key, property) => {
    const { tierStore } = this.props
    const whitelistInputProps = { ...tierStore.tiers[key].whitelistInput }
    const prop = property.split('_')[1]
    whitelistInputProps[prop] = event.target.value
    tierStore.setTierProperty(whitelistInputProps, 'whitelistInput', key)
  }

  clickedWhiteListInputBlock = e => {
    if (e.target.classList.contains('button_fill_plus')) {
      this.setState({ formPristine: false })
    }
  }

  whitelistInputBlock = index => {
    return (
      <WhitelistInputBlock
        key={index.toString()}
        num={index}
        onChange={(e, contract, num, prop) => this.changeState(e, contract, num, prop)}
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
      <div className={'white-list-item-container'} key={item.addr}>
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
      <div onClick={this.clickedWhiteListInputBlock}>
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
    return initialTierValues ? Date.now() > new Date(initialTierValues.startTime).getTime() : true
  }

  tierHasEnded = (index) => {
    const initialTierValues = this.props.crowdsaleStore.selected.initialTiersValues[index]
    return initialTierValues && new Date(initialTierValues.endTime).getTime() <= Date.now()
  }

  render () {
    const { formPristine, canFinalize, shouldDistribute, canDistribute, crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { generalStore, tierStore, tokenStore, crowdsaleStore } = this.props
    const { address: crowdsaleAddress, finalized, updatable } = crowdsaleStore.selected
    let disabled = !ownerCurrentUser || canDistribute || canFinalize || finalized

    const distributeTokensStep = (
      <div className="steps-content container">
        <div className="about-step">
          <div className="swal2-icon swal2-info warning-logo">!</div>
          <p className="title">Distribute reserved tokens</p>
          <p className="description">Reserved tokens distribution is the last step of the crowdsale before finalization.
            You can make it after the end of the last tier or if hard cap is reached. If you reserved more then 100
            addresses for your crowdsale, the distribution will be executed in batches with 100 reserved addresses per
            batch. Amount of batches is equal to amount of transactions</p>
          <Link to='#' onClick={() => this.distributeReservedTokens(100)}>
            <span className={`button button_${!ownerCurrentUser || !canDistribute ? 'disabled' : 'fill'}`}>Distribute tokens</span>
          </Link>
        </div>
      </div>
    )

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
        <Link to={`/crowdsale/?addr=${crowdsaleAddress}&networkID=${generalStore.networkId}`}
              className="crowdsale-page-link"
        >Crowdsale page</Link>
      </div>
    )

    const saveButton = (
      <Link to='/2' onClick={e => this.saveCrowdsale(e)}>
        <span
          className={`no-arrow button button_${ownerCurrentUser && !formPristine && !crowdsaleHasEnded ? 'fill' : 'disabled'}`}>Save</span>
      </Link>
    )

    const tierNameAndWallet = (tier) => {
      return <div className='input-block-container'>
        <InputField
          side='left'
          type='text'
          title={CROWDSALE_SETUP_NAME}
          value={tier.name}
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
      disabled = disabled || !tier.updatable || this.tierHasEnded(index)

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
          disabled={disabled || this.tierHasStarted(index)}
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
          disabled={disabled}
        />
      </div>
    }

    const tierRateAndSupply = (tier, index) => {
      disabled = disabled || !tier.updatable || this.tierHasEnded(index) || this.tierHasStarted(index)

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
        {shouldDistribute ? distributeTokensStep : null}
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
            {!crowdsaleHasEnded && updatable ? saveButton : null}
          </div>
        </div>
        <Loader show={this.state.loading}/>
      </section>
    )
  }
}
