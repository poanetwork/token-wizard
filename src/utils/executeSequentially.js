/**
 * Executes sequentially a list of promises
 * @param {Array} list - List of promises to be executed
 * @returns {Promise} - If fails, returns the err with the index of the function in the list
 */
const executeSequentially = (list, startAt = 0, cb = () => {}) => {
  return list.slice(startAt).reduce((promise, fn, index) => {
    return promise.then(() => {
      return Promise.resolve()
        .then(() => {
          cb(startAt + index)
          return fn()
        })
        .catch((err) => Promise.reject([err, startAt + index]))
    })
  }, Promise.resolve())

}

export default executeSequentially
