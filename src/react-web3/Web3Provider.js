import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'

const ONE_SECOND = 1000

class Web3Provider extends Component {
  state = {
    selectedAccount: null,
    web3: null,
    approvePermissions: null,
    render: false
  }

  checkWeb3 = async () => {
    const setWeb3 = () => {
      window.web3 = new Web3(window.web3.currentProvider)
      this.setState({
        approvePermissions: true,
        web3: window.web3
      })
    }

    const { ethereum } = window

    // Modern dapp browsers...
    if (ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable() // Request account access
        setWeb3()
      } catch (err) {
        this.setState({
          approvePermissions: false
        })
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      setWeb3()
    }
    // Non-dapp browsers...
    else {
      this.setState({
        approvePermissions: false
      })
    }
  }

  async componentDidMount() {
    await this.checkWeb3()
    this.initPoll()

    this.setState({
      render: true
    })
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
