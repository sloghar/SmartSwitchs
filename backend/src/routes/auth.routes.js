import express from 'express'
import { AuthServices } from './../services/auth.services.js'
import { loginSchema } from './../schemas/auth.schemas.js'

export const router = express.Router()

router.post('/login', async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({
      code: 401,
      message: 'unathorized',
      data: []
    })
    return
  }

  const [type, base64] = req.headers.authorization.split(' ')

  if (type !== 'Basic') {
    res.status(401).json({
      code: 401,
      message: 'unathorized',
      data: []
    })
    return
  }

  const [email, password] = Buffer.from(base64, 'base64').toString().split(':')

  const { error } = loginSchema.validate({ email, password }, { abortEarly: false })

  if (error) {
    res.status(400).json({
      code: 400,
      message: error.message,
      data: []
    })
    return
  }

  try {
    const token = await AuthServices.login({ email, password })
    res.json({
      code: 200,
      message: 'success',
      data: [
        token
      ]
    })
  } catch (error) {
    next(error)
  }
})

router.post('/validate', (req, res, next) => {

})
