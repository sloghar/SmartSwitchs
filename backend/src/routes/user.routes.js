import express from 'express'
import { UserServices } from './../services/user.services.js'
import { validate } from './../helpers/validationMiddleware.js'
import { createUserSchema, deleteUserSchema } from './../schemas/user.schemas.js'
import { validateToken } from '../helpers/validateTokenMiddleware.js'
import { tokenValidateSchema } from '../schemas/token.schema.js'
import { validateRole } from '../helpers/validateRoleMiddleware.js'
import { SwitchService } from '../services/switch.services.js'

export const router = express.Router()

router.get(
  '/',
  validateToken(),
  validate(tokenValidateSchema, 'user'),
  validateRole(['admin']),
  async (req, res, next) => {
    try {
      const users = await UserServices.showAll()
      res.status(200).json({
        code: 200,
        message: 'success',
        data: users
      })
    } catch (error) {
      next(error)
    }
  }
)

router.get(
  '/:id',
  validateToken(),
  validate(tokenValidateSchema, 'user'),
  validateRole(['client', 'admin']),
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { id } = req.params

    // TO DO: verificar que el sub del token sea igual al id de la url

    try {
      const user = await UserServices.show({ id })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: [user]
      })
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/',
  validate(createUserSchema, 'body'),
  async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body

    try {
      const newUser = await UserServices.create({
        firstName,
        lastName,
        email,
        password
      })

      res.status(201).json({
        code: 201,
        message: 'created',
        data: [
          newUser
        ]
      })
    } catch (error) {
      next(error)
    }
  })

router.delete(
  '/:id',
  validateToken(),
  validate(tokenValidateSchema, 'user'),
  validateRole(['admin']),
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { id } = req.params

    try {
      const deletedUser = await UserServices.destroy({ id })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: [deletedUser]
      })
    } catch (error) {
      next(error)
    }
  }

)

// se obtienen los switch de un usuario
router.get(
  '/:id/switchs',
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { id } = req.params

    try {
      const switchs = await SwitchService.showAll({ id })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: switchs
      })
    } catch (error) {
      next(error)
    }
  })

// se crea un switch a un usuario
router.post(
  '/:id/switchs',
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { id } = req.params
    const { macAddress, mode } = req.body

    try {
      const newSwitch = await SwitchService.create({ userId: id, macAddress, mode })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: [newSwitch]
      })
    } catch (error) {
      next(error)
    }
  })

// para borrar un switch de un usuario
router.delete('/:userId/switchs/:switchId', async (req, res, next) => {
  const { userId, switchId } = req.params
  try {
    const deletedSwitch = await SwitchService.delete({ switchId })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [deletedSwitch]
    })
  } catch (error) {
    next(error)
  }
})

// se obtiene un switch de un usuario
router.get(
  '/:userId/switchs/:switchId',
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { userId, switchId } = req.params

    try {
      const oneSwitch = await SwitchService.showOne({ userId, switchId })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: [oneSwitch]
      })
    } catch (error) {
      next(error)
    }
  })

// TO DO: ruta para cambiar modo a switch
router.post('/:userId/switchs/:switchId/mode/:mode', async (req, res, next) => {
  const { userId, switchId, mode } = req.params
  console.log({ userId, switchId, mode })
  try {
    const newMode = await SwitchService.changeMode({ userId, switchId, mode })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [newMode]
    })
  } catch (error) {
    next(error)
  }
})

// TO DO: ruta para cambiar el estado a un switch en modo switch
router.post('/:userId/switchs/:switchId/state/:state', async (req, res, next) => {
  const { userId, switchId, state } = req.params
  try {
    const newState = await SwitchService.changeState({ userId, switchId, state })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [newState]
    })
  } catch (error) {
    next(error)
  }
})

// TO DO: ruta para obtener los schedules de un switch
router.get('/:userId/switchs/:switchId/schedule', async (req, res, next) => {
  const { userId, switchId } = req.params
  try {
    const schedules = await SwitchService.getSchedules({ switchId })
    console.log(schedules)
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [schedules]
    })
  } catch (error) {
    next(error)
  }
})

// TO DO: ruta para crear horario a un switch
router.post('/:userId/switchs/:switchId/schedule', async (req, res, next) => {
  const { userId, switchId } = req.params
  const { days, startAt, endAt } = req.body
  try {
    const newSchedule = await SwitchService.createSchedule({ userId, switchId, days, startAt, endAt })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [newSchedule]
    })
  } catch (error) {
    next(error)
  }
})

// TO DO: ruta para eliminar horario
router.delete('/:userId/switchs/:switchId/schedule/:scheduleId', async (req, res, next) => {
  const { userId, switchId, scheduleId } = req.params
  try {
    const deletedSchedule = await SwitchService.deleteSchedule({ scheduleId })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [deletedSchedule]
    })
  } catch (error) {
    next(error)
  }
})

// TO DO: ruta para actualizar horario
router.patch('/:userId/switchs/:switchId/schedule/:scheduleId', async (req, res, next) => {
  const { userId, switchId, scheduleId } = req.params
  const { days, startAt, endAt } = req.body

  try {
    const updatedSchedule = await SwitchService.updateSchedule({ scheduleId, switchId, days, startAt, endAt })
    res.status(200).json({
      code: 200,
      message: 'success',
      data: [updatedSchedule]
    })
  } catch (error) {
    next(error)
  }
})

/* router.post(
  '/:userId/switchs/:switchId'
  validate(deleteUserSchema, 'params'),
  async (req, res, next) => {
    const { userId, switchId } = req.params

    try {
      const oneSwitch = await SwitchService.showOne({ userId, switchId })
      res.status(200).json({
        code: 200,
        message: 'success',
        data: [oneSwitch]
      })
    } catch (error) {
      next(error)
    }
  } ) */

/* router.get('/create/admin', (req, res, next) => {
  UserServices.createAdmin()

  res.status(200).json({})
})
*/

/* router.patch(
  '/:id',
  validate(deleteUserSchema, 'params'),
  validate('body'),
  async (req, res, next) => {
    const { id } = req.params
  }
)
*/
