export const gasPriceValues = (endpoint = 'gasPrice') => {
  return new Promise((resolve, reject) => {
    try {
      const data = require(`./${endpoint}`)
      resolve(data)
    } catch (e) {
      reject('no data')
    }
  })
}
