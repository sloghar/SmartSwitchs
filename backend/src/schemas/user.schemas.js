import Joi from 'joi'

const id = Joi.string().guid({
  version: [
    'uuidv4'
  ]
})
const email = Joi.string().email()
const password = Joi.string().min(8).max(32)
const firstName = Joi.string().min(3).max(16)
const lastName = Joi.string().min(6).max(16)

export const createUserSchema = Joi.object({
  firstName: firstName.required(),
  lastName: lastName.required(),
  email: email.required(),
  password: password.required()
})

export const deleteUserSchema = Joi.object({
  id: id.required()
})

export const updateUserSchema = Joi.object({
  firstName,
  lastName,
  email,
  password
})
