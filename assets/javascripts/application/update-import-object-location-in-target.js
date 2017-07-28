function updateImportObjectLocationInTarget(importObj, content) {
	let startIndexNew = content.indexOf(importObj.fullImportStatement);
	let endIndexNew = startIndexNew - importObj.startIndex + importObj.endIndex;
	importObj.startIndex = startIndexNew;
	importObj.endIndex = endIndexNew;
	return importObj;
}
