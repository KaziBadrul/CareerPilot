import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all goals for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ goals: data || [] });
  } catch (err) {
    console.error("[Goals API GET] error:", err);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST: Create a new goal
export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, targetDate } = await request.json();

    if (!userId || !title || !targetDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        title,
        description: description || "",
        target_date: targetDate,
        status: "in_progress",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, goal: data }, { status: 201 });
  } catch (err) {
    console.error("[Goals API POST] error:", err);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

// PATCH: Update a goal
export async function PATCH(request: NextRequest) {
  try {
    const { goalId, title, description, targetDate, status } = await request.json();

    if (!goalId) {
      return NextResponse.json({ error: "Missing goalId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (targetDate !== undefined) updates.target_date = targetDate;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, goal: data });
  } catch (err) {
    console.error("[Goals API PATCH] error:", err);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

// DELETE: Delete a goal
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");

    if (!goalId) {
      return NextResponse.json({ error: "Missing goalId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("goals").delete().eq("id", goalId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Goals API DELETE] error:", err);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
