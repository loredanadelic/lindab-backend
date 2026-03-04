/** Matches app DayData / DayTruck / DayRoute / DayStop */
export type DayTruck = { id: string; label: string }

export type DayRoute = {
  id: string
  server_id: string
  truck_id: string
  name: string
}

export type DayStop = {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string | null
  contact: string | null
  route_id: string
  delivery_notes: string | null
  estimated_time: string | null
}

export type DayData = {
  trucks: DayTruck[]
  routes: DayRoute[]
  stops: DayStop[]
}

export type StopLifecycleEventPayload = {
  stopId: string
  eventType: string
  payload: string | null
  createdAt: number
}

export type StopDeliveryUpdatePayload = {
  stopId: string
  payload: string | null
  createdAt: number
}

export type GpsPointPayload = {
  user_id: string
  latitude: number
  longitude: number
  /** ISO 8601 datetime string (e.g. "2025-03-03T14:30:00.000Z") */
  recorded_at: string
}

export type SyncTableChange<T> = {
  created: T[]
  updated: T[]
  deleted: string[]
}

export type SyncPullResult = {
  changes: {
    trucks: SyncTableChange<Record<string, unknown>>
    routes: SyncTableChange<Record<string, unknown>>
    stops: SyncTableChange<Record<string, unknown>>
  }
  timestamp: number
}
