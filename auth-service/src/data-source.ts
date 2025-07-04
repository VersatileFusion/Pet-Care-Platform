import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { logger } from "./utils/logger";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "pet_care",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });
