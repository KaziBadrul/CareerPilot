import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, job, status } = await request.json();

    if (!userId || !job || !job.title || !job.company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Check if job already exists
    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("user_id", userId)
      .eq("job_url", job.url || "")
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Job already saved", id: existing.id },
        { status: 409 },
      );
    }

    // Insert new job application record
    const { data, error } = await supabase
      .from("job_applications")
      .insert({
        user_id: userId,
        job_title: job.title,
        company: job.company,
        job_url: job.url || "",
        status: status || "applied",
        fit_score: job.fitScore || 0,
        applied_at: new Date().toISOString(),
        notes: job.reasoning || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Save job error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to save job";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
