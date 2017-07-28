function findUsingLibraryFor(content, cb) {
	const subStr = "using ";
	let usingLibraries = [];
	let regex = new RegExp(subStr,"gi");
	while ( (result = regex.exec(content)) ) {
		let startUsingLibraryFor = result.index;
		let endUsingLibraryFor = startUsingLibraryFor + content.substr(startUsingLibraryFor).indexOf(";") + 1;
		let dependencyPath = content.substring(startUsingLibraryFor, endUsingLibraryFor);
		dependencyPath = dependencyPath.split(subStr)[1].split("for")[0].replace(/\s/g,'');
		usingLibraries.indexOf(dependencyPath) === -1 ? usingLibraries.push(dependencyPath) : console.log("This item already exists");
	}
	cb(usingLibraries);
}