import 'dotenv/config'
import { pool, runMigrations } from './index'
import type { DayTruck, DayRoute, DayStop } from '../types'

const trucks: DayTruck[] = [
  { id: 'truck-1', label: 'LND-101' },
  { id: 'truck-2', label: 'LND-102' },
  { id: 'truck-3', label: 'LND-103' },
]

const routes: DayRoute[] = [
  { id: 'route-1', server_id: 'R-2024-001', truck_id: 'truck-1', name: 'Split - morning run' },
  { id: 'route-2', server_id: 'R-2024-002', truck_id: 'truck-1', name: 'Split - afternoon' },
  { id: 'route-3', server_id: 'R-2024-003', truck_id: 'truck-2', name: 'Zagreb - full day' },
]

const stops: DayStop[] = [
  {
    id: 'stop-1',
    name: 'Lindab Warehouse Split',
    latitude: 43.5081,
    longitude: 16.4402,
    address: 'Kneza Branimira 12, 21000 Split',
    contact: 'Marko Horvat, +385 21 123 456',
    route_id: 'route-1',
    delivery_notes: 'Deliver to loading dock B. Ring bell on arrival.',
    estimated_time: '10:30',
  },
  {
    id: 'stop-2',
    name: 'Building Supply Split',
    latitude: 43.523,
    longitude: 16.424,
    address: 'Domovinskog rata 8, 21000 Split',
    contact: 'Ana Jurić, +385 21 987 654',
    route_id: 'route-1',
    delivery_notes: 'Use side entrance. Contact site manager before unloading.',
    estimated_time: '11:15',
  },
  {
    id: 'stop-3',
    name: 'Construction Site Solin',
    latitude: 43.5394,
    longitude: 16.4931,
    address: 'Kralja Zvonimira 3, 21210 Solin',
    contact: 'Ivan Kovač, +385 21 555 123',
    route_id: 'route-1',
    delivery_notes: 'Leave pallets at gate. Security will sign.',
    estimated_time: '12:00',
  },
  {
    id: 'stop-4',
    name: 'HVAC Solutions Trogir',
    latitude: 43.5125,
    longitude: 16.2517,
    address: 'Riva 22, 21220 Trogir',
    contact: 'Marija Novak, +385 21 444 556',
    route_id: 'route-2',
    delivery_notes: 'Loading dock A. Call 15 min before arrival.',
    estimated_time: '09:00',
  },
  {
    id: 'stop-5',
    name: 'Green Building Kaštela',
    latitude: 43.55,
    longitude: 16.378,
    address: 'Splitska 45, 21212 Kaštel Stari',
    contact: 'Petra Milić, +385 21 777 889',
    route_id: 'route-2',
    delivery_notes: 'Deliver to receiving. Ask for delivery slip.',
    estimated_time: '10:45',
  },
  {
    id: 'stop-6',
    name: 'Industrial Park Omiš',
    latitude: 43.4447,
    longitude: 16.6886,
    address: 'Braće Radić 7, 21310 Omiš',
    contact: 'Luka Babić, +385 21 123 789',
    route_id: 'route-3',
    delivery_notes: 'Gate code: 4721. Unload at bay 3.',
    estimated_time: '08:30',
  },
  {
    id: 'stop-7',
    name: 'Ventilation Sinj',
    latitude: 43.7036,
    longitude: 16.6394,
    address: 'Trg kralja Tomislava 15, 21230 Sinj',
    contact: 'Tomislav Perić, +385 21 654 321',
    route_id: 'route-3',
    delivery_notes: 'Back entrance only. Ring intercom.',
    estimated_time: '11:00',
  },
]

async function seed() {
  await runMigrations()

  for (const t of trucks) {
    await pool.query(
      `INSERT INTO trucks (id, label) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label`,
      [t.id, t.label]
    )
  }
  for (const r of routes) {
    await pool.query(
      `INSERT INTO routes (id, server_id, truck_id, name) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET server_id = EXCLUDED.server_id, truck_id = EXCLUDED.truck_id, name = EXCLUDED.name`,
      [r.id, r.server_id, r.truck_id, r.name]
    )
  }
  for (const s of stops) {
    await pool.query(
      `INSERT INTO stops (id, name, latitude, longitude, address, contact, route_id, delivery_notes, estimated_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
         address = EXCLUDED.address, contact = EXCLUDED.contact, route_id = EXCLUDED.route_id,
         delivery_notes = EXCLUDED.delivery_notes, estimated_time = EXCLUDED.estimated_time`,
      [
        s.id,
        s.name,
        s.latitude,
        s.longitude,
        s.address,
        s.contact,
        s.route_id,
        s.delivery_notes,
        s.estimated_time,
      ]
    )
  }

  console.log('Seed complete: trucks, routes, stops.')
  await pool.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
