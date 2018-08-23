#!/bin/bash
if [ $# -eq 1 ]
then
    cd submodules/auth-os-applications
    git reset --hard $1
    cd ../..
fi
./scripts/generateDutchProxyContract.sh
./scripts/generateMintedCappedProxyContract.sh
