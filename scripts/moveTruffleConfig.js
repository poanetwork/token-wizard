/**
 * Script that move truffle config to a public folder
 */

const path = require('path')
const { copyFile } = require('./helpers/utils')

const directory = process.argv.slice(2)[0] || 'public'

const copyStrategy = strategy => {
  try {
    const strategiesAllowed = ['Dutch', 'MintedCapped']
    if (!strategiesAllowed.includes(strategy)) {
      throw new Error('Strategy doesnt exist')
    }
    const originPath = path.join(
      __dirname,
      `../submodules/auth-os-applications/TokenWizard/crowdsale/${strategy}Crowdsale/truffle.js`
    )
    const destinyPath = path.join(__dirname, `../${directory}/metadata/${strategy}CrowdsaleTruffle.js`)

    copyFile(originPath, destinyPath, err => {
      if (err) {
        console.log(`Error moving files`, err)
      } else {
        console.log(`Move ${originPath} - Destiny ${destinyPath}`)
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
