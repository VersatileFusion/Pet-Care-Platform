import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error.middleware";
import { appointmentRouter } from "./routes/appointment.routes";
import { petRouter } from "./routes/pet.routes";
import { serviceRouter } from "./routes/service.routes";
// import routes (to be implemented)
// import { serviceRouter } from './routes/service.routes';

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet Care Booking API",
      version: "1.0.0",
      description: "API documentation for the Pet Care Booking service",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/appointments", appointmentRouter);
app.use("/api/pets", petRouter);
app.use("/api/services", serviceRouter);

// Route placeholders
// app.use('/api/services', serviceRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to Pet Care Booking API" });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    logger.info("Attempting to connect to the database...");
    logger.info(`DB_HOST: ${process.env.DB_HOST}`);
    logger.info(`DB_PORT: ${process.env.DB_PORT}`);
    logger.info(`DB_USERNAME: ${process.env.DB_USERNAME}`);
    // WARNING: Do not log DB_PASSWORD in production!
    logger.info(`DB_NAME: ${process.env.DB_NAME}`);

    await createConnection({
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "postgres",
      database: process.env.DB_NAME || "petcare",
      entities: [__dirname + "/entities/*.ts"],
      synchronize: process.env.NODE_ENV !== "production",
      logging: process.env.NODE_ENV !== "production",
    });

    logger.info("Database connection successful.");

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};

startServer();
