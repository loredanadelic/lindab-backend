import { Router } from "express";
import { withTransaction } from "../db";
import type {
  StopLifecycleEventPayload,
  StopDeliveryUpdatePayload,
  GpsPointPayload,
} from "../types";

const router = Router();

/** POST /api/stops/events — lifecycle events (arrived, departed, delivered) */
router.post("/events", async (req, res) => {
  const { events } = req.body as { events: StopLifecycleEventPayload[] };
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "events array required" });
  }
  await withTransaction(async (client) => {
    for (const e of events) {
      const created_at =
        typeof e.createdAt === "number"
          ? new Date(e.createdAt).toISOString()
          : e.createdAt;
      await client.query(
        "INSERT INTO stop_lifecycle_events (stop_id, event_type, payload, created_at) VALUES ($1, $2, $3, $4::timestamptz)",
        [e.stopId, e.eventType, e.payload, created_at],
      );
      await client.query(
        `INSERT INTO stop_lifecycle_state (stop_id, event_type, payload, updated_at)
         VALUES ($1, $2, $3, $4::timestamptz)
         ON CONFLICT (stop_id) DO UPDATE SET
           event_type = EXCLUDED.event_type,
           payload = EXCLUDED.payload,
           updated_at = EXCLUDED.updated_at`,
        [e.stopId, e.eventType, e.payload, created_at],
      );
    }
  });
  res.status(204).send();
});

/** POST /api/stops/delivery-updates — POD / delivery updates */
router.post("/delivery-updates", async (req, res) => {
  const { events } = req.body as { events: StopDeliveryUpdatePayload[] };
  console.log("delivery-updates", req.body);
  if (!Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "events array required" });
  }
  await withTransaction(async (client) => {
    for (const e of events) {
      const created_at =
        typeof e.createdAt === "number"
          ? new Date(e.createdAt).toISOString()
          : e.createdAt;
      await client.query(
        "INSERT INTO stop_delivery_updates (stop_id, payload, created_at) VALUES ($1, $2, $3::timestamptz)",
        [e.stopId, e.payload, created_at],
      );
      let signature: string | null = null;
      let images: string | null = null;
      let description: string | null = null;
      if (e.payload) {
        try {
          const parsed = JSON.parse(e.payload) as {
            signature?: string | null;
            images?: string | string[] | null;
            description?: string | null;
          };
          signature =
            typeof parsed.signature === "string" ? parsed.signature : null;
          description =
            typeof parsed.description === "string"
              ? parsed.description
              : null;
          images =
            typeof parsed.images === "string"
              ? parsed.images
              : Array.isArray(parsed.images)
                ? JSON.stringify(parsed.images)
                : null;
        } catch {
          // keep nulls if payload is not valid JSON
        }
      }
      await client.query(
        `INSERT INTO stop_delivery_info (stop_id, signature, images, description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::timestamptz, $5::timestamptz)
         ON CONFLICT (stop_id) DO UPDATE SET
           signature = EXCLUDED.signature,
           images = EXCLUDED.images,
           description = EXCLUDED.description,
           updated_at = EXCLUDED.updated_at`,
        [e.stopId, signature, images, description, created_at],
      );
    }
  });
  res.status(204).send();
});

/** POST /api/stops/:stopId/events/locations/batch — GPS batch for a stop */
router.post("/:stopId/events/locations/batch", async (req, res) => {
  const stopId = req.params.stopId;
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
        "INSERT INTO gps_points (stop_id, user_id, latitude, longitude, recorded_at) VALUES ($1, $2, $3, $4, $5::timestamptz)",
        [stopId, p.user_id, p.latitude, p.longitude, recordedAt],
      );
    }
  });
  res.status(204).send();
});

export default router;
