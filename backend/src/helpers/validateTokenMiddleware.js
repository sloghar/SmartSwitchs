import jwt from 'jsonwebtoken'
import { UnathorizedError } from '../errors/AuthErrors.js'
import { config } from '../config/config.js'

const roles = [undefined, 'client', 'admin']

export function validateToken () {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      next(new UnathorizedError('token is neccesary'))
    }

    const [type, token] = req.headers.authorization.split(' ')

    if (type !== 'Bearer') {
      next(new UnathorizedError('token is neccesary'))
    }

    if (!token) {
      next(new UnathorizedError('token is neccesary'))
    }

    try {
      const payload = jwt.verify(token, config.LOG_IN_SECRET_KEY)
      req.user = {
        ...payload,
        role: roles[payload.role]
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
