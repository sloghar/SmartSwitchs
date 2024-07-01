import { UserDoesNotExistsError, IncorrectPasswordError, UnathorizedError } from './AuthErrors.js'

export function errorHandler () {
  return (error, req, res, next) => {
    console.log(error)
    if (error.isJoi) {
      res.status(400).json({
        code: 400,
        message: error.message,
        data: []
      })
    } else if (error instanceof UserDoesNotExistsError) {
      res.status(401).json({
        code: 401,
        message: error.message,
        data: []
      })
    } else if (error instanceof IncorrectPasswordError) {
      res.status(401).json({
        code: 401,
        message: error.message,
        data: []
      })
    } else if (error instanceof UnathorizedError) {
      res.status(401).json({
        code: 401,
        message: error.message,
        data: []
      })
    } else {
      res.status(400).json({
        code: 400,
        message: 'bad request',
        data: []
      })
    }
  }
}
