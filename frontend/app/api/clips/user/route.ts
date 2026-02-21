import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clips = await sql`
      SELECT 
        id, 
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
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({ clips });
  } catch (error: any) {
    console.error("Get user clips error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clips" },
      { status: 500 },
    );
  }
}
