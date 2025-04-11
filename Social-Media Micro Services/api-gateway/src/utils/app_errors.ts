class AppError extends Error {
  status: number
  override name: string
  constructor({ message, status = 500 }: { message: string; status: number }) {
    super(message)
    this.status = status
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
