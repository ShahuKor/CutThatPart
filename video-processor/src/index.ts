import { database } from "./services/database";
import { videoDownloader } from "./services/videoDownloader";
import { logger } from "./utils/logger";

async function start() {
  try {
    await database.connect();
    logger.info("Database connected");

    await database.initialize();
    logger.info("Schema initialized");

    const stats = await database.getStats();
    logger.info("Database stats:", stats);

    await videoDownloader.checkDependencies();
    logger.info("yt-dlp and ffmpeg available");

    logger.info("Starting test download...");
    const result = await videoDownloader.downloadClip({
      youtubeUrl: "https://www.youtube.com/shorts/tT1JRa28iL0",
      startTime: 0,
      endTime: 10,
      outputPath:
        "/Users/shahukor/Desktop/Serious_Projects/youtube-clip-share/tmp/test-clip.mp4",
      jobId: "test-job-123",
    });

    logger.info("Download successful!", {
      fileSize: `${(result.fileSize / 1024 / 1024).toFixed(2)} MB`,
      duration: `${result.duration}s`,
      filePath: result.filePath,
    });
  } catch (error: any) {
    logger.error("Startup failed:", { error: error.message });
    process.exit(1);
  }
}

start();
