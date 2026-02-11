import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { config } from "../config/index";
import { createLogger } from "../utils/logger";
import { DatabaseError } from "../config/errors";
import { ClipStatus } from "../types";

const logger = createLogger("Database");

class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.database.connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pool.on("error", (err) => {
      logger.error("Unexpected database pool error", { error: err.message });
    });

    this.pool.on("connect", () => {
      logger.info("Database connection pool established");
    });
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query("SELECT NOW()");
      client.release();
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

      await this.pool.query(`
      CREATE TABLE IF NOT EXISTS clips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      );

      CREATE INDEX IF NOT EXISTS idx_clips_share_token ON clips(share_token);
      CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status);
      CREATE INDEX IF NOT EXISTS idx_clips_expires_at ON clips(expires_at);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_clips_updated_at ON clips;
      CREATE TRIGGER update_clips_updated_at
        BEFORE UPDATE ON clips
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

      logger.info("Database schema initialized successfully");
    } catch (error: any) {
      logger.error("Failed to initialize database schema", {
        error: error.message,
      });
      throw new DatabaseError(`Schema initialization failed: ${error.message}`);
    }
  }

  private async query<T extends QueryResultRow>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      logger.debug("Query executed", { duration, rows: result.rowCount });
      return result;
    } catch (error: any) {
      logger.error("Query failed", { error: error.message, query: text });
      throw new DatabaseError(`Database query failed: ${error.message}`);
    }
  }

  async updateClipStatus(
    jobId: string,
    status: ClipStatus,
    errorMessage?: string,
  ): Promise<void> {
    const query = `
      UPDATE clips 
      SET status = $1, error_message = $2, updated_at = NOW()
      WHERE id = $3
    `;
    await this.query(query, [status, errorMessage || null, jobId]);
    logger.info("Updated clip status", { jobId, status });
  }

  async updateClipCompleted(
    jobId: string,
    s3Key: string,
    fileSize: number,
    duration: number,
  ): Promise<void> {
    const query = `
      UPDATE clips 
      SET 
        status = $1,
        s3_key = $2,
        file_size = $3,
        duration = $4,
        updated_at = NOW()
      WHERE id = $5
    `;
    await this.query(query, [
      ClipStatus.COMPLETED,
      s3Key,
      fileSize,
      duration,
      jobId,
    ]);
    logger.info("Updated clip as completed", {
      jobId,
      s3Key,
      fileSize,
      duration,
    });
  }

  async getClipById(jobId: string): Promise<any | null> {
    const query = "SELECT * FROM clips WHERE id = $1";
    const result = await this.query(query, [jobId]);
    return result.rows[0] || null;
  }

  async isClipValid(jobId: string): Promise<boolean> {
    const query = `
      SELECT id FROM clips 
      WHERE id = $1 AND expires_at > NOW()
    `;
    const result = await this.query(query, [jobId]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getExpiredClips(limit: number = 100): Promise<any[]> {
    const query = `
      SELECT id, s3_key 
      FROM clips 
      WHERE expires_at < NOW() AND s3_key IS NOT NULL
      ORDER BY expires_at ASC
      LIMIT $1
    `;
    const result = await this.query(query, [limit]);
    return result.rows;
  }

  async deleteClip(jobId: string): Promise<void> {
    const query = "DELETE FROM clips WHERE id = $1";
    await this.query(query, [jobId]);
    logger.info("Deleted clip record", { jobId });
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'processing') as processing,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed
      FROM clips
      WHERE expires_at > NOW()
    `;
    const result = await this.query(query);
    return result.rows[0] as any;
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async close(): Promise<void> {
    await this.pool.end();
    logger.info("Database connections closed");
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }
}

export const database = new Database();
