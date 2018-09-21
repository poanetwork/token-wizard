#!/bin/bash
dutchPath=submodules/auth-os-applications/TokenWizard/crowdsale/DutchCrowdsale
cd $dutchPath
npm i
./node_modules/.bin/truffle version
