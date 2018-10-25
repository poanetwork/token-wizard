/**
 * Script that create a json file with the truffle version in a public folder
 */

const path = require('path')
const shell = require('shelljs')
const { writeFile } = require('./helpers/utils')

const directory = process.argv.slice(2)[0] || 'public'

const getObjectVersion = strategy => {
  const pathToBin = `./scripts/get${strategy}SolcVersion.sh`
  const { stdout, code } = shell.exec(pathToBin, { silent: true })

  if (code !== 0) {
    throw new Error('There is a problem obtaining the solc version')
  }

  const version = stdout.match(/(?:\^0|\d*)\.(?:0|\d*)\.(?:0|\d*)/gi) || ['4.1.14', '4.1.14', '0.4.24']

  return {
    truffleVersion: version[0],
    truffleCoreVersion: version[1],
    solcVersion: version[2]
  }
}

const createObjectVersion = (strategy, content) => {
  try {
    const strategiesAllowed = ['Dutch', 'MintedCapped']
    if (!strategiesAllowed.includes(strategy)) {
      throw new Error('Strategy doesnt exist')
    }

    const destinyPath = path.join(__dirname, `../${directory}/metadata/${strategy}TruffleVersions.json`)

    writeFile(destinyPath, content, err => {
      if (err) {
        console.log(`Error creating version file`, err)
      } else {
        console.log(`Move ${destinyPath} this content ${JSON.stringify(content)}`)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const strategiesToMove = ['Dutch', 'MintedCapped']

for (let strategy of strategiesToMove) {
  const objectVersion = getObjectVersion(strategy)
  createObjectVersion(strategy, objectVersion)
}
