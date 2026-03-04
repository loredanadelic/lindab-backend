# Lindab Backend

Express mock API for the Lindab delivery app. PostgreSQL database, routes aligned with app `services/api.ts`.

## Installation

```bash
cd lindab-backend
npm install
cp .env.example .env
```

In `.env` set `DATABASE_URL` (e.g. `postgresql://user:password@localhost:5432/lindab`) or the variables `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (and optionally `PGPORT`).

## Creating the database (local PostgreSQL)

Create the `lindab` database in your PostgreSQL instance before first run.

**Option 1 – `createdb` (if in PATH):**
```bash
createdb -U postgres lindab
```
(Use your PostgreSQL user instead of `postgres` if different.)

**Option 2 – via `psql`:**
```bash
psql -U postgres -c "CREATE DATABASE lindab;"
```

**On macOS (Homebrew):** if you use `brew services start postgresql`, you usually connect as the current OS user:
```bash
createdb lindab
# or
psql -c "CREATE DATABASE lindab;"
```

Then in `.env` set the user and password that can access that database, e.g.:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/lindab
```

## Migrations and seed

On first start the server runs migrations (tables are created if missing). Load seed data (trucks, routes, stops) manually:

```bash
npm run seed
```

## Running

```bash
# development (ts-node-dev)
npm run dev

# production
npm run build && npm start
```

Server listens on `http://localhost:3000` (or `PORT` from `.env`).

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/day?date=YYYY-MM-DD` | Day data: trucks, routes, stops |
| POST | `/api/stops/events` | Body: `{ events: [{ stopId, eventType, payload, createdAt }] }` |
| POST | `/api/stops/delivery-updates` | Body: `{ events: [{ stopId, payload, createdAt }] }` |
| POST | `/api/stops/:stopId/events/locations/batch` | Body: `{ points: [{ user_id, latitude, longitude, recorded_at }] }` — `recorded_at` is ISO 8601 datetime string (e.g. `"2025-03-03T14:30:00.000Z"`) |
| GET | `/health` | Health check |

Auth: optional `Authorization: Bearer <userId>`.

## Connecting the app

In the **lindab** project root add to `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For Android emulator use `http://10.0.2.2:3000`. For a physical device on the same network use e.g. `http://192.168.1.x:3000`.

The app uses `EXPO_PUBLIC_API_URL` in `services/api.ts` for all requests; if unset, it falls back to mock (local data, no server).
