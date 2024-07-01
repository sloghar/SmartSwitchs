import express from 'express'
import { SwitchService } from '../services/switch.services.js'

export const router = express.Router()

router.get('/:macAddress', async (req, res, next) => {
  const { macAddress } = req.params

  try {
    const deviceData = await SwitchService.getDeviceData({ macAddress })

    console.log(deviceData)

    deviceData.timestamp = Math.floor(Date.now() / 1000)

    res.status(200).json({
      code: 200,
      message: 'success',
      data: [deviceData]
    })
  } catch (error) {

  }
})
