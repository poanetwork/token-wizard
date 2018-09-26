#!/bin/bash
mintedPath=submodules/auth-os-applications/TokenWizard/crowdsale/MintedCappedCrowdsale
cd $mintedPath
npm i
./node_modules/.bin/truffle version
