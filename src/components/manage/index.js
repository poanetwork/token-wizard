import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { TOAST, VALIDATION_TYPES } from '../../utils/constants'
import '../../assets/stylesheets/application.css'
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
import { getFieldsToUpdate, getTiers, processTier, updateTierAttribute } from './utils'
import { Loader } from '../Common/Loader'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { AboutCrowdsale } from './AboutCrowdsale'
import { FinalizeCrowdsaleStep } from './FinalizeCrowdsaleStep'
import { DistributeTokensStep } from './DistributeTokensStep'
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
      canDistribute: false,
      shouldDistribute: false,
      ownerCurrentUser: false
    }

    this.initialTiers = []
  }

  componentDidMount () {
    setTimeout(() => window.scrollTo(0, 0), 500)
  }

  componentWillMount () {
    const { crowdsaleStore, generalStore, match, tierStore } = this.props
    const crowdsaleAddress = match.params.crowdsaleAddress

    crowdsaleStore.setSelectedProperty('address', crowdsaleAddress)

    // networkID
    getNetworkVersion().then(networkId => generalStore.setProperty('networkId', networkId))

    getWhiteListWithCapCrowdsaleAssets()
      .then(this.extractContractData)
      .then(() => {
        this.initialTiers = JSON.parse(JSON.stringify(tierStore.tiers))
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

    return getTiers(crowdsaleStore.selected.address)
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
      .then(crowdsaleContract => {
        const whenIsFinalized = crowdsaleContract.methods.finalized().call()
        const whenIsCrowdsaleFull = crowdsaleContract.methods.isCrowdsaleFull().call()

        return Promise.all([whenIsFinalized, whenIsCrowdsaleFull])
      })
      .then(
        ([isFinalized, isCrowdsaleFull]) => {
          if (isFinalized) {
            this.setState({ canFinalize: false })
          } else {
            const { crowdsaleHasEnded, shouldDistribute, canDistribute } = this.state
            const wasDistributed = shouldDistribute && !canDistribute

            this.setState({
              canFinalize: (crowdsaleHasEnded || isCrowdsaleFull) && (wasDistributed || !shouldDistribute)
            })
          }
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
    const { canFinalize, shouldDistribute, canDistribute, crowdsaleHasEnded, ownerCurrentUser } = this.state
    const { generalStore, tierStore, tokenStore, crowdsaleStore } = this.props
    const { address, finalized, updatable } = crowdsaleStore.selected

    return (
      <section className="manage">
        {shouldDistribute ? (
          <DistributeTokensStep
            owner={ownerCurrentUser}
            disabled={!ownerCurrentUser || !canDistribute}
            handleClick={this.distributeReservedTokens}
          />
        ) : null}

        <FinalizeCrowdsaleStep
          disabled={!ownerCurrentUser || finalized || !canFinalize}
          handleClick={this.finalizeCrowdsale}
        />

        <Form
          onSubmit={this.saveCrowdsale}
          mutators={{ ...arrayMutators }}
          initialValues={{ tiers: this.initialTiers, }}
          component={ManageForm}
          canEditTiers={ownerCurrentUser && !canDistribute && !canFinalize && !finalized}
          decimals={tokenStore.decimals}
          aboutTier={
            <AboutCrowdsale
              name={tokenStore.name}
              ticker={tokenStore.ticker}
              address={address}
              networkId={generalStore.networkId}
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
