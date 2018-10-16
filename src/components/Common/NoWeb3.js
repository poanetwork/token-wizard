import React, { Component } from 'react'

export default class NoWeb3 extends Component {
  render() {
    return (
      <div>
        <section className="home">
          <div className="container">
            <div className="st-StepContent_Info">
              <div className="st-StepContentInfo_InfoText">
                <h1 className="st-StepContent_InfoTitle">
                  Wallet not found, or access to Ethereum account not granted
                </h1>
                <p className="st-StepContent_InfoDescription">
                  If{' '}
                  <a
                    href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid"
                    target="blank"
                  >
                    a Wallet{' '}
                  </a>
                  extension is installed on your web browser, please verify that the access to Ethereum account has been
                  granted and is available for the corresponding domain. Check Token Wizard GitHub for{' '}
                  <a href="https://github.com/poanetwork/token-wizard" target="blank">
                    the instruction
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
