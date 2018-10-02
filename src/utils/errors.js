export class Web3Error extends Error {
  constructor(data) {
    const { code, message } = data
    super(message)

    this.code = code
  }
}

export class CSVError extends Error {
  constructor(data) {
    const { code, body, message } = data
    super(message)

    this.code = code
    this.body = body
  }
}
