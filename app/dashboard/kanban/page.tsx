"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ExternalLink,
  Trash2,
  GripVertical,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { JobModal } from "@/app/dashboard/jobs/JobModal";
import type { Job } from "@/app/dashboard/jobs/types";

interface SavedJob {
  id: string;
  job_title: string;
  company: string;
  job_url: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  fit_score: number;
  applied_at: string | null;
  notes: string | null;
  created_at: string;
}

type ColumnId = "applied" | "interviewing" | "offer" | "rejected";

interface Column {
  id: ColumnId;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  headerBg: string;
}

const COLUMNS: Column[] = [
  {
    id: "applied",
    label: "Applied",
    icon: <Clock size={15} />,
    accentColor: "#60a5fa",
    bgColor: "rgba(37,99,235,0.06)",
    borderColor: "rgba(37,99,235,0.25)",
    headerBg: "rgba(37,99,235,0.12)",
  },
  {
    id: "interviewing",
    label: "Interviewing",
    icon: <TrendingUp size={15} />,
    accentColor: "#fbbf24",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.25)",
    headerBg: "rgba(245,158,11,0.12)",
  },
  {
    id: "offer",
    label: "Offer",
    icon: <Trophy size={15} />,
    accentColor: "#34d399",
    bgColor: "rgba(5,150,105,0.06)",
    borderColor: "rgba(5,150,105,0.25)",
    headerBg: "rgba(5,150,105,0.12)",
  },
  {
    id: "rejected",
    label: "Rejected",
    icon: <XCircle size={15} />,
    accentColor: "#f87171",
    bgColor: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.25)",
    headerBg: "rgba(239,68,68,0.12)",
  },
];

/** Map a saved DB record to the Job shape JobModal expects */
function toJob(saved: SavedJob): Job {
  return {
    id: saved.id,
    title: saved.job_title,
    company: saved.company,
    url: saved.job_url,
    fitScore: saved.fit_score,
    reasoning: saved.notes,
    description: null,
    location: null,
    location_details: null,
    posted_date: saved.applied_at,
    valid_through: null,
    applicant_count: null,
    is_remote: null,
    job_type: null,
    job_level: null,
    job_function: null,
    listing_type: null,
    skills: null,
    work_from_home: null,
    vacancy_count: null,
    experience_range: null,
    easy_apply: null,
    salary: "",
    salary_period: null,
    salary_minimum: null,
    salary_maximum: null,
    salary_currency: null,
    company_name: saved.company,
    company_type: null,
    company_founded: null,
    company_industry: null,
    company_url: null,
    company_website: null,
    company_logo: null,
    company_addresses: null,
    company_revenue: null,
    company_description: null,
    company_rating: null,
    employee_count: null,
    review_count: null,
    emails: [],
    phones: [],
    social_links: {},
    platform: null,
    platform_url: null,
    official_url: null,
    deadline: null,
    postedAt: null,
  };
}

export default function KanbanPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [modalJob, setModalJob] = useState<Job | null>(null);

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<ColumnId | null>(null);
  const dragJobRef = useRef<SavedJob | null>(null);

  const fetchJobs = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("job_applications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        fetchJobs(user.id);
      } catch {
        router.push("/login");
      }
    }
    init();
  }, [router, supabase, fetchJobs]);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent, job: SavedJob) => {
    dragJobRef.current = job;
    setDraggedId(job.id);
    e.dataTransfer.effectAllowed = "move";
    // Ghost image delay trick to allow state to update first
    setTimeout(() => {
      const el = document.getElementById(`card-${job.id}`);
      if (el) el.style.opacity = "0.35";
    }, 0);
  };

  const handleDragEnd = () => {
    if (draggedId) {
      const el = document.getElementById(`card-${draggedId}`);
      if (el) el.style.opacity = "1";
    }
    setDraggedId(null);
    setDragOverCol(null);
    dragJobRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
  };

  const handleDrop = async (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    const job = dragJobRef.current;
    if (!job || job.status === colId) {
      setDragOverCol(null);
      return;
    }

    const prevJobs = [...jobs];

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: colId } : j,
      ),
    );
    setDragOverCol(null);

    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: colId })
        .eq("id", job.id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert on failure
      setJobs(prevJobs);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (jobId: string) => {
    setDeleting(jobId);
    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", jobId);

      if (error) throw error;
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const getColJobs = (colId: ColumnId) => jobs.filter((j) => j.status === colId);

  if (!user || loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--muted)",
        }}
      >
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  const totalJobs = jobs.length;

  return (
    <>
      {/* Job Detail Modal */}
      {modalJob && (
        <JobModal job={modalJob} onClose={() => setModalJob(null)} />
      )}
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "36px 32px",
          boxSizing: "border-box",
        }}
      >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
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
              Application Tracker
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "14.5px", margin: 0 }}>
              Drag cards between columns to update your application status
            </p>
          </div>

          {/* Summary pills */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {COLUMNS.map((col) => {
              const count = getColJobs(col.id).length;
              return (
                <div
                  key={col.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: col.bgColor,
                    border: `1px solid ${col.borderColor}`,
                    borderRadius: "20px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: col.accentColor,
                  }}
                >
                  {col.icon}
                  {count} {col.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        {totalJobs > 0 && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "var(--muted)", flexShrink: 0 }}
            >
              Pipeline
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                height: "8px",
                borderRadius: "4px",
                overflow: "hidden",
                background: "var(--field)",
                gap: "2px",
              }}
            >
              {COLUMNS.map((col) => {
                const pct = (getColJobs(col.id).length / totalJobs) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={col.id}
                    title={`${col.label}: ${getColJobs(col.id).length}`}
                    style={{
                      width: `${pct}%`,
                      background: col.accentColor,
                      transition: "width 0.4s ease",
                      borderRadius: "4px",
                    }}
                  />
                );
              })}
            </div>
            <span
              style={{ fontSize: "12px", color: "var(--muted)", flexShrink: 0 }}
            >
              {totalJobs} total
            </span>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {totalJobs === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "80px 24px",
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Briefcase size={40} color="var(--muted)" style={{ opacity: 0.3 }} />
          <div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--cream)",
                margin: "0 0 6px",
                fontFamily: "var(--font-display)",
              }}
            >
              No applications yet
            </p>
            <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
              Save jobs from the Job Hunter to start tracking them here
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            alignItems: "start",
          }}
          className="kanban-grid"
        >
          {COLUMNS.map((col) => {
            const colJobs = getColJobs(col.id);
            const isOver = dragOverCol === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{
                  background: isOver ? col.bgColor : "var(--surface)",
                  border: `1px solid ${isOver ? col.accentColor : "var(--border)"}`,
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  boxShadow: isOver
                    ? `0 0 0 2px ${col.accentColor}30`
                    : "none",
                  minHeight: "300px",
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    background: col.headerBg,
                    borderBottom: `1px solid ${col.borderColor}`,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: col.accentColor,
                      fontWeight: 600,
                      fontSize: "13.5px",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {col.icon}
                    {col.label}
                  </div>
                  <span
                    style={{
                      background: col.bgColor,
                      border: `1px solid ${col.borderColor}`,
                      color: col.accentColor,
                      fontSize: "11px",
                      fontWeight: 700,
                      borderRadius: "10px",
                      padding: "2px 8px",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {colJobs.length}
                  </span>
                </div>

                {/* Cards */}
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minHeight: "200px",
                  }}
                >
                  {colJobs.length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "120px",
                        gap: "8px",
                        opacity: isOver ? 0.8 : 0.35,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          border: `2px dashed ${col.accentColor}`,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: col.accentColor,
                        }}
                      >
                        +
                      </div>
                      <p
                        style={{
                          fontSize: "11.5px",
                          color: "var(--muted)",
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        Drop cards here
                      </p>
                    </div>
                  ) : (
                    colJobs.map((job) => (
                      <KanbanCard
                        key={job.id}
                        job={job}
                        col={col}
                        isDragging={draggedId === job.id}
                        isDeleting={deleting === job.id}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDelete={handleDelete}
                        onOpenModal={(j) => setModalJob(toJob(j))}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 1200px) {
          .kanban-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .kanban-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .kanban-card {
          cursor: pointer;
          user-select: none;
        }
        .kanban-card:hover .card-grip {
          opacity: 1 !important;
        }
        .kanban-card:hover .card-delete {
          opacity: 1 !important;
        }
      `}</style>
      </div>
    </>
  );
}

// ─── Kanban Card ────────────────────────────────────────────────────────────────
interface CardProps {
  job: SavedJob;
  col: Column;
  isDragging: boolean;
  isDeleting: boolean;
  onDragStart: (e: React.DragEvent, job: SavedJob) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
  onOpenModal: (job: SavedJob) => void;
}

function KanbanCard({
  job,
  col,
  isDragging,
  isDeleting,
  onDragStart,
  onDragEnd,
  onDelete,
  onOpenModal,
}: CardProps) {
  const validUrl =
    job.job_url &&
    (job.job_url.startsWith("http://") || job.job_url.startsWith("https://"));

  const appliedDate = job.applied_at
    ? new Date(job.applied_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : job.created_at
      ? new Date(job.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : null;

  const fitColor =
    job.fit_score >= 80
      ? "#34d399"
      : job.fit_score >= 60
        ? "#fbbf24"
        : "#f87171";

  return (
    <div
      id={`card-${job.id}`}
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      onDragEnd={onDragEnd}
      onClick={() => onOpenModal(job)}
      className="kanban-card"
      style={{
        background: isDragging ? "var(--field)" : "var(--bg)",
        border: `1px solid ${isDragging ? col.accentColor : "var(--border)"}`,
        borderRadius: "12px",
        padding: "14px",
        transition: "box-shadow 0.18s, border-color 0.18s, opacity 0.2s, background 0.15s",
        boxShadow: isDragging
          ? `0 8px 24px rgba(0,0,0,0.35), 0 0 0 2px ${col.accentColor}50`
          : "0 1px 4px rgba(0,0,0,0.15)",
        position: "relative",
        transform: isDragging ? "rotate(1.5deg)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = col.accentColor;
          e.currentTarget.style.background = "var(--surface)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--bg)";
        }
      }}
    >
      {/* Top row: grip + title + delete */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {/* Grip */}
        <div
          className="card-grip"
          style={{
            flexShrink: 0,
            color: "var(--muted)",
            opacity: 0,
            transition: "opacity 0.15s",
            paddingTop: "1px",
          }}
        >
          <GripVertical size={14} />
        </div>

        {/* Title + company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "var(--white)",
              fontFamily: "var(--font-display)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={job.job_title}
          >
            {job.job_title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "11.5px",
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.company}
          </p>
        </div>

        {/* Delete */}
        <button
          className="card-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(job.id);
          }}
          disabled={isDeleting}
          style={{
            flexShrink: 0,
            width: "26px",
            height: "26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid transparent",
            borderRadius: "6px",
            color: "var(--muted)",
            cursor: isDeleting ? "not-allowed" : "pointer",
            opacity: 0,
            transition: "opacity 0.15s, background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.12)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
          title="Remove"
        >
          {isDeleting ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Trash2 size={11} />
          )}
        </button>
      </div>

      {/* Notes */}
      {job.notes && (
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "11px",
            color: "var(--muted)",
            fontStyle: "italic",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {job.notes}
        </p>
      )}

      {/* Bottom row: fit score + date + link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid var(--border)",
        }}
      >
        {/* Fit score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <CheckCircle2 size={11} color={fitColor} />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: fitColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {job.fit_score}% fit
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {appliedDate && (
            <span style={{ fontSize: "10.5px", color: "var(--muted)" }}>
              {appliedDate}
            </span>
          )}
          {validUrl && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                color: col.accentColor,
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              title="Open job posting"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
