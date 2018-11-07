import React, { Component } from 'react'
import { ButtonMetamask } from '../Common/ButtonMetamask'
import { ButtonNiftyWallet } from '../Common/ButtonNiftyWallet'

export default class NoWeb3 extends Component {
  goToURL = theURL => {
    window.open(theURL, '_blank')
  }

  render() {
    return (
      <section className="sw-NoWeb3">
        <div className="sw-NoWeb3_Background background-blur" />
        <div className="sw-NoWeb3_Container">
          <div className="sw-NoWeb3_Block">
            <div className="sw-NoWeb3_InfoIcon" />
            <h1 className="sw-NoWeb3_Title">Wallet not found, or access to your Ethereum account was not granted.</h1>
            <p className="sw-NoWeb3_Description">
              If a wallet extension is installed on your web browser, please verify that access to your Ethereum account
              has been granted and that it's available for this domain.<br />
              <strong>Need more help?</strong>
              <br />
              <a href="https://poanet.zendesk.com/hc/en-us/categories/360000586593-Wallets" target="blank">
                Wallets HowTo
              </a>{' '}
              -{' '}
              <a href="https://github.com/poanetwork/token-wizard/wiki" target="blank">
                Token Wizard Wiki
              </a>
            </p>
            <div className="sw-NoWeb3_ButtonsContainer">
              <ButtonMetamask
                onClick={() => {
                  this.goToURL('https://metamask.io/')
                }}
              />
              <ButtonNiftyWallet
                onClick={() => {
                  this.goToURL(
                    'https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid?hl=en'
                  )
                }}
              />
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
