var solc = require("solc");
var fs = require("fs");
var pathLib = require("path");
var addExtendedCode = require("./addExtendedCode.js");

let args = process.argv.slice(2);
let inputFilePath = args.length > 0?args[0]:"/out";
let outputFolder = args.length > 1?args[1]:"/out";
let extensionFilePath = args.length > 2?args[2]:"";
let isExtended = args.length > 3?(args[3] == 'true'):false;
let targetContractName = args.length > 4?args[4]:"";
let outputContractName = args.length > 5?args[5]:"";

fs.readFile(inputFilePath, "utf8", function(err, content) {
	if (err) {
		return console.log(err.message);
	}

	content = "// Created using Token Wizard https://github.com/poanetwork/token-wizard by POA Network \n" + content;
	if (!isExtended) return compileContract(content);

	addExtendedCode(extensionFilePath, content, function(err, contentUpdated) {
		if (err) {
			return console.log(err.message);
		}

		compileContract(contentUpdated);
	});
});

function compileContract(content) {
	var outputFilePath = outputFolder + "/" + outputContractName + "_flat.sol";//.replace(pathLib.basename(inputFilePath), pathLib.basename(inputFilePath));

	fs.writeFileSync(outputFilePath, content);
	var solcV011 = solc.setupMethods(require("./bin/soljson-v0.4.11+commit.68ef5810.js"));
	//var solcV011 = solc.useVersion('v0.4.11+commit.68ef5810');
	var output = solcV011.compile(content, 1);
	//console.log(output);
	for (let contractName in output.contracts) {
		if (targetContractName.toLowerCase() === contractName.substr(contractName.indexOf(":") + 1).toLowerCase()) {
			//output.contracts[contractName].bytecode = solc.linkBytecode(output.contracts[contractName].bytecode, { ':SafeMathLib': '0x072ba774dfd4e827c539ecfc9c6e2fae8d012534' });
			//0xbf90948c40197c1c22b5fdd72a212efda3994d68 - safemathlib with divides
			//output.contracts[contractName].bytecode = solc.linkBytecode(output.contracts[contractName].bytecode, { ':SafeMathLib': '0xbf90948c40197c1c22b5fdd72a212efda3994d68' });
			//0xe9ae538ffea453eae179e45a787ca76db619d40d - safemathlibext
			//output.contracts[contractName].bytecode = solc.linkBytecode(output.contracts[contractName].bytecode, { ":SafeMathLibExt": "0xe9ae538ffea453eae179e45a787ca76db619d40d" });
			fs.writeFileSync(outputFolder + "/" + outputContractName + "_flat.bin", output.contracts[contractName].bytecode);
			fs.writeFileSync(outputFolder + "/" + outputContractName + "_flat.abi", output.contracts[contractName].interface);
		}
	}
}
