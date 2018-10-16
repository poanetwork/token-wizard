import React, { Component } from 'react';

export default class NoWeb3 extends Component {
  render () {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">Wallet not found, or access to Ethereum account not granted</h1>
              <p className="description">
                If a Wallet extension is installed on your web browser, please verify that the access to Ethereum account has been granted and is available for the corresponding domain.
                Check Token Wizard GitHub for <a href='https://github.com/poanetwork/token-wizard' target='blank'>the instruction</a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
