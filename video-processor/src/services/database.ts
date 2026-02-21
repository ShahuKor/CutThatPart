import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { createLogger } from "../utils/logger";
import { DatabaseError } from "../config/errors";
import { ClipStatus } from "../types";

const logger = createLogger("Database");

class Database {
  private sql: NeonQueryFunction<false, false>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined");
    }
    this.sql = neon(process.env.DATABASE_URL);
    logger.info("Neon database client initialized");
  }

  async connect(): Promise<void> {
    try {
      await this.sql`SELECT NOW()`;
      logger.info("Database connection successful");
    } catch (error: any) {
      logger.error("Database connection failed", { error: error.message });
      throw new DatabaseError(
        `Failed to connect to database: ${error.message}`,
      );
    }
  }

  async initialize(): Promise<void> {
    try {
      logger.info("Initializing database schema...");

      await this.sql`
        CREATE TABLE IF NOT EXISTS clips (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL, 
          youtube_url TEXT NOT NULL,
          start_time INTEGER NOT NULL CHECK (start_time >= 0),
          end_time INTEGER NOT NULL CHECK (end_time > start_time),
          sharer_name VARCHAR(255),
          share_token VARCHAR(255) UNIQUE NOT NULL,
          s3_key TEXT,
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
          error_message TEXT,
          file_size BIGINT,
          duration INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '2 days'
        )
      `;

      await this.sql`
        CREATE INDEX IF NOT EXISTS idx_clips_user_id ON clips(user_id);
      `;

      await this.sql`
        CREATE INDEX IF NOT EXISTS idx_clips_share_token ON clips(share_token)
      `;

      await this.sql`
        CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status)
      `;

      await this.sql`
        CREATE INDEX IF NOT EXISTS idx_clips_expires_at ON clips(expires_at)
      `;

      await this.sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
      `;

      await this.sql`
        DROP TRIGGER IF EXISTS update_clips_updated_at ON clips
      `;

      await this.sql`
        CREATE TRIGGER update_clips_updated_at
          BEFORE UPDATE ON clips
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `;

      logger.info("Database schema initialized successfully");
    } catch (error: any) {
      logger.error("Failed to initialize database schema", {
        error: error.message,
      });
      throw new DatabaseError(`Schema initialization failed: ${error.message}`);
    }
  }

  async updateClipStatus(
    jobId: string,
    status: ClipStatus,
    errorMessage?: string,
  ): Promise<void> {
    try {
      await this.sql`
        UPDATE clips 
        SET status = ${status}, error_message = ${errorMessage || null}, updated_at = NOW()
        WHERE id = ${jobId}
      `;
      logger.info("Updated clip status", { jobId, status });
    } catch (error: any) {
      throw new DatabaseError(`Failed to update clip status: ${error.message}`);
    }
  }

  async updateClipCompleted(
    jobId: string,
    s3Key: string,
    fileSize: number,
    duration: number,
  ): Promise<void> {
    try {
      await this.sql`
        UPDATE clips 
        SET 
          status = ${ClipStatus.COMPLETED},
          s3_key = ${s3Key},
          file_size = ${fileSize},
          duration = ${duration},
          updated_at = NOW()
        WHERE id = ${jobId}
      `;
      logger.info("Updated clip as completed", {
        jobId,
        s3Key,
        fileSize,
        duration,
      });
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to update clip as completed: ${error.message}`,
      );
    }
  }

  async getClipById(jobId: string): Promise<any | null> {
    try {
      const rows = await this.sql`
        SELECT * FROM clips WHERE id = ${jobId}
      `;
      return rows[0] || null;
    } catch (error: any) {
      throw new DatabaseError(`Failed to get clip: ${error.message}`);
    }
  }

  async isClipValid(jobId: string): Promise<boolean> {
    try {
      const rows = await this.sql`
        SELECT id FROM clips 
        WHERE id = ${jobId} AND expires_at > NOW()
      `;
      return rows.length > 0;
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to check clip validity: ${error.message}`,
      );
    }
  }

  async getExpiredClips(limit: number = 100): Promise<any[]> {
    try {
      const rows = await this.sql`
        SELECT id, s3_key 
        FROM clips 
        WHERE expires_at < NOW() AND s3_key IS NOT NULL
        ORDER BY expires_at ASC
        LIMIT ${limit}
      `;
      return rows;
    } catch (error: any) {
      throw new DatabaseError(`Failed to get expired clips: ${error.message}`);
    }
  }

  async deleteClip(jobId: string): Promise<void> {
    try {
      await this.sql`DELETE FROM clips WHERE id = ${jobId}`;
      logger.info("Deleted clip record", { jobId });
    } catch (error: any) {
      throw new DatabaseError(`Failed to delete clip: ${error.message}`);
    }
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      const rows = await this.sql`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'processing') as processing,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'failed') as failed
        FROM clips
        WHERE expires_at > NOW()
      `;
      return rows[0] as any;
    } catch (error: any) {
      throw new DatabaseError(`Failed to get stats: ${error.message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.sql`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

export const database = new Database();
