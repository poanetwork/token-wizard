var fs = require("fs");

function addExtendedCode(content, cb) {
	let inputFilePath = "./scripts/extendedSolCode";
	fs.readFile(inputFilePath, "utf8", function(err, extendedContent) {
		if (err) {
			return cb(err);
		}
		//console.log(extendedContent);
		content = content + extendedContent;
		cb(null, content);
	});
}

module.exports = addExtendedCode;