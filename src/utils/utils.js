export function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

export function setFlatFileContentToState(file, cb) {
  readSolFile(file, function(content) {
    cb(content);
  });
}

function readSolFile(path, cb) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                cb(allText);
            }
        }
    };
    rawFile.send(null);
}

export const findConstructor = (abiCrowdsale) => {
    console.log('abiCrowdSale,', abiCrowdsale)
    let abiConstructor
    abiCrowdsale.forEach(abiObj => {
        if (abiObj.type === "constructor") {
            console.log(abiObj);
            console.log(abiObj.inputs);
            abiConstructor = abiObj.inputs;
        }
    })
    return abiConstructor
}

export const getconstructorParams = (abiConstructor, state) => {
    let params = {"types": [], "vals": []};
    if (!abiConstructor) return params;

    console.log(abiConstructor.length);
    console.log(state);
    for (let j = 0; j < abiConstructor.length; j++) {
        let inp = abiConstructor[j];
        params.types.push(inp.type);
        switch(inp.name) {
            case "_startBlock": {
                params.vals.push(state.crowdsale.startBlock);
            } break;
            case "_endBlock": {
                params.vals.push(state.crowdsale.endBlock);
            } break;
            case "_rate": {
                params.vals.push(state.crowdsale.rate);
            } break;
            case "_wallet": {
                params.vals.push(state.crowdsale.walletAddress);
            } break;
            case "_crowdsaleSupply": {
                params.vals.push(state.crowdsale.supply);
            } break;
            case "_name": {
                params.vals.push(state.token.name);
            } break;
            case "_symbol": {
                params.vals.push(state.token.ticker);
            } break;
            case "_decimals": {
                params.vals.push(state.token.decimals);
            } break;
            case "_tokenSupply": {
                params.vals.push(state.token.supply);
            } break;
            default: {
                params.vals.push("");
            } break;
        }
    }
    return params;
}

export const getOldState = (props, defaultState) => props && props.location && props.location.query && props.location.query.state || defaultState

export const getStepClass = (step, activeStep) => step === activeStep ? "step-navigation step-navigation_active" : "step-navigation"
