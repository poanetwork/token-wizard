function removeDoubledSolidityVersion(content) {
	const subStr = "pragma solidity";
	//1st pragma solidity declaration
	let firstIndex = content.indexOf(subStr);
	let lastIndex = firstIndex + content.substr(firstIndex).indexOf(";") + 1;
	let contentPart = content.substr(lastIndex);
	let contentFiltered = contentPart;
	//remove other pragma solidity declarations
	let regex = new RegExp(subStr,"gi");
	while ( (result = regex.exec(contentPart)) ) {
		let start = result.index;
		let end = start + contentPart.substr(start).indexOf(";") + 1;
		if (start != firstIndex) contentFiltered = contentFiltered.replace(contentPart.substring(start, end), "");
	}
	let finalContent = content.substr(0, lastIndex) + contentFiltered;
	
	return removeTabs(finalContent);
}