import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'

const ONE_SECOND = 1000;

class Web3Provider extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedAccount: null
    }

    this.web3 = null
    this.interval = null

  }
  render() {
    const { web3UnavailableScreen: Web3UnavailableScreen } = this.props

    if (window.web3) {
      if (!this.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
        this.fetchAccounts()
      }

      return this.props.children
    }

    return <Web3UnavailableScreen />
  }

  componentDidMount() {
    this.initPoll();
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
    const { web3  } = this
    const { onChangeAccount } = this.props

    if (!web3 || !web3.eth) {
      return
    }

    return web3.eth.getAccounts()
      .then(accounts => {
        if (!accounts || !accounts.length) {
          return
        }

        let curr = this.state.selectedAccount
        let next = accounts[0]
        curr = curr && curr.toLowerCase()
        next = next && next.toLowerCase()

        const didChange = curr && next && (curr !== next)

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
      web3: this.web3,
      selectedAccount: this.state.selectedAccount
    }
  }
}

Web3Provider.childContextTypes = {
  web3: PropTypes.object,
  selectedAccount: PropTypes.string
}

export default Web3Provider;
