import express from 'express'
import { router as authRoutes } from './auth.routes.js'
import { router as userRoutes } from './user.routes.js'
import { router as deviceRouter } from './device.routes.js'

const router = express.Router()

export function appRoutes ({ app }) {
  router.use('/device', deviceRouter)
  router.use('/auth', authRoutes)
  router.use('/user', userRoutes)
  app.use('/api/v1', router)
}
