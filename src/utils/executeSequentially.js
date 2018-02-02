/**
 * Executes sequentially a list of promises
 * @param {Array} list - List of promises to be executed
 * @returns {Promise} - If fails, returns the err with the index of the function in the list
 */
const executeSequentially = (list) => {
  return list.reduce((promise, fn, index) => {
    return promise.then(() => {
      return Promise.resolve()
        .then(() => fn())
        .catch((err) => Promise.reject([err, index]))
    })
  }, Promise.resolve())

}

export default executeSequentially
