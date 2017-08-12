export function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
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

export const findConstructor = (abiCrowdsale, oldState) => {
    let newState = { ...oldState }
    console.log('abiCrowdSale,', abiCrowdsale)
    abiCrowdsale.forEach(abiObj => {
        if (abiObj.type === "constructor") {
            console.log(abiObj);
            console.log(abiObj.inputs);
            newState.contracts.crowdsale.abiConstructor = abiObj.inputs;
        }
    })
    return newState
}

export const getOldState = (props, defaultState) => props && props.location && props.location.query && props.location.query.state || defaultState

export const getStepClass = (step, activeStep) => step === activeStep ? "step-navigation step-navigation_active" : "step-navigation"

export const stepsAreValid = (steps) => {
    const stepArray = Object.values(steps)
    const invalidStepValue = stepArray.find( step => step === false)
    return invalidStepValue === undefined
}

export const isValidName = (name) => name.length > 1 
