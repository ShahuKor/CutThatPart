import { database } from "./services/database";
import { logger } from "./utils/logger";

async function start() {
  try {
    await database.connect();
    logger.info("Database connected");

    await database.initialize();
    logger.info("Schema initialized");

    const stats = await database.getStats();
    logger.info("Database stats:", stats);

    await database.close();
  } catch (error: any) {
    logger.error("Startup failed:", { error: error.message });
    process.exit(1);
  }
}

start();
