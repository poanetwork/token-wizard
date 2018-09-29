/**
 * Executes sequentially a list of promises
 * @param {Array} list - List of promises to be executed
 * @param {Number} startAt - index where to start list of functions execution
 * @param {Function} before - Callback which will be called before executing the fn()
 * @param {Function} after - Callback which will be called after executing the fn()
 * @returns {Promise} - If fails, returns the err with the index of the function in the list
 */
const executeSequentially = (list, startAt = 0, before = () => {}, after = () => {}) => {
  return list.slice(startAt).reduce((promise, fn, index) => {
    const overallIndex = startAt + index

    return promise.then(() => {
      return Promise.resolve()
        .then(async () => {
          before(overallIndex)
          await fn(overallIndex)
          after(overallIndex)
        })
        .catch(err => Promise.reject([err, overallIndex]))
    })
  }, Promise.resolve())
}

export default executeSequentially
