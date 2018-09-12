const copyFile = require('./helpers/utils')

const directory = process.argv.slice(2)[0]

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
