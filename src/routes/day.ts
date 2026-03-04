import { Router } from 'express'
import { pool } from '../db'
import type { DayData } from '../types'

const router = Router()

/** GET /api/day?date=YYYY-MM-DD — trucks, routes, stops for the day */
router.get('/day', async (_req, res) => {
  const date = (_req.query.date as string) || new Date().toISOString().slice(0, 10)
  // For mock we ignore date and return full snapshot
  const trucksResult = await pool.query('SELECT id, label FROM trucks')
  const routesResult = await pool.query(
    'SELECT id, server_id, truck_id, name FROM routes'
  )
  const stopsResult = await pool.query(
    'SELECT id, name, latitude, longitude, address, contact, route_id, delivery_notes, estimated_time FROM stops'
  )

  const dayData: DayData = {
    trucks: trucksResult.rows as DayData['trucks'],
    routes: routesResult.rows as DayData['routes'],
    stops: stopsResult.rows as DayData['stops'],
  }
  res.json(dayData)
})

export default router
