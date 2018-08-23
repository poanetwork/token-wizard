#!/bin/bash
dutchPath=submodules/auth-os-applications/TokenWizard/crowdsale/DutchCrowdsale
cd $dutchPath
npm i
cd scripts
./flatten.sh
cd ..
npx truffle compile flats/DutchProxy.sol
cd ../../../../..
rm public/contracts/Dutch*.*
cp $dutchPath/flats/DutchProxy.sol public/contracts/
cp $dutchPath/build/contracts/DutchProxy.json public/contracts/
cd scripts
node ./extractContent.js DutchProxy
cd ..
rm ./public/contracts/DutchProxy.json
