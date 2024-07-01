import { pool } from './../config/dbConnection.js'

const MODES = {
  Switch: 1,
  Schedule: 2
}

export class SwitchService {
  /* static async showAll () {

  } */

  static async showAll ({ id }) {
    const query = 'SELECT id, mode_id AS mode, state, last_communication AS lastcommunication, alias FROM switchs WHERE user_id = $1'
    const values = [id]

    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      // TO DO
    }

    const switchs = results.rows.map(item => ({
      id: item.id,
      mode: item.mode,
      state: item.state,
      lastCommunication: item.lastcommunication,
      alias: item.alias
    }))

    return switchs
  }

  static async showOne ({ userId, switchId }) {
    const query = `SELECT switchs.id AS id, switchs.mode_id AS mode, switchs.state AS state, switchs.last_communication AS lastCommunication,
                   schedules.days AS days, schedules.start_at AS startAt, schedules.end_at AS endAt 
                   FROM switchs LEFT JOIN schedules ON switchs.id = schedules.switch_id 
                   WHERE switchs.user_id = $1 AND switchs.id = $2`
    const values = [userId, switchId]

    const results = await pool.query(query, values)

    if (results.rows.length === 0) {
      // TO DO
    }

    const data = results.rows[0]

    let response = {
      id: data.id,
      mode: data.mode,
      state: data.state,
      lastCommunication: data.lastCommunication
    }

    if (data.mode === MODES.Schedule) {
      response = {
        ...response,
        days: data.days,
        startAt: data.startAt,
        endAt: data.endAt
      }
    }

    return response
  }

  static async create ({ userId, macAddress, mode }) {
    const query = `INSERT INTO switchs (user_id, mac_address, mode_id) VALUES ($1, $2, $3) 
                  RETURNING id, created_at AS createdAt, updated_at AS updatedAt`
    const values = [userId, macAddress, mode]

    const results = await pool.query(query, values)

    if (results.rowCount !== 1) {
      // TO DO
    }

    const data = results.rows[0]

    return {
      id: data.id,
      macAddress,
      mode: mode === MODES.Switch ? 'switch' : 'schedule'
    }
  }

  static async delete ({ switchId }) {
    const query = 'DELETE FROM switchs WHERE id = $1'
    const values = [switchId]

    const results = await pool.query(query, values)

    if (results.rowCount === 1) {
      // TO DO
    }

    return {
      id: switchId
    }
  }

  static async changeState ({ userId, switchId, state }) {
    const query = `UPDATE switchs SET state = $1, is_updated = FALSE, updated_at = $2 WHERE id = $3 AND user_id = $4
                    RETURNING id, mode_id AS mode, state, last_communication AS lastcommunication`
    const values = [state === '1', new Date().toISOString(), switchId, userId]

    const results = await pool.query(query, values)

    if (results.rowCount === 1) {
      // TO DO
    }

    const data = results.rows[0]

    return {
      id: data.id,
      mode: data.mode,
      state: data.state,
      lastCommunication: data.lastcommunication
    }
  }

  static async changeMode ({ userId, switchId, mode }) {
    const query = `UPDATE switchs SET mode_id = $1, is_updated = FALSE, updated_at = $2 WHERE id = $3 AND user_id = $4
                    RETURNING id, mode_id AS mode, state, last_communication AS lastcommunication`
    const values = [mode, new Date().toISOString(), switchId, userId]

    const results = await pool.query(query, values)

    if (results.rowCount === 1) {
      // TO DO
    }

    const data = results.rows[0]

    return {
      id: data.id,
      mode: data.mode,
      state: data.state,
      lastCommunication: data.lastcommunication
    }
  }

  static async getSchedules ({ switchId }) {
    const query = 'SELECT id, days, start_at, end_at FROM schedules WHERE switch_id = $1'
    const values = [switchId]

    const results = await pool.query(query, values)

    if (results.rows.length !== 0) {
      // TO DO
    }

    const schedules = results.rows

    console.log(schedules)

    return schedules.map(schedule => ({
      id: schedule.id,
      days: schedule.days,
      startAt: schedule.startAt,
      endAt: schedule.endAt
    }))
  }

  static async createSchedule ({ switchId, days, startAt, endAt }) {
    let query = `INSERT INTO schedules (switch_id, days, start_at, end_at) VALUES ($1, $2, $3, $4)
                  RETURNING id, switch_id, days, start_at, end_at`
    let values = [switchId, days, startAt, endAt]

    const results = await pool.query(query, values)

    if (results.rowCount !== 1) {
      // TO DO
    }

    query = 'UPDATE switchs SET is_updated = FALSE WHERE id = $1'
    values = [switchId]

    const data = results.rows[0]
    const response = {
      id: data.id,
      switchId: data.switch_id,
      days: data.days,
      startAt: data.start_at,
      endAt: data.end_at
    }

    await pool.query(query, values)

    if (results.rowCount !== 1) {
      // TO DO
    }

    return response
  }

  static async deleteSchedule ({ scheduleId }) {
    const query = 'DELETE FROM schedules WHERE id = $1'
    const values = [scheduleId]

    const results = await pool.query(query, values)

    if (results.rowCount === 1) {
      // TO DO
    }

    return {
      scheduleId
    }
  }

  static async updateSchedule ({ scheduleId, switchId, days, startAt, endAt }) {
    const query = `UPDATE schedules SET days = $1, start_at = $2, end_at = $3, updated_at = $4 WHERE id = $5
                  RETURNING id, switch_id,days, start_at, end_at`
    const values = [days, startAt, endAt, new Date().toISOString(), scheduleId]

    const results = await pool.query(query, values)

    if (results.rowCount === 1) {
      // TO DO
    }

    const data = results.rows[0]

    return {
      id: data.id,
      switchId: data.switch_id,
      days: data.days,
      startAt: data.start_at,
      endAt: data.end_at
    }
  }

  static async getDeviceData ({ macAddress }) {
    let query = 'SELECT id, mode_id AS mode, state, is_updated FROM switchs WHERE mac_address = $1'
    let values = [macAddress]

    let results = await pool.query(query, values)

    if (results.rows.length === 0) {
      return {}
    }

    const data = results.rows[0]

    console.log(data)
    if (data.is_updated) {
      return {}
    }

    const response = {}

    if (data.mode === 1) {
      response.mode = 1
      response.state = data.state
    } else if (data.mode === 2) {
      response.mode = 2

      const query = 'SELECT days, start_at, end_at FROM schedules WHERE switch_id = $1'
      const values = [data.id]

      results = await pool.query(query, values)

      if (results.rows.length === 0) {
        response.schedules = []
      } else {
        response.schedules = results.rows.map(schedule => ({
          days: schedule.days,
          startAt: schedule.start_at,
          endAt: schedule.end_at
        }))
      }
    }

    query = 'UPDATE switchs SET is_updated = TRUE WHERE mac_address = $1'
    values = [macAddress]

    results = await pool.query(query, values)

    return response
  }
}
