import { spawn } from "child_process";
import path from "path";
import { createLogger } from "../utils/logger";
import {
  VideoDownloadError,
  VideoProcessingError,
  VideoValidationError,
} from "../config/errors";
import { FileSystemUtils } from "../utils/filesystem";
import { config } from "../config";
import { DownloadOptions, DownloadResult } from "../types/index";
const logger = createLogger("VideoDownloader");

export class VideoDownloader {
  private readonly ytDlpPath: string = "yt-dlp";
  private readonly ffmpegPath: string = "ffmpeg";

  /**
   * Validate timestamp ranges
   */
  private validateTimestamps(startTime: number, endTime: number): void {
    if (startTime < 0) {
      throw new VideoValidationError("Start time cannot be negative");
    }

    if (endTime <= startTime) {
      throw new VideoValidationError(
        "End time must be greater than start time",
      );
    }

    const duration = endTime - startTime;
    if (duration > config.video.maxDuration) {
      throw new VideoValidationError(
        `Clip duration (${duration}s) exceeds maximum allowed duration (${config.video.maxDuration}s)`,
      );
    }

    if (duration < 1) {
      throw new VideoValidationError("Clip duration must be at least 1 second");
    }
  }

  /**
   * Format time in seconds to HH:MM:SS
   */
  private formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Execute a command and return stdout/stderr
   */
  private async executeCommand(
    command: string,
    args: string[],
    jobId: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      logger.info("Executing command", {
        jobId,
        command,
        args: args.join(" "),
      });

      const process = spawn(command, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        const output = data.toString();
        stdout += output;
        logger.debug("Command stdout", { jobId, output: output.trim() });
      });

      process.stderr.on("data", (data) => {
        const output = data.toString();
        stderr += output;
        // yt-dlp outputs progress to stderr
        if (output.includes("[download]")) {
          logger.debug("Download progress", { jobId, progress: output.trim() });
        }
      });

      process.on("error", (error) => {
        logger.error("Command execution error", {
          jobId,
          command,
          error: error.message,
        });
        reject(
          new VideoProcessingError(
            `Failed to execute ${command}: ${error.message}`,
          ),
        );
      });

      process.on("close", (code) => {
        if (code === 0) {
          logger.info("Command completed successfully", { jobId, command });
          resolve({ stdout, stderr });
        } else {
          logger.error("Command failed", {
            jobId,
            command,
            exitCode: code,
            stderr: stderr.slice(-500), // Last 500 chars
          });
          reject(
            new VideoProcessingError(
              `${command} exited with code ${code}: ${stderr.slice(-200)}`,
            ),
          );
        }
      });
    });
  }

  /**
   * Check if yt-dlp and ffmpeg are installed
   */
  async checkDependencies(): Promise<void> {
    try {
      await this.executeCommand(
        this.ytDlpPath,
        ["--version"],
        "dependency-check",
      );
      logger.info("yt-dlp is available");
    } catch (error) {
      throw new VideoProcessingError("yt-dlp is not installed or not in PATH");
    }

    try {
      await this.executeCommand(
        this.ffmpegPath,
        ["-version"],
        "dependency-check",
      );
      logger.info("ffmpeg is available");
    } catch (error) {
      throw new VideoProcessingError("ffmpeg is not installed or not in PATH");
    }
  }

  /**
   * Download and trim a YouTube video clip
   */
  async downloadClip(options: DownloadOptions): Promise<DownloadResult> {
    const { youtubeUrl, startTime, endTime, outputPath, jobId } = options;

    // Validate inputs
    this.validateTimestamps(startTime, endTime);

    // Ensure output directory exists
    await FileSystemUtils.ensureDir(path.dirname(outputPath));

    const duration = endTime - startTime;
    const startTimeFormatted = this.formatTime(startTime);

    logger.info("Starting video download", {
      jobId,
      youtubeUrl,
      startTime,
      endTime,
      duration,
    });

    try {
      // yt-dlp command to download specific section
      // Using --download-sections to download only the required part
      const ytDlpArgs = [
        youtubeUrl,

        // Download specific section
        "--download-sections",
        `*${startTime}-${endTime}`,

        // Force keyframes at cuts for better quality
        "--force-keyframes-at-cuts",

        // Format selection - prefer mp4
        "--format",
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",

        // Merge to mp4
        "--merge-output-format",
        "mp4",

        // Output file
        "--output",
        outputPath,

        // No playlist, just single video
        "--no-playlist",

        // Retries
        "--retries",
        "3",

        // Continue on download errors
        "--ignore-errors",

        // Use aria2c for faster downloads if available
        "--external-downloader",
        "aria2c",
        "--external-downloader-args",
        "-x 8 -s 8 -k 1M",

        // Quiet mode (less verbose)
        "--no-warnings",
        "--no-progress",
      ];

      await this.executeCommand(this.ytDlpPath, ytDlpArgs, jobId);

      // Verify the file was created
      const fileExists = await FileSystemUtils.fileExists(outputPath);
      if (!fileExists) {
        throw new VideoDownloadError(
          "Download completed but output file not found",
        );
      }

      // Get file size
      const fileSize = await FileSystemUtils.getFileSize(outputPath);

      if (fileSize === 0) {
        throw new VideoDownloadError("Downloaded file is empty");
      }

      logger.info("Video download completed", {
        jobId,
        fileSize,
        duration,
        outputPath: path.basename(outputPath),
      });

      return {
        filePath: outputPath,
        fileSize,
        duration,
      };
    } catch (error: any) {
      logger.error("Video download failed", {
        jobId,
        error: error.message,
        youtubeUrl,
      });

      // Clean up partial downloads
      await FileSystemUtils.safeDelete(outputPath);

      // Re-throw with context
      if (
        error instanceof VideoProcessingError ||
        error instanceof VideoValidationError
      ) {
        throw error;
      }

      // Check for common yt-dlp errors
      const errorMsg = error.message.toLowerCase();

      if (
        errorMsg.includes("private video") ||
        errorMsg.includes("not available")
      ) {
        throw new VideoDownloadError(
          "Video is private or not available",
          false,
        );
      }

      if (errorMsg.includes("copyright") || errorMsg.includes("removed")) {
        throw new VideoDownloadError(
          "Video has been removed or is copyrighted",
          false,
        );
      }

      if (errorMsg.includes("geo") || errorMsg.includes("location")) {
        throw new VideoDownloadError(
          "Video is not available in this location",
          false,
        );
      }

      if (errorMsg.includes("timeout") || errorMsg.includes("network")) {
        throw new VideoDownloadError("Network error during download", true);
      }

      throw new VideoDownloadError(`Download failed: ${error.message}`, true);
    }
  }

  /**
   * Get video metadata without downloading
   */
  async getVideoMetadata(
    youtubeUrl: string,
    jobId: string,
  ): Promise<{
    title: string;
    duration: number;
    format: string;
  }> {
    try {
      const args = [
        youtubeUrl,
        "--dump-json",
        "--no-playlist",
        "--skip-download",
      ];

      const { stdout } = await this.executeCommand(this.ytDlpPath, args, jobId);
      const metadata = JSON.parse(stdout);

      return {
        title: metadata.title || "Unknown",
        duration: metadata.duration || 0,
        format: metadata.ext || "mp4",
      };
    } catch (error: any) {
      logger.warn("Failed to get video metadata", {
        jobId,
        error: error.message,
      });
      // Non-critical, return defaults
      return {
        title: "Unknown",
        duration: 0,
        format: "mp4",
      };
    }
  }
}

export const videoDownloader = new VideoDownloader();
