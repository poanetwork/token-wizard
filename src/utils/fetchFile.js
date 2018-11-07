export function fetchFile(path) {
  return new Promise((resolve, reject) => {
    const rawFile = new XMLHttpRequest()

    rawFile.addEventListener('error', reject)
    rawFile.open('GET', path, true)
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status === 0)) {
        let allText = rawFile.responseText
        resolve(allText)
      }
    }
    rawFile.send(null)
  })
}
