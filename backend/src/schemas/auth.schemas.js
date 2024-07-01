import Joi from 'joi'

const email = Joi.string().email()
const password = Joi.string().min(8).max(32)

export const loginSchema = Joi.object({
  email: email.required(),
  password: password.required()
})
