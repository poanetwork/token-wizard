import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { CONTRACT_TYPES, TEXT_FIELDS, TOAST, VALIDATION_MESSAGES, VALIDATION_TYPES } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import '../../assets/stylesheets/application.css'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { successfulFinalizeAlert, warningOnFinalizeCrowdsale } from '../../utils/alerts'
import { getNetworkVersion, sendTXToContract } from '../../utils/blockchainHelpers'
import { getWhiteListWithCapCrowdsaleAssets, toast, toFixed } from '../../utils/utils'
import { findCurrentContractRecursively, getCurrentRate, getJoinedTiers } from '../crowdsale/utils'
import { crowdsaleData, pricingStrategyData, tokenData } from './utils'
import { Loader } from '../Common/Loader'

const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME } = TEXT_FIELDS
const { VALID } = VALIDATION_TYPES

@inject('crowdsaleStore', 'web3Store', 'tierStore', 'contractStore', 'crowdsalePageStore', 'generalStore', 'tokenStore')
@observer
export class Manage extends Component {
  constructor (props) {
    super(props)
    window.scrollTo(0, 0)
    this.state = {
      crowdsale: undefined,
      finalized: false,
      formPristine: true,
      loading: true,
      cosas: undefined
    }
  }

  componentWillMount () {
    const { crowdsaleStore, web3Store, contractStore, generalStore, match } = this.props
    const { web3 } = web3Store
    const crowdsale = crowdsaleStore.crowdsales.find(crowdsale => crowdsale === match.params.addr)

    this.setState({ crowdsale })

    // networkID
    getNetworkVersion(web3)
      .then(networkId => generalStore.setProperty('networkId', networkId))

    // contract
    contractStore.setContractType(CONTRACT_TYPES.whitelistwithcap)

    getWhiteListWithCapCrowdsaleAssets()
      .then(this.extractContractsData)
  }

  extractContractsData = () => {
    const { contractStore, web3Store, tierStore, tokenStore, crowdsaleStore } = this.props
    const { crowdsale } = this.state
    const { web3 } = web3Store

    getJoinedTiers(web3, contractStore.crowdsale.abi, crowdsale, [], joinedCrowdsales => {
      contractStore.setContractProperty('crowdsale', 'addr', joinedCrowdsales)

      web3.eth.getAccounts().then(accounts => {
        if (!accounts || !contractStore.crowdsale.addr) {
          this.hideLoader()
          return
        }

        const contracts = contractStore.crowdsale.addr.map((crowdsaleAddress, crowdsaleNum) => {
          const newTier = {
            whitelist: [],
            whitelistElements: [],
            whitelistInput: {
              addr: '',
              min: '',
              max: ''
            }
          }

          return crowdsaleData(crowdsaleAddress)
            .then(([token, walletAddress, startsAt, endsAt, updatable, maximumSellableTokens, pricingStrategy, isFinalized]) => {
              this.setState({ finalized: isFinalized })

              newTier.walletAddress = walletAddress
              newTier.startTime = this.formatDate(startsAt)
              newTier.endTime = this.formatDate(endsAt)
              newTier.updatable = updatable

              return Promise.all([pricingStrategy, maximumSellableTokens, tokenData(token)])
            })
            .then(([pricingStrategy, maximumSellableTokens, [tokenName, tokenSymbol, decimals]]) => {
              tokenStore.setProperty('name', tokenName)
              tokenStore.setProperty('ticker', tokenSymbol)

              //total supply: tiers, standard
              const tokenDecimals = !isNaN(decimals) ? decimals : 0
              const maxCapBeforeDecimals = parseInt(toFixed(maximumSellableTokens), 10) / 10 ** tokenDecimals
              const tierCap = maxCapBeforeDecimals ? maxCapBeforeDecimals.toString() : 0
              const standardCrowdsaleSupply = !isNaN(crowdsaleStore.supply) ? (crowdsaleStore.supply).toString() : 0

              newTier.supply = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? tierCap : standardCrowdsaleSupply

              return pricingStrategyData(pricingStrategy)
            })
            .then(rate => {
              //price: tiers, standard
              const tokensPerETHStandard = !isNaN(rate) ? rate : 0
              const tokensPerETHTiers = !isNaN(1 / rate) ? 1 / web3.utils.fromWei(toFixed(rate).toString(), 'ether') : 0
              const tokensPerETH = (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) ? tokensPerETHTiers : tokensPerETHStandard

              const newTierValidations = {
                tier: VALID,
                walletAddress: VALID,
                rate: VALID,
                supply: VALID,
                startTime: VALID,
                endTime: VALID,
                updatable: VALID
              }

              newTier.rate = tokensPerETH

              if (crowdsaleNum === 0) {
                tierStore.emptyList()
                tierStore.emptyTierValidationsList()
              }

              tierStore.addTier(newTier)
              tierStore.addTierValidations(newTierValidations)
            })
        })

        Promise.all(contracts)
          .catch(console.log)
          .then(this.hideLoader)
      })
    })
  }

  hideLoader = () => {
    this.setState({ loading: false })
  }

  isLastContract = crowdsaleContract => {
    const { contractStore } = this.props
    const crowdsalesAddresses = contractStore.crowdsale.addr
    return crowdsalesAddresses[crowdsalesAddresses.length - 1] === crowdsaleContract._address
  }

  finalizeCrowdsale = () => {
    if (!this.state.finalized) {
      warningOnFinalizeCrowdsale()
        .then(result => {
          if (result.value) {
            const { web3 } = this.props.web3Store

            findCurrentContractRecursively(0, this, web3, null, crowdsaleContract => {
              if (!crowdsaleContract) {
                this.hideLoader()
                return
              }

              this.setState({ loading: true })

              if (!this.isLastContract(crowdsaleContract)) {
                this.hideLoader()
                toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.FINALIZE_FAIL })

              } else {
                const finalizeMethod = crowdsaleContract.methods.finalize().send({
                  gasLimit: 650000,
                  gasPrice: this.props.generalStore.gasPrice
                })

                getCurrentRate(web3, crowdsaleContract)
                  .then(() => sendTXToContract(web3, finalizeMethod))
                  .then(() => {
                    successfulFinalizeAlert()
                    this.setState({ finalized: true })
                  })
                  .catch(err => toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.FINALIZE_FAIL }))
                  .then(this.hideLoader)
              }
            })

          }
        })
    }
  }

  saveCrowdsale = e => {
    e.preventDefault()
    e.stopPropagation()

    if (!this.state.formPristine) {
      console.log('continue with saving...')
      return
    }

    console.log('nothing to save...')
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

  readOnlyWhitelistedAddresses = tier => {
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
    const whitelistInputBlock = (
      <WhitelistInputBlock
        key={index.toString()}
        num={index}
        onChange={(e, contract, num, prop) => this.changeState(e, contract, num, prop)}
      />
    )

    return (
      <div onClick={this.clickedWhiteListInputBlock}>
        <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        {tier.updatable && !this.state.finalized ? whitelistInputBlock : this.readOnlyWhitelistedAddresses(tier)}
      </div>
    )
  }

  render () {
    const warningLogo = {
      color: '#642F9C',
      'border-color': '#642F9C',
      position: 'absolute',
      left: 0,
      top: 0
    }

    const stepContainer = {
      'margin-top': '30px'
    }

    const sectionContainer = {
      'min-height': '600px'
    }

    const description = {
      'margin-bottom': '20px'
    }

    const crowdsalePageLink = {
      color: '#08b3f2',
      'text-decoration': 'none',
      'font-size': '13px'
    }

    const divisor = {
      'margin-bottom': '30px',
      'border-bottom': '1px solid #eee'
    }

    const noArrow = {
      'background-image': 'none',
      padding: '0 15px'
    }

    const { crowdsale, finalized, formPristine } = this.state
    const { generalStore, tierStore, tokenStore } = this.props

    const aboutBlock = (
      <div className="about-step">
        <div className="step-icons step-icons_crowdsale-setup"/>
        <p className="title">{tokenStore.name} ({tokenStore.ticker}) Settings</p>
        <p className="description" style={description}>The most important and exciting part of the crowdsale
          process. Here you can define parameters of your crowdsale campaign.</p>
        <Link to={`/crowdsale/?addr=${crowdsale}&networkID=${generalStore.networkId}`}
              style={crowdsalePageLink}
        >Crowdsale page</Link>
      </div>
    )

    const saveButton = !finalized
      ? (
        <div className="steps">
          <div className="button-container">
            <Link to='/2' onClick={e => this.saveCrowdsale(e)}>
              <span className={`button button_${!formPristine ? 'fill' : 'disabled'}`} style={noArrow}>Save</span>
            </Link>
          </div>
        </div>
      )
      : null

    return (
      <section style={sectionContainer}>
        <div className="steps-content container" style={stepContainer}>
          <div className="about-step">
            <div className="swal2-icon swal2-info" style={warningLogo}>!</div>
            <p className="title">Finalize Crowdsale</p>
            <p className="description" style={description}>Finalize - Finalization is the last step of the crowdsale.
              You can make it only after the end of the last tier. After finalization, it's not possible to update
              tiers, buy tokens. All tokens will be movable, reserved tokens will be issued.</p>
            <Link to='#' onClick={() => this.finalizeCrowdsale()}>
              <span className={`button button_${finalized ? 'disabled' : 'fill'}`}>Finalize Crowdsale</span>
            </Link>
          </div>
        </div>
        {tierStore.tiers.map((tier, index) => (
          <div className="steps" key={index.toString()}>
            <div className="steps-content container" style={stepContainer}>
              {index === 0 ? aboutBlock : null}
              <div className="hidden" style={divisor}>
                <div className='input-block-container'>
                  <InputField
                    side='left'
                    type='text'
                    title={CROWDSALE_SETUP_NAME}
                    value={tier.name}
                    // valid={crowdsale.validTiers[0].tier}
                    errorMessage={VALIDATION_MESSAGES.TIER}
                    onChange={(e) => this.updateTierStore(e, 'tier', index)}
                    description="Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We
                     simplified that and will increment a number after each tier."
                    disabled
                  />
                  <InputField
                    side='right'
                    type='text'
                    title={WALLET_ADDRESS}
                    value={tier.walletAddress}
                    onChange={(e) => this.updateTierStore(e, 'walletAddress', index)}
                    description="Where the money goes after investors transactions. Immediately after each transaction.
                     We recommend to setup a multisig wallet with hardware based signers."
                    disabled
                  />
                </div>
                <div className='input-block-container'>
                  <InputField
                    side='left'
                    type='datetime-local'
                    title={START_TIME}
                    value={tier.startTime}
                    // valid={crowdsale.validTiers[0].startTime}
                    errorMessage={VALIDATION_MESSAGES.START_TIME}
                    onChange={(e) => this.updateTierStore(e, 'startTime', index)}
                    description="Date and time when the tier starts. Can't be in the past from the current moment."
                    disabled={!tier.updatable || finalized}
                  />
                  <InputField
                    side='right'
                    type='datetime-local'
                    title={END_TIME}
                    value={tier.endTime}
                    // valid={crowdsale.validTiers[0].endTime}
                    errorMessage={VALIDATION_MESSAGES.END_TIME}
                    onChange={(e) => this.updateTierStore(e, 'endTime', index)}
                    description="Date and time when the tier ends. Can be only in the future."
                    disabled={!tier.updatable || finalized}
                  />
                </div>
                <div className='input-block-container'>
                  <InputField
                    side='left'
                    type='number'
                    title={RATE}
                    value={tier.rate}
                    // valid={crowdsale.validTiers[0].rate}
                    errorMessage={VALIDATION_MESSAGES.RATE}
                    onChange={(e) => this.updateTierStore(e, 'rate', index)}
                    description="Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens"
                    disabled={!tier.updatable || finalized}
                  />
                  <InputField
                    side='right'
                    type='number'
                    title={SUPPLY}
                    value={tier.supply}
                    // valid={crowdsale.validTiers[0].supply}
                    errorMessage={VALIDATION_MESSAGES.SUPPLY}
                    onChange={(e) => this.updateTierStore(e, 'supply', index)}
                    description="How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of
                     all tiers"
                    disabled={!tier.updatable || finalized}
                  />
                </div>
              </div>
              {this.renderWhitelistInputBlock(tier, index)}
            </div>
          </div>
        ))}
        {saveButton}
        <Loader show={this.state.loading}/>
      </section>
    )
  }
}
