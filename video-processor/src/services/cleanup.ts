import { database } from "./database";
import { s3Service } from "./s3";
import { createLogger } from "../utils/logger";
import { FileSystemUtils } from "../utils/filesystem";
import { config } from "../config/index";

const logger = createLogger("CleanupService");

export class CleanupService {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly CLEANUP_INTERVAL_MS = 3600000;
  private readonly TEMP_CLEANUP_INTERVAL_MS = 21600000;

  // Clean up expired clips from database and S3
  async cleanupExpiredClips(): Promise<number> {
    logger.info("Starting cleanup of expired clips");

    try {
      // Get expired clips
      const expiredClips = await database.getExpiredClips(100);

      if (expiredClips.length === 0) {
        logger.info("No expired clips to clean up");
        return 0;
      }

      logger.info("Found expired clips", { count: expiredClips.length });

      let cleanedCount = 0;

      for (const clip of expiredClips) {
        try {
          // Delete from S3 if exists
          if (clip.s3_key) {
            await s3Service.deleteFile(clip.s3_key);
            logger.debug("Deleted S3 file", {
              clipId: clip.id,
              s3Key: clip.s3_key,
            });
          }

          // Delete from database
          await database.deleteClip(clip.id);
          logger.debug("Deleted database record", { clipId: clip.id });

          cleanedCount++;
        } catch (error: any) {
          logger.error("Failed to cleanup clip", {
            clipId: clip.id,
            error: error.message,
          });
        }
      }

      logger.info("Cleanup completed", {
        totalExpired: expiredClips.length,
        cleaned: cleanedCount,
      });

      return cleanedCount;
    } catch (error: any) {
      logger.error("Cleanup failed", { error: error.message });
      return 0;
    }
  }

  // Clean up old temporary directories

  async cleanupTempDirectories(): Promise<void> {
    logger.info("Cleaning up old temporary directories");

    try {
      await FileSystemUtils.cleanupOldTempDirs(
        config.video.tempDir,
        86400000, // 24 hours
      );
      logger.info("Temporary directories cleanup completed");
    } catch (error: any) {
      logger.error("Failed to cleanup temp directories", {
        error: error.message,
      });
    }
  }

  // Start periodic cleanup

  start(): void {
    logger.info("Starting cleanup service", {
      clipCleanupInterval: this.CLEANUP_INTERVAL_MS,
      tempCleanupInterval: this.TEMP_CLEANUP_INTERVAL_MS,
    });

    // Initial cleanup
    this.cleanupExpiredClips();
    this.cleanupTempDirectories();

    // Periodic cleanup of expired clips
    setInterval(() => {
      this.cleanupExpiredClips().catch((error) => {
        logger.error("Scheduled cleanup failed", { error: error.message });
      });
    }, this.CLEANUP_INTERVAL_MS);

    // Periodic cleanup of temp directories
    setInterval(() => {
      this.cleanupTempDirectories().catch((error) => {
        logger.error("Temp directory cleanup failed", { error: error.message });
      });
    }, this.TEMP_CLEANUP_INTERVAL_MS);
  }

  // Stop cleanup service
  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      logger.info("Cleanup service stopped");
    }
  }

  // Manual cleanup trigger

  async runCleanup(): Promise<void> {
    await this.cleanupExpiredClips();
    await this.cleanupTempDirectories();
  }
}

export const cleanupService = new CleanupService();
