var solc = require("solc");
var fs = require("fs");
var pathLib = require("path");
var addExtendedCode = require("./addExtendedCode.js");

let args = process.argv.slice(2);
let inputFilePath = args.length > 0?args[0]:"/out";
let crowdsaleContractName = args.length > 1?args[1]:"";
let tokenContractName = args.length > 2?args[2]:"";
let outputFolder = args.length > 3?args[3]:"/out";
var targetContractNames = [crowdsaleContractName, tokenContractName];

fs.readFile(inputFilePath, "utf8", function(err, content) {
	if (err) {
		return console.log(err.message);
	}
	addExtendedCode(content, function(err, contentUpdated) {
		if (err) {
			return console.log(err.message);
		}

		var outputFilePath = inputFilePath.replace(pathLib.basename(inputFilePath), "Sample" + pathLib.basename(inputFilePath));
		fs.writeFileSync(outputFilePath, contentUpdated);
		var solcV011 = solc.setupMethods(require("./bin/soljson-v0.4.11+commit.68ef5810.js"));
		//var solcV011 = solc.useVersion('v0.4.11+commit.68ef5810');
		var output = solcV011.compile(contentUpdated, 1);
		for (let contractName in output.contracts) {
			for (let i in targetContractNames) {
				let targetContractName = targetContractNames[i];
				if (targetContractName.toLowerCase() == contractName.substr(contractName.indexOf(":") + 1).toLowerCase()) {
					fs.writeFileSync(outputFolder + "/" + targetContractName + "_flat.bin", output.contracts[contractName].bytecode);
					fs.writeFileSync(outputFolder + "/" + targetContractName + "_flat.abi", output.contracts[contractName].interface);
				}
			}
		}
	});
});
