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

  const locationOptions = useMemo(() => {
    const locs = jobs
      .map((j) => j.location)
      .filter((l): l is string => !!l && l.trim() !== "");
    return Array.from(new Set(locs)).sort();
  }, [jobs]);

  const displayedJobs = useMemo(() => {
    if (!locationFilter) return jobs;
    return jobs.filter((j) => j.location === locationFilter);
  }, [jobs, locationFilter]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", background: "#FFFEF0", fontFamily: "'Space Grotesk', sans-serif", color: "#0A0A0A" }}>
      <div style={{ marginBottom: "32px", border: "3px solid #0A0A0A", padding: "24px", boxShadow: "5px 5px 0px #0A0A0A", background: "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ width: "6px", height: "24px", background: "#C8FF00", border: "2px solid #0A0A0A" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
            Job Hunter
          </h1>
        </div>
        <p style={{ color: "#555", fontSize: "14px", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
          Search in plain English — each result is scored and explained against your index vault profile.
        </p>
      </div>

      {!hasCV && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#FF5500", border: "3px solid #0A0A0A", padding: "16px 20px", fontSize: "13px", color: "#FFFEF0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "24px", boxShadow: "4px 4px 0px #0A0A0A" }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>Upload your CV first so we can score and explain each job opening against your profile.</span>
        </div>
      )}

      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} color="#0A0A0A" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 2 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder='e.g., "ML internships open this month"'
            style={{
              width: "100%",
              paddingLeft: "44px",
              paddingRight: "16px",
              paddingTop: "14px",
              paddingBottom: "14px",
              background: "transparent",
              border: "3px solid #0A0A0A",
              color: "#0A0A0A",
              fontSize: "14px",
              fontWeight: 600,
              outline: "none",
              fontFamily: "'Space Grotesk', sans-serif",
              boxSizing: "border-box",
              boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.05)",
            }}
            onFocus={(e) => (e.currentTarget.style.background = "rgba(200,255,0,0.02)")}
            onBlur={(e) => (e.currentTarget.style.background = "transparent")}
          />
        </div>
        <button
          onClick={() => search()}
          disabled={!query.trim() || loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 24px",
            background: query.trim() && !loading ? "#C8FF00" : "#EAE9E0",
            color: "#0A0A0A",
            border: "3px solid #0A0A0A",
            fontSize: "14px",
            fontWeight: 800,
            textTransform: "uppercase",
            cursor: query.trim() && !loading ? "pointer" : "not-allowed",
            fontFamily: "'Space Grotesk', sans-serif",
            flexShrink: 0,
            boxShadow: query.trim() && !loading ? "3px 3px 0px #0A0A0A" : "none",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => { if (query.trim() && !loading) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px #0A0A0A"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = query.trim() && !loading ? "3px 3px 0px #0A0A0A" : "none"; }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          <span>Search</span>
        </button>
      </div>

      {!searched && (
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px", fontWeight: 800 }}>
            QUICK ACTIONS & EXAMPLES
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {EXAMPLES.map((q) => (
              <button
                key={q}
                onClick={() => search(q)}
                style={{
                  fontSize: "13px",
                  color: "#0A0A0A",
                  background: "transparent",
                  border: "2px solid #0A0A0A",
                  padding: "6px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "2px 2px 0px #0A0A0A",
                  transition: "all 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #0A0A0A"; e.currentTarget.style.background = "rgba(0,71,255,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "2px 2px 0px #0A0A0A"; e.currentTarget.style.background = "transparent"; }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {searched && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "between", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "4px", height: "14px", background: "#0047FF", border: "1px solid #0A0A0A" }} />
              <p style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                {displayedJobs.length} {displayedJobs.length === 1 ? "match" : "matches"} found
              </p>
            </div>

            {locationOptions.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                <MapPin size={14} color="#0A0A0A" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "2px solid #0A0A0A",
                    color: "#0A0A0A",
                    fontSize: "12px",
                    fontWeight: 700,
                    outline: "none",
                    fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "2px 2px 0px #0A0A0A",
                  }}
                >
                  <option value="">ALL LOCATIONS</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", border: "2px solid #0A0A0A", background: "rgba(200,255,0,0.1)", marginBottom: "20px", fontSize: "13px", fontWeight: 600 }}>
              <AlertCircle size={16} color="#0A0A0A" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: "#0A0A0A" }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
              <div style={{ textAlign: "center", padding: "40px", border: "3px dashed #0A0A0A", color: "#0A0A0A", fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>
                No active openings match the selected location scope.
              </div>
            )}
          </div>
        </>
      )}

      {!loading && searched && jobs.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "48px 24px", border: "3px dashed #0A0A0A", color: "#0A0A0A" }}>
          <Briefcase size={28} style={{ marginBottom: "12px", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px", margin: 0, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            No indexed jobs discovered. Try broader fallback parameters.
          </p>
        </div>
      )}

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}