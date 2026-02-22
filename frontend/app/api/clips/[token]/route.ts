import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const result = await sql`
      SELECT 
        id, 
        user_id,
        youtube_url, 
        start_time, 
        end_time, 
        share_token, 
        status, 
        s3_key, 
        sharer_name,
        duration,
        file_size,
        created_at, 
        expires_at,
        error_message
      FROM clips
      WHERE share_token = ${token}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }

    const clip = result[0];

    // Check if expired
    if (new Date(clip.expires_at) < new Date()) {
      return NextResponse.json({ error: "Clip has expired" }, { status: 410 });
    }

    return NextResponse.json({ clip });
  } catch (error: any) {
    console.error("Get clip error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clip" },
      { status: 500 },
    );
  }
}
