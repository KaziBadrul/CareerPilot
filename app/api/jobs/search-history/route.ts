import { createAdminClient } from "@/lib/supabase/server";
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

    const supabase = createAdminClient();

    // Keep the public users row in sync so the foreign key on job_searches
    // does not block search history for users who have not uploaded a CV yet.
    try {
      const { data: existingUser, error: userLookupError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (userLookupError) throw userLookupError;

      if (!existingUser) {
        let email = "";
        try {
          const { data: authUser, error: authUserError } =
            await supabase.auth.admin.getUserById(userId);
          if (authUserError) throw authUserError;
          email = authUser?.user?.email ?? "";
        } catch (authErr) {
          console.error("Failed to fetch auth user for search history:", authErr);
        }

        const { error: provisionError } = await supabase
          .from("users")
          .insert({ id: userId, email });

        if (provisionError) throw provisionError;
      }
    } catch (provisionErr) {
      console.error("User provisioning check failed for search history:", provisionErr);
    }

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
