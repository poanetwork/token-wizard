import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import { Loader } from '../components/Common/Loader'
import logdown from 'logdown'

const ONE_SECOND = 1000
const logger = logdown('TW:Web3Provider')

class Web3Provider extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedAccount: null,
      web3: null,
      render: false
    }

    this.web3 = null
    this.interval = null
  }

  render() {
    const { web3UnavailableScreen: Web3UnavailableScreen } = this.props

    let renderContainer = false

    if (this.state.render) {
      if (this.state.web3) {
        renderContainer = this.props.children
      } else {
        // eslint-disable-next-line
        renderContainer = <Web3UnavailableScreen/>
      }
    } else {
      // eslint-disable-next-line
      renderContainer = <Loader show={true}></Loader>
    }
    // eslint-disable-next-line
    return ( renderContainer )
  }

  componentDidMount() {
    this.checkWeb3()
    this.initPoll()

    // Wait 1 second to render
    setTimeout(() => {
      this.setState({ render: true })
    }, 500)
  }

  checkWeb3() {
    const setWeb3 = () => {
      try {
        window.web3 = new Web3(window.web3.currentProvider)
        this.setState({
          web3: window.web3
        })
        this.fetchAccounts()
      } catch (err) {
        logger.log('There was a problem fetching accounts', err)
      }
    }
    window.addEventListener('load', () => {
      const { ethereum } = window
      // Modern dapp browsers...
      if (ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          ethereum.enable().then(() => {
            if (!this.state.web3) {
              setWeb3()
            }
          })
        } catch (error) {
          // User denied account access...
          logger.log('User denied account access')
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        setWeb3()
      }
      // Non-dapp browsers...
      else {
        logger.log('Non-Ethereum browser detected. You should consider trying a wallet!')
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  initPoll = () => {
    if (!this.interval) {
      this.interval = setInterval(this.fetchAccounts, ONE_SECOND)
    }
  }

  fetchAccounts = () => {
    const { web3 } = this.state
    const { onChangeAccount } = this.props

    if (!web3 || !web3.eth) {
      return
    }

    return web3.eth.getAccounts().then(accounts => {
      if (!accounts || !accounts.length) {
        return
      }

      let curr = this.state.selectedAccount
      let next = accounts[0]
      curr = curr && curr.toLowerCase()
      next = next && next.toLowerCase()

      const didChange = curr && next && curr !== next

      if (didChange && typeof onChangeAccount === 'function') {
        onChangeAccount(next)
      }

      this.setState({
        selectedAccount: next || null
      })
    })
  }

  getChildContext() {
    return {
      web3: this.state.web3,
      selectedAccount: this.state.selectedAccount
    }
  }
}

Web3Provider.childContextTypes = {
  web3: PropTypes.object,
  selectedAccount: PropTypes.string
}

export default Web3Provider
