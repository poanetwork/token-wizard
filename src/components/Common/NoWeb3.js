import React, { Component } from 'react';

export default class NoWeb3 extends Component {
  render () {
    return (
      <div>
        <section className="home">
          <div className="crowdsale">
            <div className="container">
              <h1 className="title">MetaMask Not Found</h1>
              <p className="description">
              You don't have MetaMask installed. Check Token Wizard GitHub for <a href='https://github.com/poanetwork/token-wizard' target='blank'>the instruction</a>.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
