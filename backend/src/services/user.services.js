import bcrypt from 'bcrypt'
import { pool } from '../config/dbConnection.js'
import { UserDoesNotExistsError } from '../errors/AuthErrors.js'

export class UserServices {
  static async showAll () {
    const query = 'SELECT * FROM users'
    const values = []

    const results = await pool.query(query, values)

    return results.rows.map(result => (
      {
        id: result.id,
        firstName: result.first_name,
        lastName: result.last_name,
        email: result.email,
        role: result.role_id === 1 ? 'client' : 'admin',
        createdAt: result.created_at,
        updatedAt: result.updated_at
      }
    ))
  }

  static async show ({ id }) {
    const query = 'SELECT * FROM users WHERE id = $1'
    const values = [id]

    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      throw new UserDoesNotExistsError()
    }

    const user = results.rows[0]

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role_id === 1 ? 'client' : 'admin',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  }

  static async create ({ firstName, lastName, email, password }) {
    const hash = await bcrypt.hash(password, 10)
    const query = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3 , $4)
                    RETURNING id, created_at, updated_at`
    const values = [firstName, lastName, email, hash]

    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      // TO DO
    }

    return {
      id: results.rows[0].id,
      firstName,
      lastName,
      email,
      createdAt: results.rows[0].created_at,
      updatedAt: results.rows[0].updated_at
    }
  }

  static async destroy ({ id }) {
    const query = 'DELETE FROM users WHERE id = $1'
    const values = [id]

    const results = await pool.query(query, values)

    console.log(results)

    if (results.command !== 'DELETE' || results.rowCount !== 1) {
      throw new Error('something went wrong')
    }

    return {
      id
    }
  }

  static async createAdmin () {
    const hash = await bcrypt.hash('123456789', 10)
    const query = `INSERT INTO users (first_name, last_name, email, password, role_id) VALUES ($1, $2, $3 , $4, $5)
                    RETURNING id, created_at, updated_at`
    const values = ['Carlos', 'Alvarez', 'admin@mail.com', hash, 2]

    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      // TO DO
    }

    return true
  }
}
