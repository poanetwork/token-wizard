import React from 'react'
import ReactCountdownClock from 'react-countdown-clock'
import { checkNetWorkByID, checkTxMined, sendTXToContract } from '../../utils/blockchainHelpers'
import {
  findCurrentContractRecursively,
  getAccumulativeCrowdsaleData,
  getContractStoreProperty,
  getCrowdsaleData,
  getCrowdsaleTargetDates,
  getCurrentRate,
  getJoinedTiers,
  initializeAccumulativeData
} from '../crowdsale/utils'
import { countDecimalPlaces, getQueryVariable, toast } from '../../utils/utils'
import { getWhiteListWithCapCrowdsaleAssets } from '../../stores/utils'
import {
  invalidCrowdsaleAddrAlert,
  investmentDisabledAlertInTime, noGasPriceAvailable,
  noMetaMaskAlert,
  successfulInvestmentAlert
} from '../../utils/alerts'
import { Loader } from '../Common/Loader'
import { CrowdsaleConfig } from '../Common/config'
import { CONTRACT_TYPES, INVESTMENT_OPTIONS, TOAST } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import QRPaymentProcess from './QRPaymentProcess'
import classNames from 'classnames'

@inject('contractStore', 'crowdsalePageStore', 'web3Store', 'tierStore', 'tokenStore', 'generalStore', 'investStore', 'gasPriceStore', 'generalStore')
@observer
export class Invest extends React.Component {
  constructor(props) {
    super(props)
    window.scrollTo(0, 0)

    this.state = {
      seconds: 0,
      loading: true,
      pristineTokenInput: true,
      web3Available: false,
      investThrough: INVESTMENT_OPTIONS.QR,
      crowdsaleAddress: CrowdsaleConfig.crowdsaleContractURL || getQueryVariable('addr')
    }
  }

  componentDidMount () {
    const { web3Store, contractStore, gasPriceStore, generalStore } = this.props
    const { web3 } = web3Store

    if (!web3) {
      this.setState({ loading: false })
      return
    }

    const networkID = CrowdsaleConfig.networkID ? CrowdsaleConfig.networkID : getQueryVariable('networkID')
    const contractType = CONTRACT_TYPES.whitelistwithcap
    checkNetWorkByID(networkID)
    contractStore.setContractType(contractType)

    const timeInterval = setInterval(() => this.setState({ seconds: this.state.seconds - 1 }), 1000)
    this.setState({
      timeInterval,
      web3Available: true,
      investThrough: INVESTMENT_OPTIONS.METAMASK
    })

    getWhiteListWithCapCrowdsaleAssets()
      .then(_newState => {
        this.setState(_newState)
        this.extractContractsData()
        gasPriceStore.updateValues()
          .then(() => generalStore.setGasPrice(gasPriceStore.slow.price))
          .catch(() => noGasPriceAvailable())
      })
  }

  extractContractsData() {
    const { contractStore, crowdsalePageStore, web3Store } = this.props
    const { web3 } = web3Store

    const crowdsaleAddr = CrowdsaleConfig.crowdsaleContractURL ? CrowdsaleConfig.crowdsaleContractURL : getQueryVariable('addr')

    if (!web3.utils.isAddress(crowdsaleAddr)) {
      this.setState({ loading: false })
      return invalidCrowdsaleAddrAlert()
    }

    getJoinedTiers(contractStore.crowdsale.abi, crowdsaleAddr, [], joinedCrowdsales => {
      console.log('joinedCrowdsales:', joinedCrowdsales)

      const crowdsaleAddrs = typeof joinedCrowdsales === 'string' ? [joinedCrowdsales] : joinedCrowdsales
      contractStore.setContractProperty('crowdsale', 'addr', crowdsaleAddrs)

      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          this.setState({ loading: false })
          return
        }

        this.setState({
          curAddr: accounts[0],
          web3
        })

        if (!contractStore.crowdsale.addr) {
          this.setState({ loading: false })
          return
        }

        findCurrentContractRecursively(0, null, crowdsaleContract => {
          if (!crowdsaleContract) {
            this.setState({ loading: false })
            return
          }

          initializeAccumulativeData()
            .then(() => getCrowdsaleData(crowdsaleContract))
            .then(() => getAccumulativeCrowdsaleData())
            .then(() => this.setState({ loading: false }))
            .catch(err => {
              this.setState({ loading: false })
              console.log(err)
            })

          getCrowdsaleTargetDates(this, () => {
            if (crowdsalePageStore.endDate) {
              this.setState({
                seconds: (crowdsalePageStore.endDate - new Date().getTime()) / 1000
              })
            }
          })
        })
      })
    })
  }

  investToTokens = event => {
    const { investStore, crowdsalePageStore, web3Store } = this.props
    const { web3 } = web3Store

    event.preventDefault()

    if (!this.isValidToken(investStore.tokensToInvest)) {
      this.setState({ pristineTokenInput: false })
      return
    }

    this.setState({ loading: true })

    const startBlock = parseInt(crowdsalePageStore.startBlock, 10)
    const { startDate } = crowdsalePageStore

    if ((isNaN(startBlock) || startBlock === 0) && !startDate) {
      this.setState({ loading: false })
      return
    }

    if (web3.eth.accounts.length === 0) {
      this.setState({ loading: false })
      return noMetaMaskAlert()
    }

    this.investToTokensForWhitelistedCrowdsale()
  }

  investToTokensForWhitelistedCrowdsale() {
    const { crowdsalePageStore, web3Store } = this.props
    const { web3 } = web3Store

    if (crowdsalePageStore.startDate > (new Date()).getTime()) {
      this.setState({ loading: false })
      return investmentDisabledAlertInTime(crowdsalePageStore.startDate)
    }

    findCurrentContractRecursively(0, null, (crowdsaleContract, tierNum) => {
      if (!crowdsaleContract) {
        this.setState({ loading: false })
        return
      }

      getCurrentRate(crowdsaleContract)
        .then(() => web3.eth.getAccounts())
        .then((accounts) => this.investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, accounts))
        .catch(console.log)
    })
  }

  investToTokensForWhitelistedCrowdsaleInternal(crowdsaleContract, tierNum, accounts) {
    const { contractStore, tokenStore, crowdsalePageStore, investStore, generalStore } = this.props

    let nextTiers = []
    for (let i = tierNum + 1; i < contractStore.crowdsale.addr.length; i++) {
      nextTiers.push(contractStore.crowdsale.addr[i])
    }
    console.log('nextTiers:', nextTiers)
    console.log(nextTiers.length)

    const decimals = parseInt(tokenStore.decimals, 10)
    console.log('decimals:', decimals)

    const rate = parseInt(crowdsalePageStore.rate, 10) //it is from contract. It is already in wei. How much 1 token costs in wei.
    console.log('rate:', rate)

    const tokensToInvest = parseFloat(investStore.tokensToInvest)
    console.log('tokensToInvest:', tokensToInvest)

    const weiToSend = parseInt(tokensToInvest * rate, 10)
    console.log('weiToSend:', weiToSend)

    const opts = {
      from: accounts[0],
      value: weiToSend,
      gasPrice: generalStore.gasPrice
    }
    console.log(opts)

    crowdsaleContract.methods.buy().estimateGas(opts)
      .then(estimatedGas => {
        const estimatedGasMax = 4016260
        opts.gasLimit = !estimatedGas || estimatedGas > estimatedGasMax ? estimatedGasMax : estimatedGas + 100000

        return sendTXToContract(crowdsaleContract.methods.buy().send(opts))
      })
      .then(() => successfulInvestmentAlert(investStore.tokensToInvest))
      .catch(err => toast.showToaster({ type: TOAST.TYPE.ERROR, message: TOAST.MESSAGE.TRANSACTION_FAILED }))
      .then(() => this.setState({ loading: false }))
  }

  txMinedCallback(txHash, receipt) {
    const { investStore } = this.props

    if (receipt) {
      if (receipt.blockNumber) {
        this.setState({ loading: false })
        successfulInvestmentAlert(investStore.tokensToInvest)
      }
    } else {
      setTimeout(() => {
        checkTxMined(txHash, receipt => this.txMinedCallback(txHash, receipt))
      }, 500)
    }
  }

  tokensToInvestOnChange = event => {
    this.setState({ pristineTokenInput: false })
    this.props.investStore.setProperty('tokensToInvest', event.target.value)
  }

  isValidToken(token) {
    return +token > 0 && countDecimalPlaces(token) <= this.props.tokenStore.decimals
  }

  renderPieTracker () {
    return (
      <div style={{ marginLeft: '-20px', marginTop: '-20px' }}>
        <ReactCountdownClock
          seconds={this.state.seconds}
          color="#733EAB"
          alpha={0.9}
          size={270}
        />
      </div>
    )
  }

  shouldStopCountDown () {
    if(this.state.seconds < 0) {
      this.setState({ seconds: 0 })
      clearInterval(this.state.timeInterval)
    }
  }

  getTimeStamps (seconds) {
    this.shouldStopCountDown()
    const days        = Math.floor(seconds / 24 / 60 / 60)
    const hoursLeft   = Math.floor(seconds - days * 86400)
    const hours       = Math.floor(hoursLeft / 3600)
    const minutesLeft = Math.floor(hoursLeft - hours * 3600)
    const minutes     = Math.floor(minutesLeft / 60)
    return { days, hours, minutes }
  }

  render () {
    const { crowdsalePageStore, tokenStore, contractStore, investStore } = this.props
    const { rate, tokenAmountOf, ethRaised, supply } = crowdsalePageStore
    const { crowdsale, contractType } = contractStore
    const { tokensToInvest } = investStore

    const { seconds, curAddr, pristineTokenInput, investThrough, crowdsaleAddress, web3Available } = this.state
    const { days, hours, minutes } = this.getTimeStamps(seconds)

    const { decimals, ticker, name } = tokenStore
    const isWhitelistWithCap = contractType === CONTRACT_TYPES.whitelistwithcap

    const tokenDecimals = !isNaN(decimals) ? decimals : 0
    const tokenTicker = ticker ? ticker.toString() : ''
    const tokenName = name ? name.toString() : ''
    const maxCapBeforeDecimals = crowdsalePageStore.maximumSellableTokens / 10 ** tokenDecimals
    const tokenAddress = getContractStoreProperty('token', 'addr')

    //balance: tiers, standard
    const investorBalanceTiers = tokenAmountOf ? (tokenAmountOf / 10 ** tokenDecimals).toString() : '0'
    const investorBalanceStandard = ethRaised ? (ethRaised / rate).toString() : '0'
    const investorBalance = isWhitelistWithCap ? investorBalanceTiers : investorBalanceStandard

    //total supply: tiers, standard
    const tierCap = !isNaN(maxCapBeforeDecimals) ? maxCapBeforeDecimals.toString() : '0'
    const standardCrowdsaleSupply = !isNaN(supply) ? supply.toString() : '0'
    const totalSupply = isWhitelistWithCap ? tierCap : standardCrowdsaleSupply

    let invalidTokenDescription = null
    if (!pristineTokenInput && !this.isValidToken(tokensToInvest)) {
      invalidTokenDescription = (
        <p className="error">
          Number of tokens to buy should be positive and should not exceed {decimals} decimals.
        </p>
      )
    }

    const QRPaymentProcessElement = investThrough === INVESTMENT_OPTIONS.QR ?
      <QRPaymentProcess crowdsaleAddress={crowdsaleAddress} /> :
      null

    const ContributeButton = investThrough === INVESTMENT_OPTIONS.METAMASK ?
      <a className="button button_fill" onClick={this.investToTokens}>Contribute</a> :
      null

    const rightColumnClasses = classNames('invest-table-cell', 'invest-table-cell_right', {
      'qr-selected': investThrough === INVESTMENT_OPTIONS.QR
    })

    return <div className="invest container">
      <div className="invest-table">
        <div className="invest-table-cell invest-table-cell_left">
          <div className="timer-container">
            <div className="timer">
              <div className="timer-inner">
                <div className="timer-i">
                  <div className="timer-count">{days}</div>
                  <div className="timer-interval">Days</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{hours}</div>
                  <div className="timer-interval">Hours</div>
                </div>
                <div className="timer-i">
                  <div className="timer-count">{minutes}</div>
                  <div className="timer-interval">Mins</div>
                </div>
              </div>
            </div>
            {this.renderPieTracker()}
          </div>
          <div className="hashes">
            <div className="hashes-i">
              <p className="hashes-title">{curAddr}</p>
              <p className="hashes-description">Current Account</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{tokenAddress}</p>
              <p className="hashes-description">Token Address</p>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{crowdsale && crowdsale.addr && crowdsale.addr[0]}</p>
              <p className="hashes-description">Crowdsale Contract Address</p>
            </div>
            <div className="hashes-i hidden">
              <div className="left">
                <p className="hashes-title">{tokenName}</p>
                <p className="hashes-description">Name</p>
              </div>
              <div className="left">
                <p className="hashes-title">{tokenTicker}</p>
                <p className="hashes-description">Ticker</p>
              </div>
            </div>
            <div className="hashes-i">
              <p className="hashes-title">{totalSupply} {tokenTicker}</p>
              <p className="hashes-description">Total Supply</p>
            </div>
          </div>
          <p className="invest-title">Invest page</p>
          <p className="invest-description">
            {'Here you can invest in the crowdsale campaign. At the moment, you need Metamask client to invest into the crowdsale. If you don\'t have Metamask, you can send ethers to the crowdsale address with a MethodID: 0xa6f2ae3a. Sample '}
            <a href="https://kovan.etherscan.io/tx/0x42073576a160206e61b4d9b70b436359b8d220f8b88c7c272c77023513c62c3d">transaction</a> on Kovan network.
          </p>
        </div>
        <div className={rightColumnClasses}>
          <div className="balance">
            <p className="balance-title">{investorBalance} {tokenTicker}</p>
            <p className="balance-description">Balance</p>
            <p className="description">
              Your balance in tokens.
            </p>
          </div>
          <form className="invest-form" onSubmit={this.investToTokens}>
            <label className="invest-form-label">Choose amount to invest</label>
            <div className="invest-form-input-container">
              <input type="text" className="invest-form-input" value={tokensToInvest} onChange={this.tokensToInvestOnChange} placeholder="0"/>
              <div className="invest-form-label">TOKENS</div>
              {invalidTokenDescription}
            </div>
            <div className="invest-through-container">
              <select value={investThrough} className="invest-through" onChange={(e) => this.setState({ investThrough: e.target.value })}>
                <option disabled={!web3Available} value={INVESTMENT_OPTIONS.METAMASK}>Metamask {!web3Available ? ' (not available)' : null}</option>
                <option value={INVESTMENT_OPTIONS.QR}>QR</option>
              </select>
              { ContributeButton }
            </div>
            <p className="description">
              Think twice before contributing to Crowdsales. Tokens will be deposited on a wallet you used to buy tokens.
            </p>
          </form>
          { QRPaymentProcessElement }
        </div>
      </div>
      <Loader show={this.state.loading}></Loader>
    </div>
  }
}
