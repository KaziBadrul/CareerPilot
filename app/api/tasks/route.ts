import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch all tasks for a user (optionally filtered by goalId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const goalId = searchParams.get("goalId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    let queryBuilder = supabase
      .from("tasks")
      .select("*, goals(title)")
      .eq("user_id", userId);

    if (goalId) {
      queryBuilder = queryBuilder.eq("goal_id", goalId);
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ tasks: data || [] });
  } catch (err) {
    console.error("[Tasks API GET] error:", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(request: NextRequest) {
  try {
    const { userId, goalId, title, description, dueDate, priority } = await request.json();

    if (!userId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        goal_id: goalId || null,
        title,
        description: description || "",
        due_date: dueDate || null,
        priority: priority || "medium",
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, task: data }, { status: 201 });
  } catch (err) {
    console.error("[Tasks API POST] error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// PATCH: Update a task
export async function PATCH(request: NextRequest) {
  try {
    const { taskId, goalId, title, description, dueDate, priority, completed } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: any = {};
    if (goalId !== undefined) updates.goal_id = goalId || null;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) updates.due_date = dueDate || null;
    if (priority !== undefined) updates.priority = priority;
    if (completed !== undefined) updates.completed = completed;

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, task: data });
  } catch (err) {
    console.error("[Tasks API PATCH] error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// DELETE: Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Tasks API DELETE] error:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
