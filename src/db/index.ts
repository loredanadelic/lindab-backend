import { Pool, PoolClient } from 'pg'

const connectionString =
  process.env.DATABASE_URL ||
  (process.env.PGHOST && {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432', 10),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'lindab',
  })

if (!connectionString) {
  throw new Error(
    'Set DATABASE_URL or PGHOST, PGUSER, PGPASSWORD (and optionally PGPORT, PGDATABASE)'
  )
}

export const pool = new Pool(
  typeof connectionString === 'string'
    ? { connectionString }
    : connectionString
)

const migrationStatements = [
  `CREATE TABLE IF NOT EXISTS trucks (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    server_id TEXT NOT NULL,
    truck_id TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (truck_id) REFERENCES trucks(id)
  )`,
  `CREATE TABLE IF NOT EXISTS stops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    contact TEXT,
    route_id TEXT NOT NULL,
    delivery_notes TEXT,
    estimated_time TEXT,
    FOREIGN KEY (route_id) REFERENCES routes(id)
  )`,
  `CREATE TABLE IF NOT EXISTS stop_lifecycle_events (
    id SERIAL PRIMARY KEY,
    stop_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    received_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
  )`,
  `CREATE TABLE IF NOT EXISTS stop_delivery_updates (
    id SERIAL PRIMARY KEY,
    stop_id TEXT NOT NULL,
    payload TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    received_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
  )`,
  `CREATE TABLE IF NOT EXISTS gps_points (
    id SERIAL PRIMARY KEY,
    stop_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    received_at BIGINT DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
  )`,
  `CREATE TABLE IF NOT EXISTS stop_delivery_info (
    stop_id TEXT PRIMARY KEY,
    signature TEXT,
    images TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS stop_lifecycle_state (
    stop_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
]

export async function runMigrations(): Promise<void> {
  const client = await pool.connect()
  try {
    for (const sql of migrationStatements) {
      await client.query(sql)
    }
    // Migrate gps_points.recorded_at from BIGINT (ms) to TIMESTAMPTZ if needed
    const col = await client.query(
      `SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gps_points' AND column_name = 'recorded_at'`
    )
    if (col.rows[0]?.data_type === 'bigint') {
      await client.query(
        `ALTER TABLE gps_points ALTER COLUMN recorded_at TYPE TIMESTAMPTZ USING to_timestamp(recorded_at / 1000.0) AT TIME ZONE 'UTC'`
      )
    }
    // Migrate stop_lifecycle_events.created_at from BIGINT (ms) to TIMESTAMPTZ if needed
    const lifecycleCol = await client.query(
      `SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stop_lifecycle_events' AND column_name = 'created_at'`
    )
    if (lifecycleCol.rows[0]?.data_type === 'bigint') {
      await client.query(
        `ALTER TABLE stop_lifecycle_events ALTER COLUMN created_at TYPE TIMESTAMPTZ USING to_timestamp(created_at / 1000.0) AT TIME ZONE 'UTC'`
      )
    }
    // Migrate stop_delivery_updates.created_at from BIGINT (ms) to TIMESTAMPTZ if needed
    const deliveryCol = await client.query(
      `SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stop_delivery_updates' AND column_name = 'created_at'`
    )
    if (deliveryCol.rows[0]?.data_type === 'bigint') {
      await client.query(
        `ALTER TABLE stop_delivery_updates ALTER COLUMN created_at TYPE TIMESTAMPTZ USING to_timestamp(created_at / 1000.0) AT TIME ZONE 'UTC'`
      )
    }
  } finally {
    client.release()
  }
}

/** Run multiple queries in a transaction. */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export default pool
