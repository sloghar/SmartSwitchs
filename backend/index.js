import express from 'express'
import { config } from './src/config/config.js'
import { appRoutes } from './src/routes/index.routes.js'
import { errorHandler } from './src/errors/errors.js'

const app = express()
app.disable('x-powered-by')

app.use(express.json())

appRoutes({ app })

app.use(errorHandler())

app.listen(config.PORT, () => {
  console.log(`server listening on http://localhost:${config.PORT}`)
})
