import { DataSource } from "typeorm";
import { Service } from "./entities/service.entity";
import { Booking } from "./entities/booking.entity";
import { logger } from "./utils/logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "petcare_booking",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [Service, Booking],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
  logger: {
    log: (_level: string, message: string) => logger.info(message),
    logQuery: (query: string, parameters?: any[]) =>
      logger.debug(`Query: ${query}`, { parameters }),
    logQueryError: (error: string, query: string, parameters?: any[]) =>
      logger.error(`Query Error: ${error}`, { query, parameters }),
    logQuerySlow: (time: number, query: string, parameters?: any[]) =>
      logger.warn(`Slow Query: ${time}ms`, { query, parameters }),
    logMigration: (message: string) => logger.info(`Migration: ${message}`),
    logSchemaBuild: (message: string) =>
      logger.info(`Schema Build: ${message}`),
  },
});

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });
