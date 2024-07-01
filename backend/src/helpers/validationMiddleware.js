export function validate (schema, param) {
  return (req, res, next) => {
    const data = req[param]
    const { error } = schema.validate(data, { abortEarly: false })

    if (error) {
      next(error)
    }

    next()
  }
}
