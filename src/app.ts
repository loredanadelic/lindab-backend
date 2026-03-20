import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth";
import dayRoutes from "./routes/day";
import stopsRoutes from "./routes/stops";
import trucksRoutes from "./routes/trucks";
import routesRoutes from "./routes/routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/api", dayRoutes);
app.use("/api", trucksRoutes);
app.use("/api", routesRoutes);
app.use("/api/stops", stopsRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "lindab-backend" });
});

export default app;
