import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import { apiLimiter, authLimiter, bookingLimiter } from "./middleware/rate-limit.middleware";
import bookingRoutes from "./routes/booking.routes";
import serviceRoutes from "./routes/service.routes";
import fs from "fs";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiters
app.use(apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/bookings", bookingLimiter);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

// Error handling
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization:", error);
    process.exit(1);
  });

export default app;
