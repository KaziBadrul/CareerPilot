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
  LogOut,
  Sparkles,
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

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Application Domain Registers
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal / Transaction States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Buffer registers for Goal construction 
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDesc, setGoalDesc] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");

  // Buffer registers for Task construction
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskGoalId, setTaskGoalId] = useState("");

  // Temporal Tracking Registers
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
      if (res.ok) {
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

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedCompleted = !task.completed;
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
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: !updatedCompleted } : t))
        );
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

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

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Confirm hard purge of target matrix and dependent array chains?")) return;
    try {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      setTasks((prev) => prev.filter((t) => t.goal_id !== goalId));
      await fetch(`/api/goals?goalId=${goalId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      await fetch(`/api/tasks?taskId=${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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
    setSelectedDayTasks(getTasksForDate(day));
    setSelectedDayGoals(getGoalsForDate(day));
    setSelectedDateStr(target.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={{ background: "transparent", border: "1px solid rgba(10,10,10,0.08)" }} />);
  }

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
          padding: "8px 4px",
          minHeight: "52px",
          border: "2px solid #0A0A0A",
          cursor: "pointer",
          background: isToday ? "#C8FF00" : "#FFFEF0",
          boxShadow: isToday ? "2px 2px 0px #0A0A0A" : "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "transform 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-1px, -1px)";
          e.currentTarget.style.background = isToday ? "#C8FF00" : "#0047FF";
          e.currentTarget.style.color = isToday ? "#0A0A0A" : "#FFFEF0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.background = isToday ? "#C8FF00" : "#FFFEF0";
          e.currentTarget.style.color = "#0A0A0A";
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 800 }}>{day}</span>
        {hasItems && (
          <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center" }}>
            {dayGoals.map((g) => (
              <span key={g.id} style={{ width: "6px", height: "6px", background: "#FF5500", border: "1px solid #0A0A0A" }} title={`Goal: ${g.title}`} />
            ))}
            {dayTasks.map((t) => (
              <span key={t.id} style={{ width: "6px", height: "6px", background: t.completed ? "#0A0A0A" : "#0047FF", border: "1px solid #0A0A0A" }} title={`Task: ${t.title}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const sidebarLinkStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "#0047FF" : "transparent",
    border: "2px solid #0A0A0A",
    padding: "10px 14px",
    fontSize: "13.5px",
    fontWeight: 800,
    color: active ? "#FFFEF0" : "#0A0A0A",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    textTransform: "uppercase",
    boxShadow: active ? "3px 3px 0px #0A0A0A" : "none",
    transition: "all 0.1s ease",
  });

  if (loadingAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFFEF0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif", gap: "12px" }}>
        <Loader2 className="animate-spin" size={32} color="#0047FF" />
        <p style={{ fontSize: "12px", fontWeight: 900, textTransform: "uppercase", color: "#0A0A0A" }}>Synchronizing Manifest Coordinates...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFEF0", display: "flex", color: "#0A0A0A", fontFamily: "'Space Grotesk', sans-serif" }}>
      
      {/* Sidebar Terminal Component */}
      <aside style={{ width: "260px", background: "#FFFEF0", borderRight: "3px solid #0A0A0A", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px 20px", boxSizing: "border-box" }}>
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "36px" }}>
            <div style={{ width: "28px", height: "28px", background: "#C8FF00", border: "2px solid #0A0A0A", display: "flex", alignItems: "center", justifyOrigin: "center", justifyContent: "center", boxShadow: "2px 2px 0px #0A0A0A" }}>
              <Zap size={14} color="#0A0A0A" style={{ fill: "#0A0A0A" }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: "18px", color: "#0A0A0A", textTransform: "uppercase", letterSpacing: "-0.02em" }}>CareerPilot</span>
          </Link>

          <div style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "12px 14px", marginBottom: "28px", boxShadow: "3px 3px 0px #0A0A0A" }}>
            <p style={{ margin: "0 0 4px", fontSize: "10px", color: "#666", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>OPERATOR ID</p>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/dashboard" style={sidebarLinkStyle(false)}><Zap size={15} />Overview</Link>
            <Link href="/dashboard/jobs" style={sidebarLinkStyle(false)}><Briefcase size={15} />Job Hunter</Link>
            <Link href="/dashboard/assistant" style={sidebarLinkStyle(false)}><MessageSquare size={15} />AI Terminal</Link>
            <Link href="/dashboard/goals" style={sidebarLinkStyle(true)}><Target size={15} />Goals & Ledger</Link>
            <div style={{ borderTop: "2px dashed #0A0A0A", my: "4px", paddingTop: "6px" }} />
            <Link href="/dashboard/searches" style={sidebarLinkStyle(false)}><Clock size={15} />Index Logs</Link>
            <Link href="/dashboard/saved-jobs" style={sidebarLinkStyle(false)}><Bookmark size={15} />Saved Nodes</Link>
          </nav>
        </div>

        <button onClick={handleLogout} style={{ background: "#FF5500", border: "2px solid #0A0A0A", padding: "12px", color: "#FFFEF0", cursor: "pointer", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "3px 3px 0px #0A0A0A" }}>
          <LogOut size={15} />Sign Out Terminal
        </button>
      </aside>

      {/* Main Content Workspace Layout */}
      <main style={{ flex: 1, padding: "40px", overflowY: "auto", boxSizing: "border-box" }}>
        
        {/* Core Control Panel Deck Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "36px", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "5px 5px 0px #0A0A0A" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "6px", height: "24px", background: "#FF5500", border: "2px solid #0A0A0A" }} />
              <h1 style={{ fontSize: "24px", fontWeight: 900, textTransform: "uppercase", margin: 0, letterSpacing: "-0.01em" }}>Goals & Milestone Deadlines</h1>
            </div>
            <p style={{ color: "#555", fontSize: "14px", margin: 0, fontWeight: 500 }}>Establish execution vectors, segment task maps, and handle target chronological thresholds.</p>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setShowGoalModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0px #0A0A0A" }}>
              <Plus size={15} /> New Goal Matrix
            </button>
            <button onClick={() => setShowTaskModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#0047FF", color: "#FFFEF0", border: "2px solid #0A0A0A", fontSize: "13px", fontWeight: 800, textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0px #0A0A0A" }}>
              <Plus size={15} /> Append Task Item
            </button>
          </div>
        </div>

        {loadingData ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
            <Loader2 className="animate-spin" size={24} color="#0047FF" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "32px" }} className="content-grid">
            
            {/* LEFT COLUMN: CRITICAL PATH STRATEGIES & OPERATIONAL TASKS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* Active Career Strategy Blocks */}
              <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "4px 4px 0px #0A0A0A" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 20px" }}>Strategic Matrix Tracks</h2>

                {goals.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", border: "2px dashed rgba(0,0,0,0.15)" }}>
                    <Target size={28} style={{ marginBottom: "12px" }} />
                    <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Zero Strategy Tracks Initialized</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {goals.map((goal) => {
                      const stats = getGoalStats(goal.id);
                      const targetDate = new Date(goal.target_date);
                      const isOverdue = targetDate < new Date() && goal.status === "in_progress";

                      return (
                        <div key={goal.id} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "16px", boxShadow: "3px 3px 0px #0A0A0A" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                            <div>
                              <h3 style={{ fontSize: "15px", fontWeight: 900, textTransform: "uppercase", margin: "0 0 4px" }}>{goal.title}</h3>
                              <p style={{ fontSize: "13px", color: "#444", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{goal.description || "Context parameters unassigned."}</p>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <select value={goal.status} onChange={(e) => handleUpdateGoalStatus(goal.id, e.target.value as any)} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", padding: "4px", outline: "none", cursor: "pointer" }}>
                                <option value="in_progress">Processing</option>
                                <option value="completed">Resolved</option>
                                <option value="failed">Halted</option>
                              </select>
                              <button onClick={() => handleDeleteGoal(goal.id)} style={{ background: "transparent", border: "none", color: "#FF5500", cursor: "pointer", padding: "4px" }}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Linear Metrics Progress Framework */}
                          <div style={{ marginBottom: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginBottom: "4px" }}>
                              <span>Convergence Scale</span>
                              <span>{stats.completed}/{stats.total} Nodes ({stats.percentage}%)</span>
                            </div>
                            <div style={{ height: "14px", background: "#FFFEF0", border: "2px solid #0A0A0A", overflow: "hidden" }}>
                              <div style={{ width: `${stats.percentage}%`, height: "100%", background: "#C8FF00", borderRight: stats.percentage > 0 ? "2px solid #0A0A0A" : "none", transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                            </div>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 700 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: isOverdue ? "#FF5500" : "rgba(0,0,0,0.04)", color: isOverdue ? "#FFFEF0" : "#0A0A0A", border: isOverdue ? "1px solid #0A0A0A" : "none", padding: "2px 6px" }}>
                              <Calendar size={12} /> Target: {targetDate.toLocaleDateString()}
                              {isOverdue && <span style={{ fontWeight: 900, display: "inline-flex", alignItems: "center", gap: "2px" }}><AlertTriangle size={10} /> CRITICAL OVERDUE</span>}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Functional Itemized Registers */}
              <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "4px 4px 0px #0A0A0A" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em", margin: "0 0 20px" }}>Operational Task Registry</h2>

                {tasks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", border: "2px dashed rgba(0,0,0,0.15)" }}>
                    <CheckCircle2 size={28} style={{ marginBottom: "12px" }} />
                    <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>Register Vector Clean</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tasks.map((task) => {
                      const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

                      return (
                        <div key={task.id} style={{ background: task.completed ? "rgba(0,0,0,0.02)" : "#FFFEF0", border: "2px solid #0A0A0A", padding: "14px", display: "flex", alignItems: "flex-start", gap: "14px", boxShadow: "2px 2px 0px #0A0A0A" }}>
                          <button onClick={() => handleToggleTask(task)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0A0A0A", marginTop: "2px" }}>
                            {task.completed ? <CheckCircle2 size={18} style={{ fill: "#C8FF00" }} /> : <Circle size={18} />}
                          </button>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                              <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", textDecoration: task.completed ? "line-through" : "none" }}>
                                {task.title}
                              </p>
                              <span style={{ fontSize: "9px", fontWeight: 900, textTransform: "uppercase", padding: "1px 6px", border: "1px solid #0A0A0A", background: task.priority === "high" ? "#FF5500" : task.priority === "medium" ? "#0047FF" : "#FFFEF0", color: task.priority === "high" || task.priority === "medium" ? "#FFFEF0" : "#0A0A0A" }}>
                                {task.priority}
                              </span>
                            </div>

                            {task.description && <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#555", fontWeight: 500 }}>{task.description}</p>}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px", fontWeight: 700 }}>
                              {task.due_date && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: isOverdue ? "#FF5500" : "#666" }}>
                                  <Calendar size={12} /> Limit: {new Date(task.due_date).toLocaleDateString()}
                                  {isOverdue && <span style={{ fontWeight: 900 }}>[OVERDUE BOUND]</span>}
                                </span>
                              )}
                              {task.goal_id && task.goals && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#0047FF", textTransform: "uppercase" }}>
                                  <Target size={12} /> Track: {task.goals.title}
                                </span>
                              )}
                            </div>
                          </div>

                          <button onClick={() => handleDeleteTask(task.id)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#FF5500")} onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: RECTILINEAR SCHEDULE DECK */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* Month Dimension Grid Map */}
              <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "4px 4px 0px #0A0A0A" }}>
                <div style={{ display: "flex", alignItems: "center", justifyOrigin: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 900, textTransform: "uppercase", margin: 0 }}>
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={handlePrevMonth} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "4px 6px", cursor: "pointer", fontWeight: 800 }}><ChevronLeft size={14} /></button>
                    <button onClick={handleNextMonth} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "4px 6px", cursor: "pointer", fontWeight: 800 }}><ChevronRight size={14} /></button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", textAlign: "center", marginBottom: "8px" }}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <span key={day} style={{ fontSize: "11px", fontWeight: 900, textTransform: "uppercase", color: "#666" }}>{day}</span>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
                  {calendarCells}
                </div>
              </div>

              {/* Matrix Node Focal Inspector */}
              <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "4px 4px 0px #0A0A0A", minHeight: "180px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.01em", margin: "0 0 16px", paddingBottom: "8px", borderBottom: "2px dashed #0A0A0A" }}>
                  {selectedDateStr ? `Threshold Logs // ${selectedDateStr}` : "Focus Node Inspection Parameters"}
                </h3>

                {selectedDateStr ? (
                  selectedDayTasks.length === 0 && selectedDayGoals.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "#666", fontWeight: 500, margin: 0 }}>No chronological deadlocks noted for this cycle.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {selectedDayGoals.map((g) => (
                        <div key={g.id} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "10px 12px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "2px 2px 0px #0A0A0A" }}>
                          <Target size={14} color="#FF5500" />
                          <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#FF5500" }}>Strategy Target: {g.title}</span>
                        </div>
                      ))}

                      {selectedDayTasks.map((t) => (
                        <div key={t.id} style={{ background: "#FFFEF0", border: "2px solid #0A0A0A", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", boxShadow: "2px 2px 0px #0A0A0A" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                            <button onClick={() => handleToggleTask(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#0A0A0A" }}>
                              {t.completed ? <CheckCircle2 size={16} style={{ fill: "#C8FF00" }} /> : <Circle size={16} />}
                            </button>
                            <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", textDecoration: t.completed ? "line-through" : "none", color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
                          </div>
                          <span style={{ fontSize: "9px", fontWeight: 900, border: "1px solid #0A0A0A", padding: "1px 4px", background: t.priority === "high" ? "#FF5500" : "#FFFEF0", color: t.priority === "high" ? "#FFFEF0" : "#0A0A0A" }}>{t.priority}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <p style={{ fontSize: "13px", color: "#666", fontWeight: 500, margin: 0 }}>Select an absolute operational sub-node day inside the tracker coordinate array grid above.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Goal Matrix Creator Component Modal */}
      {showGoalModal && (
        <div onClick={() => setShowGoalModal(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.5)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleCreateGoal} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px", background: "#FFFEF0", border: "3px solid #0A0A0A", padding: "28px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "8px 8px 0px #0A0A0A" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 900, textTransform: "uppercase", margin: 0 }}>Initialize Target Strategy</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>STRATEGY TITLE IDENTIFIER</label>
              <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="e.g. INFRASTRUCTURE ROLE ACQUISITION" required style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>OPERATIONAL SPECIFICATION PARAMETERS</label>
              <textarea value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} placeholder="Detail the structural scope requirements..." rows={3} style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 500, outline: "none", resize: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>CHRONOLOGICAL LIMIT BOUNDARY</label>
              <input type="date" value={goalTargetDate} onChange={(e) => setGoalTargetDate(e.target.value)} required style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button type="button" onClick={() => setShowGoalModal(false)} style={{ flex: 1, padding: "12px", background: "transparent", border: "2px solid #0A0A0A", fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Abort</button>
              <button type="submit" disabled={submitting} style={{ flex: 1, padding: "12px", background: "#C8FF00", border: "2px solid #0A0A0A", color: "#0A0A0A", fontWeight: 900, textTransform: "uppercase", cursor: "pointer", boxShadow: "2px 2px 0px #0A0A0A" }}>{submitting ? "Seeding..." : "Commit Vector"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Task Matrix Creator Component Modal */}
      {showTaskModal && (
        <div onClick={() => setShowTaskModal(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.5)", backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleCreateTask} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "460px", background: "#FFFEF0", border: "3px solid #0A0A0A", padding: "28px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "8px 8px 0px #0A0A0A" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 900, textTransform: "uppercase", margin: 0 }}>Append Task Parameter Block</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>TASK TITLE RECORD</label>
              <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. PROFILE SANITIZATION AND REFACTOR" required style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>ANNOTATION SUB-LOG</label>
              <textarea value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} placeholder="Functional breakdown descriptions..." rows={2} style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 500, outline: "none", resize: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>DUE LIMIT</label>
                <input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>CRITICALITY RANK</label>
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as any)} style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none", cursor: "pointer" }}>
                  <option value="low">LOW PRIORITY</option>
                  <option value="medium">MEDIUM CORE</option>
                  <option value="high">HIGH CRITICAL</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 900, color: "#0A0A0A" }}>LINKED PARENT TRACK MATRIX</label>
              <select value={taskGoalId} onChange={(e) => setTaskGoalId(e.target.value)} style={{ padding: "10px", background: "#FFFEF0", border: "2px solid #0A0A0A", color: "#0A0A0A", fontFamily: "inherit", fontWeight: 700, outline: "none", cursor: "pointer" }}>
                <option value="">STANDALONE NODE OBJECT</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>{goal.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button type="button" onClick={() => setShowTaskModal(false)} style={{ flex: 1, padding: "12px", background: "transparent", border: "2px solid #0A0A0A", fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }}>Abort</button>
              <button type="submit" disabled={submitting} style={{ flex: 1, padding: "12px", background: "#0047FF", border: "2px solid #0A0A0A", color: "#FFFEF0", fontWeight: 900, textTransform: "uppercase", cursor: "pointer", boxShadow: "2px 2px 0px #0A0A0A" }}>{submitting ? "Appending..." : "Inject Node"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}