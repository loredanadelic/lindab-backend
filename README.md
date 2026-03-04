# Lindab Backend

Express mock API za Lindab delivery app. PostgreSQL baza, rute usklađene s app `services/api.ts`.

## Instalacija

```bash
cd lindab-backend
npm install
cp .env.example .env
```

U `.env` postavi `DATABASE_URL` (npr. `postgresql://user:password@localhost:5432/lindab`) ili varijable `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` (i po želji `PGPORT`).

## Kreiranje baze u PostgreSQLu (lokalna instalacija)

Bazu `lindab` trebaš kreirati u svom PostgreSQLu prije prvog pokretanja.

**Način 1 – naredba `createdb` (ako imaš u PATH-u):**
```bash
createdb -U postgres lindab
```
(Koristi svog PostgreSQL korisnika umjesto `postgres` ako je drugačije.)

**Način 2 – preko `psql`:**
```bash
psql -U postgres -c "CREATE DATABASE lindab;"
```

**Na macOS-u (Homebrew):** ako koristiš `brew services start postgresql`, obično se spajaš kao trenutni OS korisnik:
```bash
createdb lindab
# ili
psql -c "CREATE DATABASE lindab;"
```

U `.env` onda stavi korisnika i lozinku koji imaju pristup toj bazi, npr.:
```env
DATABASE_URL=postgresql://tvoj_user:tvoja_lozinka@localhost:5432/lindab
```

## Migracije i seed

Pri prvom pokretanju servera pokreću se migracije (tablice se kreiraju ako ne postoje). Seed podatke (kamioni, rute, stanice) učitaj ručno:

```bash
npm run seed
```

## Pokretanje

```bash
# development (ts-node-dev)
npm run dev

# production
npm run build && npm start
```

Server sluša na `http://localhost:3000` (ili `PORT` iz `.env`).

## Rute

| Metoda | Ruta | Opis |
|--------|------|------|
| GET | `/api/day?date=YYYY-MM-DD` | Dan podaci: trucks, routes, stops |
| POST | `/api/stops/events` | Body: `{ events: [{ stopId, eventType, payload, createdAt }] }` |
| POST | `/api/stops/delivery-updates` | Body: `{ events: [{ stopId, payload, createdAt }] }` |
| POST | `/api/stops/:stopId/events/locations/batch` | Body: `{ points: [{ user_id, latitude, longitude, recorded_at }] }` — `recorded_at` je ISO 8601 datetime string (npr. `"2025-03-03T14:30:00.000Z"`) |
| POST | `/api/sync/pull` | Body: `{ lastPulledAt?: number }` — delta sync |
| POST | `/api/sync/push` | Body: `{ changes: Record<string, unknown> }` — push client changes |
| GET | `/health` | Health check |

Autorizacija: opcionalno `Authorization: Bearer <userId>`.

## Povezivanje s appom

U rootu **lindab** projekta u `.env` dodaj:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Za Android emulator koristi `http://10.0.2.2:3000`. Za fizički uređaj na istoj mreži npr. `http://192.168.1.x:3000`.

Aplikacija koristi `EXPO_PUBLIC_API_URL` u `services/api.ts` za sve pozive; ako nije postavljen, ostaje mock (lokalni podaci bez servera).
