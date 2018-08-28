#!/bin/bash
mintedPath=submodules/auth-os-applications/TokenWizard/crowdsale/MintedCappedCrowdsale
cd $mintedPath
npm i
cd scripts
./flatten.sh
cd ..
npx truffle compile flats/MintedCappedProxy.sol
cd ../../../../..
rm public/contracts/MintedCapped*.*
cp $mintedPath/flats/MintedCappedProxy.sol public/contracts/
cp $mintedPath/build/contracts/MintedCappedProxy.json public/contracts/
cd scripts
node ./extractContent.js MintedCappedProxy
cd ..
rm ./public/contracts/MintedCappedProxy.json
