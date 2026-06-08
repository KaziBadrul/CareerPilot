"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Briefcase,
  MessageSquare,
  Clock,
  Bookmark,
  Target,
  Plus,
  Loader2,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  LogOut,
  Building2,
  Check,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: "in_progress" | "completed" | "failed";
}

interface Task {
  id: string;
  goal_id: string | null;
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  priority: "low" | "medium" | "high";
  goals?: {
    title: string;
  };
}

export default function GoalsDashboard() {
  const router = useRouter();
  const supabase = createClient();

  // Auth
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Data
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal / Form state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Goal Form
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");

  // Task Form
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskGoalId, setTaskGoalId] = useState("");

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([]);
  const [selectedDayGoals, setSelectedDayGoals] = useState<Goal[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) {
          router.push("/login");
        } else {
          setUser(user);
          fetchData(user.id);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  const fetchData = async (userId: string) => {
    setLoadingData(true);
    try {
      const [goalsRes, tasksRes] = await Promise.all([
        fetch(`/api/goals?userId=${userId}`).then((res) => res.json()),
        fetch(`/api/tasks?userId=${userId}`).then((res) => res.json()),
      ]);
      setGoals(goalsRes.goals || []);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.error("Failed to load goals/tasks data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Create Goal
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !goalTargetDate || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: goalTitle,
          description: goalDesc,
          targetDate: new Date(goalTargetDate).toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoals((prev) => [data.goal, ...prev]);
        setShowGoalModal(false);
        setGoalTitle("");
        setGoalDesc("");
        setGoalTargetDate("");
      }
    } catch (err) {
      console.error("Error creating goal:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          goalId: taskGoalId || null,
          title: taskTitle,
          description: taskDesc,
          dueDate: taskDueDate ? new Date(taskDueDate).toISOString() : null,
          priority: taskPriority,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Fetch tasks again to resolve goal relationships properly
        await fetchData(user.id);
        setShowTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
        setTaskDueDate("");
        setTaskPriority("medium");
        setTaskGoalId("");
      }
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Task Completion
  const handleToggleTask = async (task: Task) => {
    try {
      const updatedCompleted = !task.completed;
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: updatedCompleted } : t))
      );

      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          completed: updatedCompleted,
        }),
      });

      if (!res.ok) {
        // Rollback
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: !updatedCompleted } : t))
        );
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // Update Goal Status
  const handleUpdateGoalStatus = async (goalId: string, status: "in_progress" | "completed" | "failed") => {
    try {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, status } : g))
      );
      await fetch("/api/goals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, status }),
      });
    } catch (err) {
      console.error("Error updating goal status:", err);
    }
  };

  // Delete Goal
  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal and its linked tasks?")) return;
    try {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      setTasks((prev) => prev.filter((t) => t.goal_id !== goalId));
      await fetch(`/api/goals?goalId=${goalId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Calculate stats
  const getGoalStats = (goalId: string) => {
    const linkedTasks = tasks.filter((t) => t.goal_id === goalId);
    if (linkedTasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
    const completed = linkedTasks.filter((t) => t.completed).length;
    return {
      total: linkedTasks.length,
      completed,
      percentage: Math.round((completed / linkedTasks.length) * 100),
    };
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get tasks due on a date
  const getTasksForDate = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return (
        d.getDate() === target.getDate() &&
        d.getMonth() === target.getMonth() &&
        d.getFullYear() === target.getFullYear()
      );
    });
  };

  // Get goals targeted for a date
  const getGoalsForDate = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return goals.filter((g) => {
      const d = new Date(g.target_date);
      return (
        d.getDate() === target.getDate() &&
        d.getMonth() === target.getMonth() &&
        d.getFullYear() === target.getFullYear()
      );
    });
  };

  const handleDayClick = (day: number) => {
    const target = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayTasks = getTasksForDate(day);
    const dayGoals = getGoalsForDate(day);
    setSelectedDayTasks(dayTasks);
    setSelectedDayGoals(dayGoals);
    setSelectedDateStr(target.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  };

  // Generate calendar grid
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarCells = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ padding: "10px" }} />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDate(day);
    const dayGoals = getGoalsForDate(day);
    const hasItems = dayTasks.length > 0 || dayGoals.length > 0;

    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    calendarCells.push(
      <div
        key={`day-${day}`}
        onClick={() => handleDayClick(day)}
        style={{
          padding: "10px 4px",
          minHeight: "56px",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          cursor: "pointer",
          background: isToday ? "rgba(37,99,235,0.15)" : "var(--field)",
          borderColor: isToday ? "var(--blue-light)" : "var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--blue-light)";
          e.currentTarget.style.background = "var(--surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = isToday ? "var(--blue-light)" : "var(--border)";
          e.currentTarget.style.background = isToday ? "rgba(37,99,235,0.15)" : "var(--field)";
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: isToday ? 700 : 500,
            color: isToday ? "var(--blue-light)" : "var(--cream)",
          }}
        >
          {day}
        </span>
        {hasItems && (
          <div style={{ display: "flex", gap: "3px", marginTop: "4px" }}>
            {dayGoals.map((g) => (
              <span
                key={g.id}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#a855f7", // Purple for goals
                }}
                title={`Goal: ${g.title}`}
              />
            ))}
            {dayTasks.map((t) => (
              <span
                key={t.id}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background:
                    t.completed
                      ? "#34d399" // Green for completed
                      : t.priority === "high"
                        ? "#f87171" // Red for high priority
                        : t.priority === "medium"
                          ? "#fbbf24" // Yellow for medium
                          : "#60a5fa", // Blue for low
                }}
                title={`Task: ${t.title}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sidebar styling helper
  const sidebarLinkStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(37,99,235,0.08)" : "transparent",
    border: active ? "1px solid rgba(37,99,235,0.2)" : "1px solid transparent",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "14.5px",
    fontWeight: 500,
    color: active ? "var(--blue-light)" : "var(--muted)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    transition: "all 0.2s",
  });

  if (loadingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--cream)",
        }}
      >
        <Loader2 className="animate-spin" size={32} color="var(--blue-light)" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        color: "var(--cream)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        <div>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={15} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "17px",
                color: "var(--cream)",
              }}
            >
              CareerPilot
            </span>
          </Link>

          {/* User Profile */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "11px",
                color: "var(--muted)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              LOGGED IN AS
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "13.5px",
                color: "var(--cream)",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              {user?.email}
            </p>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/dashboard" style={sidebarLinkStyle(false)}>
              <Zap size={16} />
              Overview
            </Link>
            <Link href="/dashboard/jobs" style={sidebarLinkStyle(false)}>
              <Briefcase size={16} />
              Job hunter
            </Link>
            <Link href="/dashboard/assistant" style={sidebarLinkStyle(false)}>
              <MessageSquare size={16} />
              AI assistant
            </Link>
            <Link href="/dashboard/goals" style={sidebarLinkStyle(true)}>
              <Target size={16} />
              Goals & Calendar
            </Link>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: "12px",
                paddingTop: "12px",
              }}
            />

            <Link href="/dashboard/searches" style={sidebarLinkStyle(false)}>
              <Clock size={16} />
              Recent searches
            </Link>
            <Link href="/dashboard/saved-jobs" style={sidebarLinkStyle(false)}>
              <Bookmark size={16} />
              Saved jobs
            </Link>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            color: "#f87171",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto", boxSizing: "border-box" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--white)",
                margin: "0 0 6px",
              }}
            >
              Goals & Deadlines
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "14.5px", margin: 0 }}>
              Set career goals, break them down into tasks, and track upcoming deadlines
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setShowGoalModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c084fc",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(168,85,247,0.12)")}
            >
              <Plus size={16} /> New Goal
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "var(--blue)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--blue-glow)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--blue)")}
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>

        {loadingData ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              color: "var(--muted)",
            }}
          >
            <Loader2 className="animate-spin" size={24} color="var(--blue-light)" />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "32px",
            }}
            className="content-grid"
          >
            {/* Left Column: Goals and Tasks */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Goals list */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: "0 0 16px",
                    color: "var(--white)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Active Goals
                </h2>

                {goals.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
                    <Target size={32} style={{ opacity: 0.3, marginBottom: "12px" }} />
                    <p style={{ fontSize: "14px", margin: 0 }}>No active career goals. Create one to get started!</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {goals.map((goal) => {
                      const stats = getGoalStats(goal.id);
                      const targetDate = new Date(goal.target_date);
                      const isOverdue = targetDate < new Date() && goal.status === "in_progress";

                      return (
                        <div
                          key={goal.id}
                          style={{
                            background: "var(--field)",
                            border: "1px solid var(--border-2)",
                            borderRadius: "12px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <div>
                              <h3
                                style={{
                                  fontSize: "15.5px",
                                  fontWeight: 600,
                                  color: "var(--white)",
                                  margin: "0 0 4px",
                                }}
                              >
                                {goal.title}
                              </h3>
                              <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: 0 }}>
                                {goal.description || "No description provided."}
                              </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <select
                                value={goal.status}
                                onChange={(e) => handleUpdateGoalStatus(goal.id, e.target.value as any)}
                                style={{
                                  background: "var(--surface)",
                                  border: "1px solid var(--border)",
                                  color: "var(--cream)",
                                  fontSize: "12px",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  outline: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                              </select>
                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#f87171",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "12px",
                                color: "var(--muted)",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Progress</span>
                              <span>
                                {stats.completed}/{stats.total} Tasks ({stats.percentage}%)
                              </span>
                            </div>
                            <div
                              style={{
                                height: "6px",
                                background: "var(--surface)",
                                borderRadius: "3px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${stats.percentage}%`,
                                  height: "100%",
                                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                                  borderRadius: "3px",
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "11px",
                              marginTop: "4px",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: isOverdue ? "#f87171" : "var(--muted)",
                              }}
                            >
                              <Calendar size={12} />
                              Target Date: {targetDate.toLocaleDateString()}
                              {isOverdue && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", color: "#f87171", fontWeight: 600 }}>
                                  <AlertTriangle size={10} /> Overdue
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tasks List */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: "0 0 16px",
                    color: "var(--white)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  To-Do Items
                </h2>

                {tasks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
                    <CheckCircle2 size={32} style={{ opacity: 0.3, marginBottom: "12px" }} />
                    <p style={{ fontSize: "14px", margin: 0 }}>No tasks created yet. Keep your goals organized with tasks.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {tasks.map((task) => {
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

                      return (
                        <div
                          key={task.id}
                          style={{
                            background: "var(--field)",
                            border: "1px solid var(--border-2)",
                            borderRadius: "10px",
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            transition: "all 0.2s",
                          }}
                        >
                          <button
                            onClick={() => handleToggleTask(task)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              color: task.completed ? "#34d399" : "var(--muted)",
                              marginTop: "2px",
                            }}
                          >
                            {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                          </button>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: task.completed ? "var(--muted)" : "var(--white)",
                                  textDecoration: task.completed ? "line-through" : "none",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {task.title}
                              </p>

                              {/* Priority badge */}
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: 600,
                                  textTransform: "uppercase",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background:
                                    task.priority === "high"
                                      ? "rgba(239,68,68,0.12)"
                                      : task.priority === "medium"
                                        ? "rgba(245,158,11,0.12)"
                                        : "rgba(59,130,246,0.12)",
                                  color:
                                    task.priority === "high"
                                      ? "#f87171"
                                      : task.priority === "medium"
                                        ? "#fbbf24"
                                        : "#60a5fa",
                                }}
                              >
                                {task.priority}
                              </span>
                            </div>

                            {task.description && (
                              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                                {task.description}
                              </p>
                            )}

                            {/* Meta fields */}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginTop: "8px",
                                fontSize: "11px",
                                color: "var(--muted)",
                              }}
                            >
                              {task.due_date && (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    color: isOverdue ? "#f87171" : "var(--muted)",
                                  }}
                                >
                                  <Calendar size={12} />
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                  {isOverdue && (
                                    <span style={{ fontWeight: 600, color: "#f87171" }}>(Overdue)</span>
                                  )}
                                </span>
                              )}

                              {task.goal_id && task.goals && (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    color: "var(--blue-light)",
                                  }}
                                >
                                  <Target size={12} />
                                  Goal: {task.goals.title}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--muted)",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Calendar and Selection Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Calendar card */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                {/* Month navigation */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--white)",
                      fontFamily: "var(--font-display)",
                      margin: 0,
                    }}
                  >
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={handlePrevMonth}
                      style={{
                        background: "var(--field)",
                        border: "1px solid var(--border-2)",
                        color: "var(--cream)",
                        borderRadius: "6px",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      style={{
                        background: "var(--field)",
                        border: "1px solid var(--border-2)",
                        color: "var(--cream)",
                        borderRadius: "6px",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Weekdays row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "6px",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span
                      key={day}
                      style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Calendar grid cells */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "6px",
                  }}
                >
                  {calendarCells}
                </div>
              </div>

              {/* Day selection panel */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "24px",
                  minHeight: "180px",
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--white)",
                    margin: "0 0 12px",
                  }}
                >
                  {selectedDateStr ? `Deadlines on ${selectedDateStr}` : "Select a day to view deadlines"}
                </h3>

                {selectedDateStr ? (
                  selectedDayTasks.length === 0 && selectedDayGoals.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                      No tasks or goals due on this day.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selectedDayGoals.map((g) => (
                        <div
                          key={g.id}
                          style={{
                            background: "rgba(168,85,247,0.08)",
                            border: "1px solid rgba(168,85,247,0.2)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Target size={14} color="#c084fc" />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#c084fc" }}>
                              Goal Target: {g.title}
                            </p>
                          </div>
                        </div>
                      ))}

                      {selectedDayTasks.map((t) => (
                        <div
                          key={t.id}
                          style={{
                            background: t.completed ? "rgba(52,211,153,0.06)" : "var(--field)",
                            border: `1px solid ${t.completed ? "rgba(52,211,153,0.15)" : "var(--border-2)"}`,
                            borderRadius: "8px",
                            padding: "10px 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            <button
                              onClick={() => handleToggleTask(t)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                color: t.completed ? "#34d399" : "var(--muted)",
                              }}
                            >
                              {t.completed ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                            </button>
                            <span
                              style={{
                                fontSize: "12.5px",
                                textDecoration: t.completed ? "line-through" : "none",
                                color: t.completed ? "var(--muted)" : "var(--white)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {t.title}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "9px",
                              color: t.priority === "high" ? "#f87171" : "var(--muted)",
                              fontWeight: 600,
                            }}
                          >
                            {t.priority.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                    Click on any day in the calendar to view its associated goals and tasks.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Goal Modal */}
      {showGoalModal && (
        <div
          onClick={() => setShowGoalModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--overlay)",
            backdropFilter: "blur(8px)",
          }}
        >
          <form
            onSubmit={handleCreateGoal}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--white)", margin: 0 }}>
              Create Career Goal
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>TITLE</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Find a Frontend Role"
                required
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>DESCRIPTION</label>
              <textarea
                value={goalDesc}
                onChange={(e) => setGoalDesc(e.target.value)}
                placeholder="Explain what this goal entails..."
                rows={3}
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>TARGET DATE</label>
              <input
                type="date"
                value={goalTargetDate}
                onChange={(e) => setGoalTargetDate(e.target.value)}
                required
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid var(--border-2)",
                  color: "var(--muted)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "var(--blue)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div
          onClick={() => setShowTaskModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--overlay)",
            backdropFilter: "blur(8px)",
          }}
        >
          <form
            onSubmit={handleCreateTask}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--white)", margin: 0 }}>
              Add To-Do Task
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>TITLE</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Clean up github repository"
                required
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>DESCRIPTION</label>
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>DUE DATE</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  style={{
                    padding: "10px",
                    background: "var(--field)",
                    border: "1px solid var(--border-2)",
                    borderRadius: "8px",
                    color: "var(--cream)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>PRIORITY</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  style={{
                    padding: "10px",
                    background: "var(--field)",
                    border: "1px solid var(--border-2)",
                    borderRadius: "8px",
                    color: "var(--cream)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>LINK TO GOAL</label>
              <select
                value={taskGoalId}
                onChange={(e) => setTaskGoalId(e.target.value)}
                style={{
                  padding: "10px",
                  background: "var(--field)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "8px",
                  color: "var(--cream)",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">General Task (None)</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => setShowTaskModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid var(--border-2)",
                  color: "var(--muted)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "var(--blue)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
