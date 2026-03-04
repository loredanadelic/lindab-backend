import 'dotenv/config'
import app from './app'
import { runMigrations } from './db'

const PORT = Number(process.env.PORT) || 3000

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Lindab API running at http://localhost:${PORT}`)
      console.log(`  GET  /api/day?date=YYYY-MM-DD`)
      console.log(`  POST /api/stops/events`)
      console.log(`  POST /api/stops/delivery-updates`)
      console.log(`  POST /api/stops/:stopId/events/locations/batch`)
      console.log(`  POST /api/sync/pull`)
      console.log(`  POST /api/sync/push`)
    })
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err)
    process.exit(1)
  })
