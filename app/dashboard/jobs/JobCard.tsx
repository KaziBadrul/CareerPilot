"use client";

import { useState } from "react";
import {
  ExternalLink,
  BookmarkPlus,
  FileText,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
  Check,
  Sparkles,
  Building2,
} from "lucide-react";
import type { Job } from "./types";

function fitColor(s: number) {
  if (s >= 75)
    return {
      bg: "#C8FF00",
      text: "#0A0A0A",
      label: "Strong fit",
    };
  if (s >= 50)
    return {
      bg: "#0047FF",
      text: "#FFFEF0",
      label: "Partial fit",
    };
  return {
    bg: "#FF5500",
    text: "#FFFEF0",
    label: "Low fit",
  };
}

export function JobCard({
  job,
  userId,
  onSelect,
}: {
  job: Job;
  userId: string;
  onSelect: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [letter, setLetter] = useState("");
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const c = fitColor(job.fitScore);

  const save = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, job, status: "applied" }),
      });
      const data = await res.json();
      if (res.ok) setSaved(true);
      else console.error("Save failed:", data.error);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const genLetter = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (letter) {
      setShowLetter(true);
      return;
    }
    setLoadingLetter(true);
    setShowLetter(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: `Draft a cover letter for this job:\nRole: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${(job.description ?? "").slice(0, 500)}\n\nPersonalise to my CV, 3 paragraphs.`,
        }),
      });
      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let t = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        t += dec.decode(value, { stream: true });
        setLetter(t);
      }
    } catch {
      setLetter("Failed to generate. Try again.");
    } finally {
      setLoadingLetter(false);
    }
  };

  const validUrl =
    job.url &&
    job.url !== "#" &&
    (job.url.startsWith("http://") || job.url.startsWith("https://"));

  const btn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    padding: "6px 12px",
    border: "2px solid #0A0A0A",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: "uppercase",
    fontWeight: 800,
    background: "transparent",
    color: "#0A0A0A",
    boxShadow: "2px 2px 0px #0A0A0A",
    transition: "all 0.1s",
  };

  return (
    <div
      style={{
        background: "transparent",
        border: "3px solid #0A0A0A",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "4px 4px 0px #0A0A0A",
        transition: "all 0.1s",
      }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-2px, -2px)";
        e.currentTarget.style.boxShadow = "6px 6px 0px #0A0A0A";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "4px 4px 0px #0A0A0A";
      }}
    >
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "14px" }}>
          <div style={{ display: "flex", gap: "14px", flex: 1, minWidth: 0 }}>
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company}
                style={{
                  width: "44px",
                  height: "44px",
                  border: "2px solid #0A0A0A",
                  flexShrink: 0,
                  objectFit: "cover",
                  background: "#FFFEF0",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  border: "2px solid #0A0A0A",
                  flexShrink: 0,
                  background: "#0047FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Building2 size={18} color="#FFFEF0" />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 900, color: "#0A0A0A", margin: "0 0 4px", textTransform: "uppercase" }}>
                {job.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#555", margin: 0, fontWeight: 700 }}>
                {job.company}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: c.bg,
              border: "2px solid #0A0A0A",
              padding: "6px 12px",
              flexShrink: 0,
              boxShadow: "2px 2px 0px #0A0A0A",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 900, color: c.text, lineHeight: 1 }}>
              {job.fitScore}%
            </span>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: c.text, marginTop: "2px", letterSpacing: "0.02em" }}>
              {c.label}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", margin: "16px 0", fontSize: "12px", color: "#0A0A0A", fontWeight: 600 }}>
          {job.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} color="#0A0A0A" />
              <span style={{ textTransform: "uppercase" }}>{job.location}</span>
            </div>
          )}
          {job.salary && job.salary !== "Not listed" && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <DollarSign size={14} color="#0A0A0A" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.posted_date && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} color="#0A0A0A" />
              <span>{new Date(job.posted_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
          {validUrl && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                ...btn,
                background: "#0047FF",
                color: "#FFFEF0",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#053cd2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0047FF"; }}
            >
              <ExternalLink size={12} />
              <span>Apply</span>
            </a>
          )}

          <button
            onClick={save}
            style={{
              ...btn,
              background: saved ? "#C8FF00" : "transparent",
            }}
            onMouseEnter={(e) => { if (!saved && !saving) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { if (!saved && !saving) e.currentTarget.style.background = "transparent"; }}
          >
            {saving ? (
              <Loader2 size={12} className="animate-spin" />
            ) : saved ? (
              <Check size={12} />
            ) : (
              <BookmarkPlus size={12} />
            )}
            <span>{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={genLetter}
            style={{ ...btn, background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <FileText size={12} />
            <span>Draft Cover Letter</span>
          </button>
        </div>
      </div>

      {showLetter && (
        <div
          style={{
            borderTop: "3px solid #0A0A0A",
            padding: "20px",
            background: "rgba(200,255,0,0.03)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} color="#0A0A0A" />
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                AI Vault Copilot Draft
              </span>
            </div>
            <button
              onClick={() => setShowLetter(false)}
              style={{
                fontSize: "11px",
                color: "#0A0A0A",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 800,
                textTransform: "uppercase",
                textDecoration: "underline",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Hide
            </button>
          </div>

          {loadingLetter && !letter ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "#0A0A0A" }}>
              <Loader2 size={12} className="animate-spin" />
              <span>DRAFTING VAULT TRANSCRIPT...</span>
            </div>
          ) : (
            <div
              style={{
                fontSize: "13px",
                color: "#0A0A0A",
                lineHeight: 1.6,
                background: "#FFFEF0",
                border: "2px solid #0A0A0A",
                padding: "16px",
                whiteSpace: "pre-wrap",
                boxShadow: "2px 2px 0px #0A0A0A",
                fontWeight: 500,
              }}
            >
              {letter}
              {loadingLetter && <span className="cursor-blink" style={{ marginLeft: "4px", display: "inline-block", width: "6px", height: "14px", background: "#0A0A0A" }} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}