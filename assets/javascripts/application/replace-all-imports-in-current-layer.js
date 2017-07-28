function replaceAllImportsInCurrentLayer(repo, i, importObjs, updatedFileContent, dir, cb) {
	if (i < importObjs.length) {
		var importObj = importObjs[i];

		//replace contracts aliases
		if (importObj.contractName) {
			updatedFileContent = updatedFileContent.replace(importObj.alias + ".", importObj.contractName + ".");
		}
		
		importObj = updateImportObjectLocationInTarget(importObj, updatedFileContent);
		var importStatement = updatedFileContent.substring(importObj.startIndex, importObj.endIndex);

		octo.repos('OpenZeppelin', 'zeppelin-solidity').fetch((err, repo) => {
			repo.contents(dir + importObj.dependencyPath).read().then((importedFileContent) => {        // `.fetch` is used for getting JSON
				replaceRelativeImportPaths(repo, importedFileContent, dirname(importObj.dependencyPath) + "/", function(importedFileContentUpdated) {
					if (importedSrcFiles.indexOf(basename(dir + importObj.dependencyPath)) === -1) {
						importedSrcFiles.push(basename(dir + importObj.dependencyPath));
						updatedFileContent = updatedFileContent.replace(importStatement, importedFileContentUpdated);
					}
					else updatedFileContent = updatedFileContent.replace(importStatement, "");

					i++;
					replaceAllImportsInCurrentLayer(repo, i, importObjs, updatedFileContent, dir, cb);
				});
			}).catch((err) => {
				console.log("!!!" + importObj.dependencyPath + " SOURCE FILE NOT FOUND. TRY TO FIND IT RECURSIVELY!!!");
				findFilebyNameAndReplace(repo, dir.substring(0, dir.lastIndexOf("/")), basename(importObj.dependencyPath), updatedFileContent, importStatement, function(_updatedFileContent) {
					i++;
					replaceAllImportsInCurrentLayer(repo, i, importObjs, _updatedFileContent, dir, cb);
				});
			});
		});
	} else cb(updatedFileContent);
}
