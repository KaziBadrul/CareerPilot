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
  XCircle,
  Clock,
  Trophy,
  Sparkles,
  AlertCircle,
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
}

const COLUMNS: Column[] = [
  {
    id: "applied",
    label: "Applied",
    icon: <Clock size={14} />,
    accentColor: "#0047FF", // Electric Blue
    bgColor: "#FFFEF0",
  },
  {
    id: "interviewing",
    label: "Interviewing",
    icon: <TrendingUp size={14} />,
    accentColor: "#FF5500", // Intense Orange
    bgColor: "#FFFEF0",
  },
  {
    id: "offer",
    label: "Offer",
    icon: <Trophy size={14} />,
    accentColor: "#C8FF00", // Neon Chartreuse
    bgColor: "#FFFEF0",
  },
  {
    id: "rejected",
    label: "Rejected",
    icon: <XCircle size={14} />,
    accentColor: "#0A0A0A", // Flat Pitch Black
    bgColor: "#FFFEF0",
  },
];

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

  const handleDragStart = (e: React.DragEvent, job: SavedJob) => {
    dragJobRef.current = job;
    setDraggedId(job.id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      const el = document.getElementById(`card-${job.id}`);
      if (el) el.style.opacity = "0.4";
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

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: colId } : j)),
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
      setJobs(prevJobs);
    }
  };

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

  const getColJobs = (colId: ColumnId) => jobs.filter((j) => j.status === colId);

  if (!user || loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FFFEF0",
          fontFamily: "'Space Grotesk', sans-serif",
          gap: "12px",
        }}
      >
        <Loader2 size={28} color="#0047FF" className="animate-spin" />
        <p style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#0A0A0A" }}>
          Loading Pipeline Framework...
        </p>
      </div>
    );
  }

  const totalJobs = jobs.length;

  return (
    <>
      {modalJob && (
        <JobModal job={modalJob} onClose={() => setModalJob(null)} />
      )}
      <div
        style={{
          minHeight: "100vh",
          background: "#FFFEF0",
          padding: "40px 24px",
          boxSizing: "border-box",
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#0A0A0A",
        }}
      >
        {/* Top Branding Section Header */}
        <div style={{ marginBottom: "32px", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "5px 5px 0px #0A0A0A", background: "transparent" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ width: "6px", height: "24px", background: "#0047FF", border: "2px solid #0A0A0A" }} />
                <h1 style={{ fontSize: "22px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  Application Tracker
                </h1>
              </div>
              <p style={{ color: "#555", fontSize: "14px", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                Drag your indexed tokens between state matrices to update your pipeline vectors in real time.
              </p>
            </div>

            {/* Quick Filter Metadata Counters */}
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
                      background: col.accentColor === "#0A0A0A" ? "#0A0A0A" : "#FFFEF0",
                      border: "2px solid #0A0A0A",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: col.accentColor === "#0A0A0A" ? "#FFFEF0" : "#0A0A0A",
                      textTransform: "uppercase",
                      boxShadow: "2px 2px 0px #0A0A0A",
                    }}
                  >
                    {col.icon}
                    <span>{count} {col.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neo Segmented Custom Progress Bar */}
          {totalJobs > 0 && (
            <div
              style={{
                marginTop: "24px",
                borderTop: "3px dashed #0A0A0A",
                paddingTop: "20px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#666", flexShrink: 0 }}>
                Pipeline Flow Ratio:
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  height: "16px",
                  border: "2px solid #0A0A0A",
                  background: "#FFFEF0",
                  overflow: "hidden",
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
                        borderRight: "2px solid #0A0A0A",
                        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  );
                })}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", background: "#C8FF00", border: "2px solid #0A0A0A", padding: "2px 8px", flexShrink: 0 }}>
                {totalJobs} Loaded
              </span>
            </div>
          )}
        </div>

        {/* Empty State Vector View */}
        {totalJobs === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "64px 24px",
              background: "transparent",
              border: "3px dashed #0A0A0A",
              textAlign: "center",
            }}
          >
            <Briefcase size={32} color="#0A0A0A" />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em", color: "#0A0A0A", margin: "0 0 6px" }}>
                Pipeline Register Empty
              </p>
              <p style={{ fontSize: "13px", color: "#555", margin: 0, fontWeight: 500 }}>
                Discover positions on the Job Hunter terminal and save them to seed this interface.
              </p>
            </div>
          </div>
        ) : (
          /* Kanban Responsive Board Grid Component */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
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
                    background: isOver ? "rgba(200,255,0,0.05)" : "transparent",
                    border: isOver ? "3px solid #C8FF00" : "3px solid #0A0A0A",
                    boxShadow: isOver ? "6px 6px 0px #0A0A0A" : "4px 4px 0px #0A0A0A",
                    transition: "all 0.15s ease",
                    minHeight: "450px",
                  }}
                >
                  {/* Column Neo-Brutalist Header Strip */}
                  <div
                    style={{
                      background: col.accentColor,
                      borderBottom: "3px solid #0A0A0A",
                      padding: "12px 14px",
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
                        color: col.accentColor === "#C8FF00" || col.accentColor === "#FFFEF0" ? "#0A0A0A" : "#FFFEF0",
                        fontWeight: 900,
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {col.icon}
                      {col.label}
                    </div>
                    <span
                      style={{
                        background: "#0A0A0A",
                        color: "#FFFEF0",
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "2px 8px",
                        border: "1px solid #0A0A0A",
                      }}
                    >
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Matrix Card Stack Container */}
                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {colJobs.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "140px",
                          gap: "6px",
                          border: "2px dashed rgba(0,0,0,0.15)",
                          marginTop: "4px",
                        }}
                      >
                        <p style={{ fontSize: "11px", color: "#777", margin: 0, fontWeight: 700, textTransform: "uppercase" }}>
                          Drop Node Vector
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
            .kanban-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 640px) {
            .kanban-grid { grid-template-columns: 1fr !important; }
          }
          .kanban-card { cursor: grab; user-select: none; }
          .kanban-card:active { cursor: grabbing; }
          .kanban-card:hover .card-grip { opacity: 1 !important; }
          .kanban-card:hover .card-delete { opacity: 1 !important; }
        `}</style>
      </div>
    </>
  );
}

// ─── Individual Board Card Element ───────────────────────────────────────────────
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

  const scoreBadge =
    job.fit_score >= 75
      ? { bg: "#C8FF00", text: "#0A0A0A" }
      : job.fit_score >= 50
        ? { bg: "#0047FF", text: "#FFFEF0" }
        : { bg: "#FF5500", text: "#FFFEF0" };

  return (
    <div
      id={`card-${job.id}`}
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      onDragEnd={onDragEnd}
      onClick={() => onOpenModal(job)}
      className="kanban-card"
      style={{
        background: "#FFFEF0",
        border: "2px solid #0A0A0A",
        padding: "14px",
        transition: "all 0.1s ease",
        boxShadow: isDragging ? "6px 6px 0px #0A0A0A" : "2px 2px 0px #0A0A0A",
        position: "relative",
        transform: isDragging ? "rotate(1deg) scale(0.98)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "translate(-1px, -1px)";
          e.currentTarget.style.boxShadow = "4px 4px 0px #0A0A0A";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "2px 2px 0px #0A0A0A";
        }
      }}
    >
      {/* Structural Card Row Actions */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
        <div
          className="card-grip"
          style={{
            flexShrink: 0,
            color: "#0A0A0A",
            opacity: 0.25,
            transition: "opacity 0.15s",
            paddingTop: "2px",
          }}
        >
          <GripVertical size={13} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "14px",
              fontWeight: 900,
              color: "#0A0A0A",
              textTransform: "uppercase",
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
              fontSize: "12px",
              fontWeight: 700,
              color: "#555",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.company}
          </p>
        </div>

        {/* Flat Custom Target Delete Handle Toggle */}
        <button
          className="card-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(job.id);
          }}
          disabled={isDeleting}
          style={{
            flexShrink: 0,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "2px solid transparent",
            color: "#0A0A0A",
            cursor: isDeleting ? "not-allowed" : "pointer",
            opacity: 0,
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FF5500";
            e.currentTarget.style.borderColor = "#0A0A0A";
            e.currentTarget.style.color = "#FFFEF0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.color = "#0A0A0A";
          }}
          title="Remove application row"
        >
          {isDeleting ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Trash2 size={11} />
          )}
        </button>
      </div>

      {/* Profile Reasoning Context Box */}
      {job.notes && (
        <div
          style={{
            margin: "8px 0 12px",
            fontSize: "11px",
            color: "#0A0A0A",
            lineHeight: 1.4,
            background: "rgba(0,0,0,0.02)",
            borderLeft: "2px solid #0A0A0A",
            padding: "4px 8px",
            fontWeight: 500,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {job.notes}
        </div>
      )}

      {/* Lower Metrics Section Container Layout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "2px dashed #0A0A0A",
        }}
      >
        {/* Core Index Score Vector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: scoreBadge.bg,
            color: scoreBadge.text,
            border: "1px solid #0A0A0A",
            padding: "2px 6px",
          }}
        >
          <Sparkles size={10} />
          <span style={{ fontSize: "10px", fontWeight: 900, textTransform: "uppercase" }}>
            {job.fit_score}% Fit
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {appliedDate && (
            <span style={{ fontSize: "10px", color: "#666", fontWeight: 700, textTransform: "uppercase" }}>
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
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                border: "1px solid #0A0A0A",
                background: "#FFFEF0",
                color: "#0A0A0A",
                boxShadow: "1px 1px 0px #0A0A0A",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#C8FF00"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFEF0"; }}
              title="Open outbound job target posting link"
            >
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}