class TestUtils {
  sleep = (ms = 16) => {
    return (...args) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          const [ firstArg ] = args
          if (firstArg instanceof Error) {
            reject(...args)
          } else {
            resolve(...args)
          }
        }, ms)
      })
    }
  }

  defer = () => {
    let resolve, reject
    const promise = new Promise(function () {
      resolve = arguments[0]
      reject = arguments[1]
    })
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    }
  }
}

export default new TestUtils()
