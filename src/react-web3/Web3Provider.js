import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Web3Provider extends Component {
  render() {
    if (window.web3) {
      return this.props.children
    }

    return <this.props.web3UnavailableScreen />
  }

  getChildContext() {
    return {
      web3: window.web3
    }
  }
}

Web3Provider.childContextTypes = {
  web3: PropTypes.object
}

export default Web3Provider;
