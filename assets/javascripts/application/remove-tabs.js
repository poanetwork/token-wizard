function removeTabs(content) {
	content = content.replace(/[\r\n]+/g, '\n'); //removes tabs
	return content;
}