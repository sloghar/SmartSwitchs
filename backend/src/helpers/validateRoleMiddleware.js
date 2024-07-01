export function validateRole (roles) {
  return (req, res, next) => {
    const { role } = req.user

    if (roles.includes(role)) {
      next()
    } else {
      next(new Error('not valid role'))
    }
  }
}
