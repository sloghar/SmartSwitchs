import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/dbConnection.js'
import { config } from '../config/config.js'
import { IncorrectPasswordError, UserDoesNotExistsError } from '../errors/AuthErrors.js'

export class AuthServices {
  static async login ({ email, password }) {
    const query = 'SELECT id, first_name, password, role_id FROM users WHERE email = $1'
    const values = [email]
    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      throw new UserDoesNotExistsError('user does not exists')
    }

    const { id, password: hash, first_name: firstName, role_id: role } = results.rows[0]

    const match = await bcrypt.compare(password, hash)

    if (match) {
      const payload = {
        sub: id,
        exp: Math.floor(Date.now() / 1000) + 60 * 15,
        role
      }

      const token = jwt.sign(payload, config.LOG_IN_SECRET_KEY)

      return { id, firstName, token }
    }

    throw new IncorrectPasswordError('password  is incorrect')
  }
}
