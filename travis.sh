#!/usr/bin/bash
git submodule update -f --recursive --remote &&
npm run installWeb3 &&
npm run testContractsDutchAuction
