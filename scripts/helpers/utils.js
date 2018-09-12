const fs = require('fs')

module.exports.copyFile = (source, target, cb) => {
  let cbCalled = false

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
