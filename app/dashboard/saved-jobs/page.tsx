"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Briefcase,
  Loader2,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

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

const statusColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  applied: { bg: "rgba(37,99,235,0.12)", text: "#60a5fa", label: "Applied" },
  interviewing: {
    bg: "rgba(245,158,11,0.12)",
    text: "#fbbf24",
    label: "Interviewing",
  },
  offer: { bg: "rgba(5,150,105,0.12)", text: "#34d399", label: "Offer" },
  rejected: { bg: "rgba(239,68,68,0.12)", text: "#f87171", label: "Rejected" },
};

export default function SavedJobsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

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
      } catch (err) {
        console.error("Auth error:", err);
        router.push("/login");
      }
    }
    init();
  }, [router, supabase, fetchJobs]);

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
      console.error("Failed to delete job:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) throw error;
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: newStatus as SavedJob["status"] }
            : j,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredJobs = filterStatus
    ? jobs.filter((j) => j.status === filterStatus)
    : jobs;

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "var(--muted)",
        }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--white)",
            margin: "0 0 8px",
          }}
        >
          Saved Jobs
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", margin: 0 }}>
          Track your applications and interview progress
        </p>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            color: "var(--muted)",
          }}
        >
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <Bookmark
            size={32}
            color="var(--muted)"
            style={{ opacity: 0.3, marginBottom: "12px" }}
          />
          <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0 }}>
            No saved jobs yet. Start saving jobs from the job hunter!
          </p>
        </div>
      ) : (
        <>
          {/* Status filter */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setFilterStatus("")}
              style={{
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 500,
                background:
                  filterStatus === "" ? "var(--blue)" : "var(--field)",
                color: filterStatus === "" ? "#fff" : "var(--muted)",
                border:
                  "1px solid " +
                  (filterStatus === "" ? "var(--blue)" : "var(--border-2)"),
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                if (filterStatus === "") {
                  e.currentTarget.style.background = "var(--blue-glow)";
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus === "") {
                  e.currentTarget.style.background = "var(--blue)";
                }
              }}
            >
              All ({jobs.length})
            </button>
            {Object.entries(statusColors).map(([status, config]) => {
              const count = jobs.filter((j) => j.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background:
                      filterStatus === status ? config.bg : "var(--field)",
                    color:
                      filterStatus === status ? config.text : "var(--muted)",
                    border:
                      "1px solid " +
                      (filterStatus === status
                        ? config.text
                        : "var(--border-2)"),
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Jobs table */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const config = statusColors[job.status];
                const appliedDate = job.applied_at
                  ? new Date(job.applied_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Not applied";
                const validUrl =
                  job.job_url &&
                  (job.job_url.startsWith("http://") ||
                    job.job_url.startsWith("https://"));

                return (
                  <div
                    key={job.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "16px",
                      alignItems: "start",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "10px",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--white)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {job.job_title}
                        </h3>
                        {validUrl && (
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              color: "var(--blue-light)",
                              textDecoration: "none",
                              flexShrink: 0,
                            }}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "var(--muted)",
                          margin: "0 0 10px",
                        }}
                      >
                        {job.company}
                      </p>
                      {job.notes && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--cream)",
                            fontStyle: "italic",
                            margin: 0,
                            opacity: 0.8,
                          }}
                        >
                          {job.notes}
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-end",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            background: "rgba(37,99,235,0.12)",
                            border: "1px solid rgba(37,99,235,0.2)",
                            borderRadius: "8px",
                            padding: "6px 12px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#60a5fa",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {job.fit_score}%
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              color: "#60a5fa",
                              opacity: 0.8,
                            }}
                          >
                            fit
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            background: config.bg,
                            border: `1px solid ${config.text}`,
                            borderRadius: "8px",
                            padding: "6px 12px",
                          }}
                        >
                          <select
                            value={job.status}
                            onChange={(e) =>
                              handleStatusChange(job.id, e.target.value)
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              color: config.text,
                              fontSize: "12px",
                              fontWeight: 600,
                              fontFamily: "var(--font-body)",
                              cursor: "pointer",
                              padding: 0,
                              outline: "none",
                            }}
                          >
                            <option value="applied">
                              {statusColors.applied.label}
                            </option>
                            <option value="interviewing">
                              {statusColors.interviewing.label}
                            </option>
                            <option value="offer">
                              {statusColors.offer.label}
                            </option>
                            <option value="rejected">
                              {statusColors.rejected.label}
                            </option>
                          </select>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--muted)",
                          margin: 0,
                        }}
                      >
                        {appliedDate}
                      </p>

                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={deleting === job.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          background: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          borderRadius: "8px",
                          color: "#f87171",
                          cursor:
                            deleting === job.id ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (deleting !== job.id) {
                            e.currentTarget.style.background =
                              "rgba(239,68,68,0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(239,68,68,0.08)";
                        }}
                        title="Delete job"
                      >
                        {deleting === job.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "var(--muted)",
                  background: "var(--surface)",
                  border: "1px dashed var(--border)",
                  borderRadius: "12px",
                }}
              >
                <Briefcase
                  size={28}
                  style={{ opacity: 0.3, marginBottom: "12px" }}
                />
                <p style={{ fontSize: "13px", margin: 0 }}>
                  No jobs match the selected status
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
