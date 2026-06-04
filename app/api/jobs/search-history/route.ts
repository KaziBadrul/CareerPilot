import { createClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

// This table stores search history
// You'll need to add this table to your schema:
// create table job_searches (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references users(id) on delete cascade,
//   query text,
//   results_count integer,
//   parsed_data jsonb,
//   created_at timestamptz default now()
// );

export async function POST(request: NextRequest) {
  try {
    const { userId, query, resultsCount, parsedData } = await request.json();

    if (!userId || !query) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("job_searches")
      .insert({
        user_id: userId,
        query,
        results_count: resultsCount || 0,
        parsed_data: parsedData || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Save search error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to save search";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
