const fs = require('fs')
const path = require('path')

const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

/**
 * Copy file from source to target
 * @param source
 * @param target
 * @param cb
 */
const copyFile = (source, target, cb) => {
  let cbCalled = false

  // Create target if not exist
  ensureDirectoryExistence(target)

  let rd = fs.createReadStream(source)
  rd.on('error', function(err) {
    done(err)
  })
  let wr = fs.createWriteStream(target)
  wr.on('error', err => {
    done(err)
  })
  wr.on('close', ex => {
    done()
  })
  rd.pipe(wr)

  function done(err) {
    if (!cbCalled) {
      cb(err)
      cbCalled = true
    }
  }
}

/**
 * Write a file with a given content
 * @param target
 * @param content
 * @param cb
 */
const writeFile = (target, content, cb) => {
  let cbCalled = false

  let wr = fs.createWriteStream(target, { autoClose: true, flags: 'w', encoding: 'utf-8', mode: '0666' })
  wr.on('error', err => {
    done(err)
  })
  wr.on('finish', ex => {
    done()
  })

  let newContent = JSON.stringify(content, null, 2)
  wr.write((newContent += '\r\n'))

  function done(err) {
    if (!cbCalled) {
      cb(err)
      cbCalled = true
    }
  }
}

module.exports = {
  copyFile: copyFile,
  writeFile: writeFile
}
