import React, { Component } from 'react'
import { ButtonMetamask } from '../Common/ButtonMetamask'
import { ButtonNiftyWallet } from '../Common/ButtonNiftyWallet'

export default class NoWeb3 extends Component {
  render() {
    return (
      <section className="sw-NoWeb3">
        <div className="sw-NoWeb3_Background background-blur" />
        <div className="sw-NoWeb3_Container">
          <div className="sw-NoWeb3_Block">
            <div className="sw-NoWeb3_InfoIcon" />
            <h1 className="sw-NoWeb3_Title">Wallet not found, or access to you Ethereum account was not granted.</h1>
            <p className="sw-NoWeb3_Description">
              If a Wallet extension is installed on your web browser, please verify that access to your Ethereum account
              has been granted and that it's available for the domain. Check Token Wizard GitHub for{' '}
              <a href="https://github.com/poanetwork/token-wizard/wiki" target="blank">
                instructions
              </a>.
            </p>
            <div className="sw-NoWeb3_ButtonsContainer">
              <ButtonMetamask onClick={() => {}} />
              <ButtonNiftyWallet onClick={() => {}} />
              <a className="sw-NoWeb3_Button" href="/">
                Cancel
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
