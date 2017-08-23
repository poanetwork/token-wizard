var fs = require("fs");

function addExtendedCode(extensionFilePath, content, cb) {
	fs.readFile(extensionFilePath, "utf8", function(err, extendedContent) {
		if (err) {
			return cb(err);
		}
		content = content + extendedContent;
		cb(null, content);
	});
}

module.exports = addExtendedCode;