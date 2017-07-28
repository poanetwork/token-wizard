function findFilebyName(repo, dir, fileName, cb) {
	getSolFilesRecursively(repo, dir, function(srcFiles) {		
		for (var j = 0; j < srcFiles.length; j++) {
			if (basename(srcFiles[j]) == fileName) {
				repo.contents(srcFiles[j]).read().then((fileContent) => {
					cb(fileContent);
					return;
				});
			}
		}

		dir = dir.substring(0, dir.lastIndexOf("/"));
		findFilebyName(repo, dir, fileName, cb);
	});
}

function findFilebyNameAndReplace(repo, dir, fileName, updatedFileContent, importStatement, cb) {
	getSolFilesRecursively(repo, dir, function(srcFiles) {
		var importIsReplacedBefore = false;
		for (var j = 0; j < srcFiles.length; j++) {
			if (basename(srcFiles[j]) == fileName) {
				if (importedSrcFiles.indexOf(srcFiles[j]) === -1) {
					repo.contents(srcFiles[j]).read().then((fileContent) => {
						updatedFileContent = updatedFileContent.replace(importStatement, fileContent);
						importedSrcFiles.push(srcFiles[j]);
						cb(updatedFileContent);
						return;
					});
				} else {
					importIsReplacedBefore = true;
				}
				break;
			}
		}

		if (importIsReplacedBefore) {
			updatedFileContent = updatedFileContent.replace(importStatement, "");
			cb(updatedFileContent);
		} else {
			if (dir.indexOf("/") > -1) {
				dir = dir.substring(0, dir.lastIndexOf("/"));
				findFilebyNameAndReplace(repo, dir, fileName, updatedFileContent, importStatement, cb);
			} else {
				updatedFileContent = updatedFileContent.replace(importStatement, "");
				cb(updatedFileContent);
			}
		}
	});
}