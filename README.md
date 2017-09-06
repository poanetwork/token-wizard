ICO Wizard DApp

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)

## Introduction

`ICO tools should be available for non-coders for free. Raising funds from a crowd is our basic human right.`

ICO wizard is a tool to create token and crowdsale contracts in 5 simple steps.  Wizard is based on modified [TokenMarket](https://github.com/TokenMarketNet/ico) contracts. Wizard is baked how we like it: decentralized, client side, serverless, open source, free, awesome.

ICOs usually have two or more contracts. One token contract and one or more crowdsale contract plus supplemental contracts, e.g., safe math, pricing strategy, etc. Most token contracts are the same (ERC-20); most crowdsale contracts are different.  Token implementation should be stable for compatibility, and it is crucial to connect token to exchanges and wallets. Crowdsale contracts on another side should follow fashion and differentiate a project from others, e.g., create a new type of [FOMO](http://www.urbandictionary.com/define.php?term=fomo), fear of missing out.


## Requirements

- Google Chrome, Chromium, or Chrome Canary
- [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn). Ethereum web wallet for Google Chrome. Must have
- Kovan testnet coins.
    -  Create an account in Metamask, copy it's address and ask for free coint on [Kovan's gitter](https://gitter.im/kovan-testnet/faucet)
- Parity for manual operations, e.g., adding people to whitelist after creation of crowdsales, finalizing, etc.
    -  [How to install Parity](https://github.com/paritytech/parity/wiki/Setup)
    - Sync it. `parity --chain kovan --warp ui`
    - Export private key from Metamask and import in to Parity in UI.
- Patience. Metamask doesn't support bulk transactions. Simplest crowdsale will ask you to sign at least 14 transactions. 
## Strategy

At the moment, the Wizard supports one type of crowdsale contract, the mighty "whitelisted with tiers and cap". This strategy is popular in modern ICOs due to regulatory involvement in the process (September 2017). A naive approach to comply with regulation is to perform KYC of buyers and restrict participants from democratic countries, e.g., the U.S. or PRC. 

Features of "Whitelisted with tiers and cap" strategy:
- Tiers. A crowdsale can have one or more tiers. Each tier has a set of configurable parameters:
    -  Wallet address. Collected funds will be sent to the wallet address immediately after receiving from a participant of the crowdsale.
    -  Start time. A time when a tier of crowdsale will start. You can't set up time in the past. 
    -  End time. A time when a tier of crowdsale will end.
    -  Rate. Exchange rate for a token to the ether. E.g., exchange rate 100 means that for one ether you can buy 100 tokens.
    -  Supply. The maximum amount of tokens available to buy in a tier. Max cap of the crowdsale equals to the sum of all supply of all tiers.
    -  Allow modifying. Controversial feature aka "Box of Pandora". It allows owners to modify Start time, End time, Rate, and Supply after the crowdsale. 
- Whitelist. A crowdsale can have one or more whitelisted addresses. If there are no whitelisted addresses than nobody can buy tokens on that tier. Whitelists inherited. E.g., if a user was on Tier 1 and didn't buy max cap on Tier 1, he can buy on Tier 2, and other tiers.  Can be updated after the creation of the crowdsale using parity client. Each whitelist has a set of configurable parameters:
    -  Address. Whitelisted ethereum address.
    -  Min. The minimum amount of tokens to buy.
    -  Max. The maximum amount of tokens to buy. 

## How to run

Open [https://wizard.oracles.org](https://wizard.oracles.org) and follow steps

### Run local version for development

For dev purposes you can build and run ICO Wizard on your machine.

```
git clone https://github.com/oraclesorg/ico-wizard.git wiz
cd wiz
git submodule update --init --recursive --remote
npm install
npm start
```

Go to [localhost:3000](http://localhost:3000) and look around the app!

## Project built on ICO Wizard

None! Send PR if you are the first.

## Contributors guide

Issues which are looking for a handsom contributors are marked as [LookingForContributor] in Issues section of the GitHub (https://github.com/oraclesorg/ico-wizard/issues?q=is%3Aissue+is%3Aopen+label%3ALookingForContributor) 

## Notable Contributors

Brought to you by [Oracles Network](https://oracles.org/team) team.

We appreciate contributors from the community:

- Jeff Christian
- Roman Storm
