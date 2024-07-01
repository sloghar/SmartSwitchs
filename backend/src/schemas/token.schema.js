import Joi from 'joi'

const sub = Joi.string().guid({
  version: [
    'uuidv4'
  ]
})
const role = Joi.valid('client', 'admin')
const exp = Joi.date().timestamp('unix')
const iat = Joi.date().timestamp('unix')

export const tokenValidateSchema = Joi.object({
  sub: sub.required(),
  role: role.required(),
  exp: exp.required(),
  iat: iat.required()
})
