const fs = require('fs')

export const gasPriceValues = () => new Promise((resolve, reject) => {
  fs.readFile('src/utils/__mocks__/gasPrice.json', 'utf-8', (err, data) => {
    if (err) reject(err)
    resolve(JSON.parse(data))
  })
})
