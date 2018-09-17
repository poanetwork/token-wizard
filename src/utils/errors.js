export class Web3Error extends Error {
  constructor(data) {
    const { code, message } = data
    super(message)

    this.code = code
  }
}
