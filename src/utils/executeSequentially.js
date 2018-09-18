import logdown from 'logdown'

/**
 * Executes sequentially a list of promises
 * @param {Array} list - List of promises to be executed
 * @param {Number} startAt - index where to start list of functions execution
 * @param {Function} cb - Callback which will be called with the overall index being executed
 * @returns {Promise} - If fails, returns the err with the index of the function in the list
 */
const executeSequentially = (list, startAt = 0, cb = () => {}) => {
  const logger = logdown('TW:utils:executeSequentially')

  return list.slice(startAt).reduce((promise, fn, index) => {
    const overallIndex = startAt + index
    logger.log('overallIndex:', overallIndex)

    return promise.then(() => {
      return Promise.resolve()
        .then(async () => {
          const txHash = await fn()
          logger.log('txHash:', txHash)

          cb(overallIndex, txHash)
        })
        .catch(err => Promise.reject([err, overallIndex]))
    })
  }, Promise.resolve())
}

export default executeSequentially
