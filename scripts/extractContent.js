const fs = require('fs')
const fileName = process.argv.slice(2)[0]

const extractContent = fileName => {
  fs.readFile('../public/contracts/' + fileName + '.json', (err, file) => {
    if (err) throw err
    fs.writeFileSync('../public/contracts/' + fileName + '.abi', JSON.stringify(JSON.parse(file.toString()).abi))
    fs.writeFileSync('../public/contracts/' + fileName + '.bin', JSON.parse(file.toString()).bytecode.replace('0x', ''))
  })
}

try {
  extractContent(fileName)
} catch (e) {
  console.error(e)
}
