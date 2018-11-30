export async function fetchFile(path) {
  let response = await fetch(path)
  let data = await response.text()
  return data
}
