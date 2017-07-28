function generateFlatSol(path, cb) {
	octo.repos('OpenZeppelin', 'zeppelin-solidity').fetch((err, repo) => {
	  if (err) console.error(err);
	  var dir = parentDir;
	  repo.contents(path).read().then((inputFileContent) => {
		  generateFlatFile(repo, dir, path, inputFileContent, function(outputFileContent) {
		  	cb(outputFileContent);
		  });
	  });
	});
}

function generateFlatFile(repo, dir, path, inputFileContent, cb) {
	var srcFiles = [];
	getSolFilesRecursively(repo, dir.substring(0, dir.lastIndexOf("/")), function(srcFiles) {
		allSrcFiles = srcFiles;
		getAllSolFilesCallBack(repo, inputFileContent, dir, path, srcFiles, cb);
	});
}

function getAllSolFilesCallBack(repo, inputFileContent, dir, path, srcFiles, cb) {
	addLibraries(repo, parentDir, inputFileContent, allSrcFiles, function(intermediateFileContent) {
		replaceAllImportsRecursively(repo, intermediateFileContent, dir, function(outputFileContent) {
			outputFileContent = removeDoubledSolidityVersion(outputFileContent);
			cb(outputFileContent);
		});
	});
}
