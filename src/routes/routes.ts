import { Router } from "express";
import type { RouteListItemApi, RouteDetailApi } from "../types";
import { withTransaction } from "../db";
import type { GpsPointPayload } from "../types";

const router = Router();

const MOCK_ROUTES_BY_CARRIER: Record<
  string,
  Record<string, RouteListItemApi[]>
> = {
  TestTruck1: {
    "2026-03-11": [
      {
        carrierCarNumber: "TestTruck1",
        route: "Rebin",
        routeID: 414994,
        carrierArrivalTime: "A",
        startTime: "2026-03-11T10:35:29",
        startTimeString: "2026-03-11 11:35:29",
        endTime: "2026-03-11T11:03:26",
        endTimeString: "2026-03-11 12:03:26",
        drivingTime: "03:34:00",
        estimatedLoadingTime: "01:20:00",
        totalTime: "04:54:00",
        break: "01:10:00",
        distance: 239.0,
        stops: 5,
        fillRatio: 0.0,
        timeAdjustment: 120,
        volume: 0.0,
        loadMeter: 0.0,
        weight: 0.0,
        maxLength: 0,
        status: 6,
        statusImage: "../Images/Status48/14.png",
      },
      {
        carrierCarNumber: "TestTruck1",
        route: "Malmö",
        routeID: 414995,
        carrierArrivalTime: "A",
        startTime: "2026-03-11T08:00:00",
        startTimeString: "2026-03-11 09:00:00",
        endTime: "2026-03-11T14:00:00",
        endTimeString: "2026-03-11 15:00:00",
        drivingTime: "03:34:00",
        estimatedLoadingTime: "01:20:00",
        totalTime: "04:54:00",
        break: "01:10:00",
        distance: 239.0,
        stops: 5,
        fillRatio: 0.0,
        timeAdjustment: 120,
        volume: 0.0,
        loadMeter: 0.0,
        weight: 0.0,
        maxLength: 0,
        status: 1,
        statusImage: "../Images/Status48/1.png",
      },
    ],
  },
  TestTruck2: {
    "2026-03-11": [],
  },
};

const MOCK_ROUTE_DETAIL: Record<string, RouteDetailApi> = {
  "414994": {
    totalDistance: 239,
    totalTime: 294,
    stops: [
      {
        shipmentMasterID: "Start",
        zipCode: "26962 Grevie",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Lindab AB",
        deliveryStreet: "Järnvägsgatan 42",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T10:35:29",
        calculatedArrivalTimeString: "2026-03-11 11:35:29",
        distance: 0,
        arrived: true,
        departed: true,
        lat: 56.391629,
        lon: 12.782725,
        billOfLadingID: "",
        transportStatus: 7,
        plannedSequence: 0,
      },
      {
        shipmentMasterID: "SHPM-1",
        zipCode: "215 32 Malmö",
        deliveryMode: "Delivery",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Reeinvent",
        deliveryStreet: "Hyllie Stationsväg 31",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T10:55:54",
        calculatedArrivalTimeString: "2026-03-11 11:55:54",
        distance: 114,
        arrived: true,
        departed: true,
        lat: 55.5622105,
        lon: 12.9754811,
        billOfLadingID: "",
        transportStatus: 7,
        plannedSequence: 1,
      },
      // {
      //   shipmentMasterID: "Rast",
      //   zipCode: " ",
      //   deliveryMode: "",
      //   requestedUnloadingTime: null,
      //   deliveryInformation: ", ",
      //   telePhoneAlert: "",
      //   deliveryName: "Break 30 min",
      //   deliveryStreet: "",
      //   goodsReceiver: "",
      //   goodsReceiverPhone: "",
      //   volume: "0ldm",
      //   weight: 0.0,
      //   calculatedArrivalTime: "2026-03-11T11:02:39",
      //   calculatedArrivalTimeString: "2026-03-11 12:02:39",
      //   distance: 0,
      //   arrived: true,
      //   departed: true,
      //   lat: 0.0,
      //   lon: 0.0,
      //   billOfLadingID: "",
      //   transportStatus: 7,
      //   plannedSequence: 2,
      // },
      {
        shipmentMasterID: "Loading",
        zipCode: "224 78 Lund",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "CityMail Sweden AB",
        deliveryStreet: "Skiffervägen 34",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T11:03:08",
        calculatedArrivalTimeString: "2026-03-11 12:03:08",
        distance: 25,
        arrived: true,
        departed: true,
        lat: 55.69312826,
        lon: 13.21387254,
        billOfLadingID: "",
        transportStatus: 7,
        plannedSequence: 3,
      },
      {
        shipmentMasterID: "Stop",
        zipCode: "26962 Grevie",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Lindab AB",
        deliveryStreet: "Järnvägsgatan 42",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T11:03:26",
        calculatedArrivalTimeString: "2026-03-11 12:03:26",
        distance: 100,
        arrived: true,
        departed: true,
        lat: 56.391629,
        lon: 12.782725,
        billOfLadingID: "",
        transportStatus: 7,
        plannedSequence: 4,
      },
    ],
  },
  "414995": {
    totalDistance: 239,
    totalTime: 294,
    stops: [
      {
        shipmentMasterID: "Start",
        zipCode: "26962 Grevie",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Lindab AB",
        deliveryStreet: "Järnvägsgatan 42",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T08:00:00",
        calculatedArrivalTimeString: "2026-03-11 09:00:00",
        distance: 0,
        arrived: false,
        departed: false,
        lat: 56.391629,
        lon: 12.782725,
        billOfLadingID: "",
        transportStatus: 1,
        plannedSequence: 0,
      },
      {
        shipmentMasterID: "SHPM-1",
        zipCode: "215 32 Malmö",
        deliveryMode: "Delivery",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Reeinvent",
        deliveryStreet: "Hyllie Stationsväg 31",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T08:20:54",
        calculatedArrivalTimeString: "2026-03-11 09:20:54",
        distance: 114,
        arrived: false,
        departed: false,
        lat: 55.5622105,
        lon: 12.9754811,
        billOfLadingID: "",
        transportStatus: 1,
        plannedSequence: 1,
      },
      {
        shipmentMasterID: "Rast",
        zipCode: " ",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Break 30 min",
        deliveryStreet: "",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T08:27:39",
        calculatedArrivalTimeString: "2026-03-11 09:27:39",
        distance: 0,
        arrived: false,
        departed: false,
        lat: 0.0,
        lon: 0.0,
        billOfLadingID: "",
        transportStatus: 1,
        plannedSequence: 2,
      },
      {
        shipmentMasterID: "Loading",
        zipCode: "224 78 Lund",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "CityMail Sweden AB",
        deliveryStreet: "Skiffervägen 34",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T08:28:08",
        calculatedArrivalTimeString: "2026-03-11 09:28:08",
        distance: 25,
        arrived: false,
        departed: false,
        lat: 55.69312826,
        lon: 13.21387254,
        billOfLadingID: "",
        transportStatus: 1,
        plannedSequence: 3,
      },
      {
        shipmentMasterID: "Stop",
        zipCode: "26962 Grevie",
        deliveryMode: "",
        requestedUnloadingTime: null,
        deliveryInformation: ", ",
        telePhoneAlert: "",
        deliveryName: "Lindab AB",
        deliveryStreet: "Järnvägsgatan 42",
        goodsReceiver: "",
        goodsReceiverPhone: "",
        volume: "0ldm",
        weight: 0.0,
        calculatedArrivalTime: "2026-03-11T08:28:26",
        calculatedArrivalTimeString: "2026-03-11 09:28:26",
        distance: 100,
        arrived: false,
        departed: false,
        lat: 56.391629,
        lon: 12.782725,
        billOfLadingID: "",
        transportStatus: 1,
        plannedSequence: 4,
      },
    ],
  },
};

/** GET /api/routes?carrierId=...&departureDate=YYYY-MM-DD — routes for carrier on date */
router.get("/routes", (req, res) => {
  const carrierId = (req.query.carrierId as string) || "";
  const departureDate = (req.query.departureDate as string) || "";
  const byDate = carrierId ? MOCK_ROUTES_BY_CARRIER[carrierId] : undefined;
  const list = byDate?.[departureDate] ?? [];
  res.json(list);
});

/** GET /api/routes/:routeID — route detail with stops */
router.get("/routes/:routeID", (req, res) => {
  const routeID = req.params.routeID;
  const detail = MOCK_ROUTE_DETAIL[routeID];
  if (!detail) {
    res.status(404).json({ error: "Route not found" });
    return;
  }
  res.json(detail);
});

/** POST /api/routes/:routeId/events/locations/batch — GPS batch for a route */
router.post("/routes/:routeId/events/locations/batch", async (req, res) => {
  const routeId = req.params.routeId;
  const { points } = req.body as { points: GpsPointPayload[] };
  if (!Array.isArray(points) || points.length === 0) {
    return res.status(400).json({ error: "points array required" });
  }
  await withTransaction(async (client) => {
    for (const p of points) {
      const recordedAt =
        typeof p.recorded_at === "string"
          ? p.recorded_at
          : new Date(p.recorded_at).toISOString();
      await client.query(
        "INSERT INTO gps_points (route_id, user_id, latitude, longitude, recorded_at) VALUES ($1, $2, $3, $4, $5::timestamptz)",
        [routeId, p.user_id, p.latitude, p.longitude, recordedAt],
      );
    }
  });
  res.status(204).send();
});

const DEVIATIONS_LIST = [
  { id: 0, name: "None", statusID: 0, status: "None" },
  { id: 1, name: "Damaged goods", statusID: 1, status: "Damaged goods" },
  { id: 2, name: "Missing goods", statusID: 2, status: "Missing goods" },
  { id: 3, name: "Delivered without signature", statusID: 3, status: "Delivered without signature" },
  { id: 4, name: "Shipment not delivered", statusID: 4, status: "Shipment not delivered " },
  { id: 5, name: "Other deviation", statusID: 5, status: "Other deviation " },
  { id: 6, name: "Delivered - unloading equipment missing", statusID: 6, status: "Delivered - unloading equipment missing" },
  { id: -1, name: "Unknown", statusID: 7, status: "Unannounced return" },
];

/** GET /api/deviations — list of deviation options for delivery */
router.get("/deviations", (_req, res) => {
  res.json(DEVIATIONS_LIST);
});

export default router;
