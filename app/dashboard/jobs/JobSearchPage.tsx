"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JobCard } from "./JobCard";
import { JobModal } from "./JobModal";
import {
  Search,
  Loader2,
  Briefcase,
  AlertCircle,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import type { Job } from "./types";

interface ParsedSearch {
  keyword: string;
  country?: string;
  remote_only?: boolean;
}

const EXAMPLES = [
  "ML internships in Dhaka open this month",
  "Remote backend developer roles",
  "Data science jobs in Bangladesh",
  "Junior frontend engineer positions",
];

export function JobSearchPage({
  userId,
  hasCV,
  initialQuery = "",
}: {
  userId: string;
  hasCV: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<ParsedSearch | null>(null);
  const [searched, setSearched] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const autoSearchQuery = useRef<string>("");

  const search = useCallback(async (q?: string) => {
    const sq = (q ?? query).trim();
    if (!sq || loading) return;
    if (q) setQuery(q);
    setLoading(true);
    setError("");
    setSearched(true);
    setLocationFilter("");
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, query: sq }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setJobs(data.jobs ?? []);
      setParsed(data.parsed ?? null);
      if (data.message) setError(data.message);

      // Save search to history
      try {
        await fetch("/api/jobs/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            query: sq,
            resultsCount: data.jobs?.length ?? 0,
            parsedData: data.parsed ?? null,
          }),
        });
      } catch (err) {
        console.error("Failed to save search history:", err);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loading, query, userId]);

  useEffect(() => {
    const q = initialQuery.trim();
    if (!q || autoSearchQuery.current === q) return;

    autoSearchQuery.current = q;
    setQuery(q);
    void search(q);
  }, [initialQuery, search]);

  // Derive unique locations from fetched jobs
  const locationOptions = useMemo(() => {
    const locs = jobs
      .map((j) => j.location)
      .filter((l): l is string => !!l && l.trim() !== "");
    return Array.from(new Set(locs)).sort();
  }, [jobs]);

  // Apply location filter
  const displayedJobs = useMemo(() => {
    if (!locationFilter) return jobs;
    return jobs.filter((j) => j.location === locationFilter);
  }, [jobs, locationFilter]);

  return (
    <div style={{ maxWidth: "740px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--white)",
            margin: "0 0 4px",
          }}
        >
          Job hunter
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "13.5px", margin: 0 }}>
          Search in plain English — each result is scored and explained against
          your CV
        </p>
      </div>

      {!hasCV && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#fbbf24",
            marginBottom: "20px",
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
          Upload your CV first so we can score and explain each job against your
          profile.
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={14}
            color="var(--muted)"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder='"ML internships in Dhaka open this month"'
            style={{
              width: "100%",
              paddingLeft: "36px",
              paddingRight: "14px",
              paddingTop: "10px",
              paddingBottom: "10px",
              background: "var(--field)",
              border: "1px solid var(--border-2)",
              borderRadius: "10px",
              color: "var(--cream)",
              fontSize: "13.5px",
              outline: "none",
              fontFamily: "var(--font-body)",
              boxSizing: "border-box",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border-2)")
            }
          />
        </div>
        <button
          onClick={() => search()}
          disabled={!query.trim() || loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            background:
              query.trim() && !loading ? "var(--blue)" : "rgba(37,99,235,0.3)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "13.5px",
            fontWeight: 500,
            cursor: query.trim() && !loading ? "pointer" : "not-allowed",
            fontFamily: "var(--font-body)",
            flexShrink: 0,
          }}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Search
        </button>
      </div>

      {!searched && (
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "11px",
              color: "var(--muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontWeight: 500,
            }}
          >
            Try these
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {EXAMPLES.map((q) => (
              <button
                key={q}
                onClick={() => search(q)}
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  background: "var(--field)",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(37,99,235,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "var(--cream)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "32px 0",
          }}
        >
          {/* Animated header skeleton */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "16px",
              padding: "0 16px",
            }}
          >
            <div
              style={{
                height: "20px",
                background:
                  "linear-gradient(90deg, var(--field) 0%, var(--surface) 50%, var(--field) 100%)",
                backgroundSize: "200% 100%",
                borderRadius: "6px",
                animation: "shimmer 2s infinite",
                width: "40%",
              }}
            />
            <div
              style={{
                height: "14px",
                background:
                  "linear-gradient(90deg, var(--field) 0%, var(--surface) 50%, var(--field) 100%)",
                backgroundSize: "200% 100%",
                borderRadius: "6px",
                animation: "shimmer 2s infinite 0.1s both",
                width: "60%",
              }}
            />
          </div>

          {/* Animated job card skeletons */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background:
                  "linear-gradient(90deg, var(--surface) 0%, var(--surface-hover) 50%, var(--surface) 100%)",
                backgroundSize: "200% 100%",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
                animation: `shimmer 2s infinite ${i * 0.15}s`,
              }}
            >
              {/* Logo */}
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  background: "var(--field)",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              />
              {/* Title */}
              <div
                style={{
                  height: "16px",
                  background: "var(--field)",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  width: "70%",
                }}
              />
              {/* Company */}
              <div
                style={{
                  height: "12px",
                  background: "var(--field)",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  width: "40%",
                }}
              />
              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    height: "10px",
                    background: "var(--field)",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
                <div
                  style={{
                    height: "10px",
                    background: "var(--field)",
                    borderRadius: "4px",
                    width: "100px",
                  }}
                />
              </div>
            </div>
          ))}

          {/* Loading text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "16px",
              color: "var(--muted)",
            }}
          >
            <Loader2 size={16} className="animate-spin" />
            <p style={{ fontSize: "13px", margin: 0 }}>
              Searching, scoring, and explaining matches…
            </p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "var(--muted)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 16px",
          }}
        >
          <Briefcase size={14} />
          {error}
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          {/* Results header + location filter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
              <span style={{ color: "var(--cream)", fontWeight: 500 }}>
                {displayedJobs.length}
                {locationFilter ? ` of ${jobs.length}` : ""} jobs
              </span>
              {parsed && (
                <>
                  {" "}
                  for &ldquo;{parsed.keyword}&rdquo;
                  {parsed.country ? ` in ${parsed.country}` : ""}
                </>
              )}
            </p>

            {/* Location filter */}
            {locationOptions.length > 1 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <MapPin size={12} color="var(--muted)" />
                <div style={{ position: "relative" }}>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                      appearance: "none",
                      background: "var(--field)",
                      border: "1px solid var(--border-2)",
                      borderRadius: "8px",
                      color: locationFilter ? "var(--cream)" : "var(--muted)",
                      fontSize: "12px",
                      fontFamily: "var(--font-body)",
                      padding: "5px 28px 5px 10px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="">All locations</option>
                    {locationOptions.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  {/* Caret */}
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "var(--muted)",
                      fontSize: "10px",
                    }}
                  >
                    ▾
                  </span>
                </div>
                {locationFilter && (
                  <button
                    onClick={() => setLocationFilter("")}
                    title="Clear filter"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--muted)",
                      padding: "2px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--cream)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--muted)")
                    }
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {displayedJobs.length > 0 ? (
              displayedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  userId={userId}
                  onSelect={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                No jobs match the selected location.
              </div>
            )}
          </div>
        </>
      )}

      {!loading && searched && jobs.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--muted)",
          }}
        >
          <Briefcase size={24} style={{ opacity: 0.3, marginBottom: "10px" }} />
          <p style={{ fontSize: "13px", margin: 0 }}>
            No jobs found. Try broader keywords.
          </p>
        </div>
      )}

      {/* Job detail modal */}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
}
