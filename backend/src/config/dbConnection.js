import pg from 'pg'
import { config } from './config.js'

const { Pool } = pg

const DB_NAME = config.DB_NAME
const DB_USER = config.DB_USER
const DB_PASSWORD = config.DB_PASSWORD
const DB_PORT = config.DB_PORT
const DB_HOST = config.DB_HOST

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const pool = new Pool({
  connectionString
})
