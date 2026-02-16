import { promises as fs } from "fs";
import path from "path";
import { createLogger } from "./logger";

const logger = createLogger("FileSystemUtils");

export class FileSystemUtils {
  /**
   * Ensures a directory exists, creates it if it doesn't
   */
  static async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      logger.info("Created directory", { dirPath });
    }
  }

  /**
   * Safely deletes a file, doesn't throw if file doesn't exist
   */
  static async safeDelete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.debug("Deleted file", { filePath });
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        logger.warn("Failed to delete file", {
          filePath,
          error: error.message,
        });
      }
    }
  }

  /**
   * Recursively deletes a directory and all its contents
   */
  static async deleteDir(dirPath: string): Promise<void> {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
      logger.debug("Deleted directory", { dirPath });
    } catch (error: any) {
      logger.warn("Failed to delete directory", {
        dirPath,
        error: error.message,
      });
    }
  }

  /**
   * Gets file size in bytes
   */
  static async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * Checks if a file exists
   */
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets file extension
   */
  static getExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase().slice(1);
  }

  /**
   * Generates a safe filename from a string
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9.-]/gi, "_")
      .replace(/_{2,}/g, "_")
      .substring(0, 200); // Limit length
  }

  /**
   * Creates a temporary directory for a job
   */
  static async createJobTempDir(
    baseDir: string,
    jobId: string,
  ): Promise<string> {
    const jobDir = path.join(baseDir, jobId);
    await this.ensureDir(jobDir);
    return jobDir;
  }

  /**
   * Cleans up old temporary directories
   */
  static async cleanupOldTempDirs(
    baseDir: string,
    maxAgeMs: number = 86400000,
  ): Promise<void> {
    try {
      const entries = await fs.readdir(baseDir, { withFileTypes: true });
      const now = Date.now();

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(baseDir, entry.name);
          const stats = await fs.stat(dirPath);
          const ageMs = now - stats.mtimeMs;

          if (ageMs > maxAgeMs) {
            await this.deleteDir(dirPath);
            logger.info("Cleaned up old temp directory", { dirPath, ageMs });
          }
        }
      }
    } catch (error: any) {
      logger.error("Failed to cleanup old temp directories", {
        error: error.message,
      });
    }
  }
}
