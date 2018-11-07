export function fetchFile(path) {
  return new Promise(function(resolve, reject) {
    const validRoutes = [
      './contracts/MintedCappedProxy.sol',
      './contracts/MintedCappedProxy.bin',
      './contracts/DutchProxy.sol',
      './contracts/DutchProxy.bin'
    ]
    if (!validRoutes.includes(path)) {
      reject('invalid route')
    } else {
      const fileContent = require(`../../../public/${path}`)
      resolve(fileContent)
    }
  })
}
