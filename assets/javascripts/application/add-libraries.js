function addLibraries(repo, parentDir, inputFileContent, srcFiles, cb) {
	let updatedFileContent = inputFileContent;
	let usingLibrariesFound = 0;
	findUsingLibraryFor(updatedFileContent, function(usingLibraries) {
		let usingLibrariesIterator = 0;
		for (let k = 0; k < usingLibraries.length; k++) {
			let usingLibraryName = usingLibraries[k];
			for (let j = 0; j < srcFiles.length; j++) {
				readSolFile(srcFiles[j], function(fileContent) {
					usingLibrariesIterator++;
					if (fileContent.indexOf("library " + usingLibraryName) > -1) {
						if (importedSrcFiles.indexOf(srcFiles[j]) === -1) {
							updatedFileContent = fileContent + updatedFileContent;
							srcFiles.splice(j,1);
							importedSrcFiles.push(srcFiles[j]);
							usingLibrariesFound++;
						}
						//break;
					}

					if (usingLibrariesIterator == usingLibraries.length * srcFiles.length) {
						if (usingLibraries.length > usingLibrariesFound) {
							if (parentDir.lastIndexOf("/") > -1) {
								parentDir = parentDir.substring(0, parentDir.lastIndexOf("/"));
								getSolFilesRecursively(repo, parentDir, function(srcFiles) {
									addLibraries(repo, parentDir, inputFileContent, srcFiles, cb);
								});
								return;
							}
						}

						cb(updatedFileContent);
					}
				});
			}
		}
	});
}