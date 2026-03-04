import "dotenv/config";
import app from "./app";
import { runMigrations } from "./db";

const PORT = Number(process.env.PORT) || 3000;

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Lindab API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to run migrations:", err);
    process.exit(1);
  });
