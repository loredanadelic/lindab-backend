import express from 'express'
import cors from 'cors'
import { authMiddleware } from './middleware/auth'
import dayRoutes from './routes/day'
import stopsRoutes from './routes/stops'
import syncRoutes from './routes/sync'

const app = express()

app.use(cors())
app.use(express.json())
app.use(authMiddleware)

app.use('/api', dayRoutes)
app.use('/api/stops', stopsRoutes)
app.use('/api/sync', syncRoutes)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'lindab-backend' })
})

export default app
