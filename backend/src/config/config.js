import * as dotenv from 'dotenv'

dotenv.config()

export const config = {
  PORT: process.env.PORT ?? 8080,
  DB_NAME: process.env.DB_NAME ?? 'smart_switchs',
  DB_USER: process.env.DB_USER ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '1234',
  DB_PORT: process.env.DB_PORT ?? 5432,
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  LOG_IN_SECRET_KEY: 'jGouei5nMQ3cFfPbEmBNIWKqxA27Ysl4'
}
