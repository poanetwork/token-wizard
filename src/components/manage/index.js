import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { CONTRACT_TYPES, TEXT_FIELDS, TOAST, VALIDATION_MESSAGES } from '../../utils/constants'
import { InputField } from '../Common/InputField'
import '../../assets/stylesheets/application.css'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { successfulFinalizeAlert, successfulUpdateCrowdsaleAlert, warningOnFinalizeCrowdsale } from '../../utils/alerts'
import { getNetworkVersion, sendTXToContract } from '../../utils/blockchainHelpers'
import { getWhiteListWithCapCrowdsaleAssets, toast } from '../../utils/utils'
import { findCurrentContractRecursively, getCurrentRate } from '../crowdsale/utils'
import { getTiers, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'

const { START_TIME, END_TIME, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME } = TEXT_FIELDS

@inject('crowdsaleStore', 'web3Store', 'tierStore', 'contractStore', 'crowdsalePageStore', 'generalStore', 'tokenStore')

@observer
export class Manage extends Component {
  constructor (props) {
    super(props)
    window.scrollTo(0, 0)
    this.state = {
      formPristine: true,
      loading: true
    }
  }

  componentWillMount () {
    const { crowdsaleStore, web3Store, contractStore, generalStore, match } = this.props
    const crowdsaleAddress = match.params.crowdsaleAddress

    crowdsaleStore.setSelectedProperty('address', crowdsaleAddress)

    // networkID
    getNetworkVersion(web3Store.web3).then(networkId => generalStore.setProperty('networkId', networkId))

    // contractType
    contractStore.setContractType(CONTRACT_TYPES.whitelistwithcap)

    getWhiteListWithCapCrowdsaleAssets().then(this.extractContractData)
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
      .catch(console.log)
      .then(this.hideLoader)
  }

  hideLoader = () => {
    this.setState({ loading: false })
  }

  showLoader = () => {
    this.setState({ loading: true })
  }

  isLastContract = crowdsaleContract => {
    const { contractStore } = this.props
    const crowdsalesAddresses = contractStore.crowdsale.addr
    return crowdsalesAddresses[crowdsalesAddresses.length - 1] === crowdsaleContract._address
  }

  finalizeCrowdsale = () => {
    const { crowdsaleStore, web3Store } = this.props
    const { web3 } = web3Store

    if (!crowdsaleStore.selected.finalized) {
      warningOnFinalizeCrowdsale()
        .then(result => {
          if (result.value) {
            findCurrentContractRecursively(0, this, web3, null, crowdsaleContract => {
              this.showLoader()

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
                    crowdsaleStore.setSelectedProperty('finalized', true)
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
    this.showLoader()

    e.preventDefault()
    e.stopPropagation()

    if (!this.state.formPristine) {
      const { crowdsaleStore, tierStore } = this.props
      const updatableTiers = crowdsaleStore.selected.initialTiersValues.filter(tier => tier.updatable)

      if (updatableTiers.length) {
        const isValidTier = tierStore.individuallyValidTiers
        console.log(isValidTier)

        const validTiers = updatableTiers.every(tier => isValidTier[tier.index])

        if (validTiers) {
          const keys = Object.keys(updatableTiers[0])
            .filter(key => key !== 'index' && key !== 'updatable' && key !== 'addresses')

          const attributesToUpdate = updatableTiers.reduce((toUpdate, tier) => {
            keys.forEach(key => {
              const newValue = tierStore.tiers[tier.index][key]
              const { addresses } = tier

              if (newValue !== tier[key]) {
                toUpdate.push({ key, newValue, addresses })
              }
            })

            return toUpdate
          }, [])

          this.showLoader()

          attributesToUpdate.reduce((promise, { key, newValue, addresses }) => {
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
      } else {
        this.hideLoader()
      }
    } else {
      this.hideLoader()
    }
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

    if (tierStore.tiers[0].whitelistdisabled === 'yes') {
      return null
    }

    return (
      <div onClick={this.clickedWhiteListInputBlock}>
        <div className="section-title">
          <p className="title">Whitelist</p>
        </div>
        {tier.updatable && !crowdsaleStore.selected.finalized
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

  render () {
    const { formPristine } = this.state
    const { generalStore, tierStore, tokenStore, crowdsaleStore } = this.props
    const { address: crowdsaleAddress, finalized, updatable } = crowdsaleStore.selected

    const aboutStep = (
      <div className="about-step">
        <div className="swal2-icon swal2-info warning-logo">!</div>
        <p className="title">Finalize Crowdsale</p>
        <p className="description">Finalize - Finalization is the last step of the crowdsale.
          You can make it only after the end of the last tier. After finalization, it's not possible to update
          tiers, buy tokens. All tokens will be movable, reserved tokens will be issued.</p>
        <Link to='#' onClick={() => this.finalizeCrowdsale()}>
          <span className={`button button_${finalized ? 'disabled' : 'fill'}`}>Finalize Crowdsale</span>
        </Link>
      </div>
    )

    const aboutTier = (
      <div className="about-step">
        <div className="step-icons step-icons_crowdsale-setup"/>
        <p className="title">{tokenStore.name} ({tokenStore.ticker}) Settings</p>
        <p className="description">The most important and exciting part of the crowdsale
          process. Here you can define parameters of your crowdsale campaign.</p>
        <Link to={`/crowdsale/?addr=${crowdsaleAddress}&networkID=${generalStore.networkId}`}
              className="crowdsale-page-link"
        >Crowdsale page</Link>
      </div>
    )

    const saveButton = (
      <Link to='/2' onClick={e => this.saveCrowdsale(e)}>
        <span className={`no-arrow button button_${!formPristine ? 'fill' : 'disabled'}`}>Save</span>
      </Link>
    )

    const tierNameAndWallet = (tier) => {
      return <div className='input-block-container'>
        <InputField
          side='left'
          type='text'
          title={CROWDSALE_SETUP_NAME}
          value={tier.name}
          disabled
        />
        <InputField
          side='right'
          type='text'
          title={WALLET_ADDRESS}
          value={tier.walletAddress}
          disabled
        />
      </div>
    }

    const tierStartAndEndTime = (tier, index) => {
      return <div className='input-block-container'>
        <InputField
          side='left'
          type='datetime-local'
          title={START_TIME}
          value={tier.startTime}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].startTime}
          errorMessage={VALIDATION_MESSAGES.EDITED_START_TIME}
          onChange={(e) => this.updateTierStore(e, 'startTime', index)}
          description="Date and time when the tier starts. Can't be in the past from the current moment."
          disabled={!tier.updatable || finalized}
        />
        <InputField
          side='right'
          type='datetime-local'
          title={END_TIME}
          value={tier.endTime}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].endTime}
          errorMessage={VALIDATION_MESSAGES.EDITED_END_TIME}
          onChange={(e) => this.updateTierStore(e, 'endTime', index)}
          description="Date and time when the tier ends. Can be only in the future."
          disabled={!tier.updatable || finalized}
        />
      </div>
    }

    const tierRateAndSupply = (tier, index) => {
      return <div className='input-block-container'>
        <InputField
          side='left'
          type='number'
          title={RATE}
          value={tier.rate}
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].rate}
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
          valid={tierStore.validTiers[index] && tierStore.validTiers[index].supply}
          errorMessage={VALIDATION_MESSAGES.SUPPLY}
          onChange={(e) => this.updateTierStore(e, 'supply', index)}
          description="How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers"
          disabled={!tier.updatable || finalized}
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
              <div className={`hidden ${tierStore.tiers[0].whitelistdisabled !== 'yes' ? 'divisor' : ''}`}>
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
            {!finalized && updatable ? saveButton : null}
          </div>
        </div>
        <Loader show={this.state.loading}/>
      </section>
    )
  }
}
