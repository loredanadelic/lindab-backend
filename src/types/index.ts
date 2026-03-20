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

export type DayDeliveryInfo = {
  stop_id: string
  name: string | null
  signature: string | null
  images: string | null
  description: string | null
  deviation: string | null
  created_at: string
  updated_at: string
}

export type DayArrivalDeparture = {
  stop_id: string
  arrival_time: string | null
  departure_time: string | null
}

export type DayData = {
  trucks: DayTruck[]
  routes: DayRoute[]
  stops: DayStop[]
  delivery_info: DayDeliveryInfo[]
  arrival_departure: DayArrivalDeparture[]
}

export type StopLifecycleEventPayload = {
  stopId: string
  eventType: string
  payload: string | null
  /** ISO 8601 datetime string (e.g. "2025-03-04T14:30:00.000Z") */
  createdAt: string
}

export type StopDeliveryUpdatePayload = {
  stopId: string
  payload: string | null
  /** ISO 8601 datetime string (e.g. "2025-03-04T14:30:00.000Z") */
  createdAt: string
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

/** GET /api/trucks response item */
export type TruckApi = {
  volume1: number
  volume2: number
  name: string
  description: string
  carrierCompany: string
  length1: number
  width1: number
  height1: number
  weight1: number
  length2: number
  width2: number
  height2: number
  weight2: number
  extHeight: number
  totalLength: number
  timeAdjustment: number
  other: string
  dataAreaID: string
  companyID: string
  active: boolean
}

/** GET /api/routes?carrierId=&departureDate= response item */
export type RouteListItemApi = {
  carrierCarNumber: string
  route: string
  routeID: number
  carrierArrivalTime?: string
  startTime?: string | null
  startTimeString?: string | null
  endTime?: string | null
  endTimeString?: string | null
  drivingTime: string
  estimatedLoadingTime: string
  totalTime: string
  break: string
  distance: number
  stops: number
  fillRatio: number
  timeAdjustment: number
  volume: number
  loadMeter: number
  weight: number
  maxLength: number
  status: number
  statusImage?: string
}

/** GET /api/routes/:routeID response stop item */
export type StopApi = {
  shipmentMasterID: string
  zipCode: string
  deliveryMode: string
  requestedUnloadingTime: string | null
  deliveryInformation: string
  telePhoneAlert: string
  deliveryName: string
  deliveryStreet: string
  goodsReceiver: string
  goodsReceiverPhone: string
  volume: string
  weight: number
  calculatedArrivalTime: string | null
  calculatedArrivalTimeString: string | null
  distance: number
  arrived: boolean
  departed: boolean
  lat: number
  lon: number
  billOfLadingID: string
  transportStatus: number
  plannedSequence: number
}

/** GET /api/routes/:routeID response */
export type RouteDetailApi = {
  totalDistance: number
  totalTime: number
  stops: StopApi[]
}
