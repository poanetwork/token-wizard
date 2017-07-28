function getSolFilesRecursively(repo, dir, cb) {
    var srcFiles = [];
    repo.contents(dir).read().then((contents) => {
        var folderIndices = [];
        for (let i = 0; i < contents.items.length; i++) {
            if (contents.items[i].path.endsWith(".sol")) srcFiles.push(contents.items[i].path);
            else folderIndices.push(i);
        }

        if (folderIndices.length == 0) cb(srcFiles);

        var folderIndicesIterator = 0;
        for (let i = 0; i < folderIndices.length; i++) {
            getSolFilesRecursively(repo, contents.items[folderIndices[i]].path, function(_srcFiles) {
                for (let i = 0; i < _srcFiles.length; i++) {
                    srcFiles.push(_srcFiles[i]);
                }
                folderIndicesIterator++;

                if (folderIndicesIterator == folderIndices.length) {
                    cb(srcFiles);
                }
            });
        }
    });
}