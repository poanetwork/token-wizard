const fs = require('fs')

const directory = process.argv.slice(2)[0]

const copyFile = (source, target, cb) => {
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

const copyStrategy = strategy => {
  try {
    const strategiesAllowed = ['Dutch', 'MintedCapped']
    if (!strategiesAllowed.includes(strategy)) {
      throw new Error('Strategy doesnt exist')
    }
    const originPath = `${__dirname}/../submodules/auth-os-applications/TokenWizard/crowdsale/${strategy}Crowdsale/truffle.js`
    const destinyPath = `${__dirname}/../${directory}/metadata/${strategy}CrowdsaleTruffle.js`

    copyFile(originPath, destinyPath, err => {
      if (err) {
        console.log(`Error moving files`, err)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const strategiesToMove = ['Dutch', 'MintedCapped']

for (let strategy of strategiesToMove) {
  copyStrategy(strategy)
}
