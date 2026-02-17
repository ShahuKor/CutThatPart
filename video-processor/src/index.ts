import { database } from "./services/database";
import { videoDownloader } from "./services/videoDownloader";
import { logger } from "./utils/logger";
import { jobProcessor } from "./services/jobProcessor";
import { cleanupService } from "./services/cleanup";
import { FileSystemUtils } from "./utils/filesystem";
import { config } from "./config";

async function start() {
  try {
    await database.connect();
    logger.info("Database connected");

    await database.initialize();
    logger.info("Schema initialized");

    await videoDownloader.checkDependencies();
    logger.info("yt-dlp and ffmpeg available");

    await FileSystemUtils.ensureDir(config.video.tempDir);
    logger.info("Temp directory ready");

    cleanupService.start();
    logger.info("Cleanup service started");

    await jobProcessor.start();
    logger.info("Job processor started - waiting for jobs...");
  } catch (error: any) {
    logger.error("Startup failed:", { error: error.message });
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down...");
  await jobProcessor.shutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down...");
  await jobProcessor.shutdown();
  process.exit(0);
});

start();
