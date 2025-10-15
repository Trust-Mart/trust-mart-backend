import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import db from "../models/index.js";

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions: CorsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "*",
};

app.use(cors(corsOptions));

const port: number = (() => {
  const envPort = process.env.PORT;
  if (envPort && !isNaN(Number(envPort))) {
    return Number(envPort);
  }
  return 3033;
})();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
  console.log("Response sent");
});

const initializeDatabase = async (): Promise<void> => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    if (process.env.NODE_ENV === "development") {
      await db.sequelize.sync({ alter: true });
      console.log("✅ Database synced successfully.");
    } else {
      await db.sequelize.sync();
      console.log("✅ Production database connected.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Database initialization failed:", error.message);
    } else {
      console.error("❌ Database initialization failed:", error);
    }
    process.exit(1);
  }
};

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
    app.listen(port, host, () => {
      console.log(`Trustmart API running in ${process.env.NODE_ENV ?? "development"} mode`);
      console.log(`Listening on http://${host}:${port.toString()}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Failed to start server:", error.message);
    } else {
      console.error("❌ Failed to start server:", error);
    }
    process.exit(1);
  }
};

startServer().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
});
