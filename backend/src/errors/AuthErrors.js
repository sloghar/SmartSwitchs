export class UserDoesNotExistsError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UserDoesNotExistsError'
  }
}

export class IncorrectPasswordError extends Error {
  constructor (message) {
    super(message)
    this.name = 'IncorrectPasswordError '
  }
}

export class UnathorizedError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnathorizedError'
  }
}
