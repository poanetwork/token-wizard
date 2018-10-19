import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import logdown from 'logdown'

const ONE_SECOND = 1000
const logger = logdown('TW:Web3Provider')

class Web3Provider extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedAccount: null,
      web3: null,
      approvePermissions: null,
      render: false
    }
  }

  render() {
    const { web3UnavailableScreen: Web3UnavailableScreen } = this.props

    if (this.state.render && this.state.web3 && this.state.approvePermissions) {
      return this.props.children
    }

    if (this.state.render && (!this.state.web3 || !this.state.approvePermissions)) {
      return <Web3UnavailableScreen />
    }

    return null
  }

  componentDidMount() {
    this.checkWeb3()
      .then(this.initPoll())
      .then(() => {
        this.setState({
          render: true
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          render: true
        })
      })
  }

  checkWeb3() {
    const setWeb3 = () => {
      try {
        window.web3 = new Web3(window.web3.currentProvider)
        this.setState({
          approvePermissions: true,
          web3: window.web3
        })
      } catch (err) {
        logger.log('There was a problem fetching accounts', err)
      }
    }

    return new Promise((resolve, reject) => {
      const { ethereum } = window

      // Modern dapp browsers...
      if (ethereum) {
        window.web3 = new Web3(ethereum)
        // Request account access if needed
        ethereum
          .enable()
          .then(() => {
            if (!this.state.web3) {
              setWeb3()
            }
          })
          .catch(err => {
            this.setState({
              approvePermissions: false
            })
            reject()
          })
        resolve()
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        setWeb3()
        resolve()
      }
      // Non-dapp browsers...
      else {
        this.setState({
          approvePermissions: false
        })
        reject()
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
