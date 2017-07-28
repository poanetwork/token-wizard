function replaceAllImportsRecursively(repo, fileContent, dir, cb) {
	let updatedFileContent = fileContent;
	findAllImportPaths(repo, dir, updatedFileContent, function(_importObjs) {
		if (!_importObjs) return cb(updatedFileContent);
		if (_importObjs.length == 0) return cb(updatedFileContent);

		replaceAllImportsInCurrentLayer(repo, 0, _importObjs, updatedFileContent, dir, function(_updatedFileContent) {
			replaceAllImportsRecursively(repo, _updatedFileContent, dir, cb);
		});
	});
};
