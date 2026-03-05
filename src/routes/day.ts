import { Router } from "express";
import { pool } from "../db";
import type { DayData } from "../types";

const router = Router();

/** GET /api/day?date=YYYY-MM-DD — trucks, routes, stops, delivery_info, lifecycle_state for the day */
router.get("/day", async (_req, res) => {
  const date =
    (_req.query.date as string) || new Date().toISOString().slice(0, 10);
  // For mock we ignore date and return full snapshot
  const trucksResult = await pool.query("SELECT id, label FROM trucks");
  const routesResult = await pool.query(
    "SELECT id, server_id, truck_id, name FROM routes",
  );
  const stopsResult = await pool.query(
    "SELECT id, name, latitude, longitude, address, contact, route_id, delivery_notes, estimated_time FROM stops",
  );
  const deliveryInfoResult = await pool.query(
    "SELECT stop_id, signature, images, description, created_at, updated_at FROM stop_delivery_info",
  );
  const lifecycleStateResult = await pool.query(
    "SELECT stop_id, event_type, payload, updated_at FROM stop_lifecycle_state",
  );

  const dayData: DayData = {
    trucks: trucksResult.rows as DayData["trucks"],
    routes: routesResult.rows as DayData["routes"],
    stops: stopsResult.rows as DayData["stops"],
    delivery_info: deliveryInfoResult.rows.map((row) => ({
      stop_id: row.stop_id,
      signature: row.signature,
      images: row.images,
      description: row.description,
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : String(row.updated_at),
    })),
    lifecycle_state: lifecycleStateResult.rows.map((row) => ({
      stop_id: row.stop_id,
      event_type: row.event_type,
      payload: row.payload,
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : String(row.updated_at),
    })),
  };
  res.json(dayData);
});

export default router;
