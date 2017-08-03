var solc = require("solc");
var fs = require("fs");
var pathLib = require("path");

let args = process.argv.slice(2);
let inputFilePath = args.length > 0?args[0]:"/out";
let totalContractName = args.length > 1?args[1]:"";
let outputFolder = args.length > 2?args[2]:"/out";

fs.readFile(inputFilePath, "utf8", function(err, content) {
	if (err) return console.log(err.message);

	var solcV011 = solc.setupMethods(require("./bin/soljson-v0.4.11+commit.68ef5810.js"))
	//var solcV011 = solc.useVersion('v0.4.11+commit.68ef5810');
	var output = solcV011.compile(content, 1)
	for (var contractName in output.contracts) {
		if (totalContractName.toLowerCase() == contractName.substr(contractName.indexOf(":") + 1).toLowerCase()) {
			fs.writeFileSync(outputFolder + "/" + totalContractName + "_flat.bin", output.contracts[contractName].bytecode);
			fs.writeFileSync(outputFolder + "/" + totalContractName + "_flat.abi", output.contracts[contractName].interface);
		}
	}

});
