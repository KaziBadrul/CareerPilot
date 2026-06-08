"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Building2,
  Globe,
  Sparkles,
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

function hasValue(v: any): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  if (typeof v === "number") return true;
  if (typeof v === "boolean") return true;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 0", borderBottom: "2px solid #0A0A0A" }}>
      <div style={{ flexShrink: 0, color: "#0A0A0A" }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#666", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </p>
        <div style={{ margin: "4px 0 0", fontSize: "14px", color: "#0A0A0A", lineHeight: 1.5, fontWeight: 600, wordBreak: "break-word" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "32px 0 14px", fontSize: "12px", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0A0A0A" }}>
      // {children}
    </p>
  );
}

export function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const c = fitColor(job.fitScore);
  const validUrl =
    job.url &&
    job.url !== "#" &&
    (job.url.startsWith("http://") || job.url.startsWith("https://"));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  let salaryDisplay = job.salary;
  if (hasValue(job.salary_minimum) || hasValue(job.salary_maximum)) {
    const parts: string[] = [];
    if (job.salary_currency) parts.push(job.salary_currency);
    if (hasValue(job.salary_minimum) && hasValue(job.salary_maximum)) {
      parts.push(`${job.salary_minimum!.toLocaleString()} – ${job.salary_maximum!.toLocaleString()}`);
    } else if (hasValue(job.salary_minimum)) {
      parts.push(`${job.salary_minimum!.toLocaleString()}+`);
    } else if (hasValue(job.salary_maximum)) {
      parts.push(`up to ${job.salary_maximum!.toLocaleString()}`);
    }
    if (hasValue(job.salary_period)) parts.push(`/ ${job.salary_period}`);
    if (parts.length > 0) salaryDisplay = parts.join(" ");
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 254, 240, 0.85)",
        backdropFilter: "blur(4px)",
        padding: "24px",
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "calc(100vh - 48px)",
          background: "#FFFEF0",
          border: "4px solid #0A0A0A",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "8px 8px 0px #0A0A0A",
          animation: "slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Sticky Header */}
        <div style={{ padding: "32px 32px 24px", borderBottom: "3px solid #0A0A0A", background: "transparent", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ display: "flex", gap: "20px", flex: 1, minWidth: 0 }}>
              {hasValue(job.company_logo) ? (
                <img
                  src={job.company_logo!}
                  alt={job.company}
                  style={{
                    width: "64px",
                    height: "64px",
                    border: "3px solid #0A0A0A",
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
                    width: "64px",
                    height: "64px",
                    border: "3px solid #0A0A0A",
                    flexShrink: 0,
                    background: "#0047FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={24} color="#FFFEF0" />
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 900, color: "#0A0A0A", margin: "0 0 6px", lineHeight: 1.2, textTransform: "uppercase" }}>
                  {job.title}
                </h2>
                <p style={{ fontSize: "15px", color: "#555", margin: 0, fontWeight: 700 }}>
                  {job.company}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: c.bg, border: "2px solid #0A0A0A", padding: "8px 16px", boxShadow: "2px 2px 0px #0A0A0A" }}>
                <span style={{ fontSize: "24px", fontWeight: 900, color: c.text, lineHeight: 1 }}>
                  {job.fitScore}%
                </span>
                <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: c.text, marginTop: "2px", letterSpacing: "0.02em" }}>
                  {c.label}
                </span>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "2px solid #0A0A0A",
                  color: "#0A0A0A",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0px #0A0A0A",
                  transition: "all 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "3px 3px 0px #0A0A0A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "2px 2px 0px #0A0A0A"; }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px" }}>
            {validUrl && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  background: "#C8FF00",
                  color: "#0A0A0A",
                  border: "2px solid #0A0A0A",
                  textDecoration: "none",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "2px 2px 0px #0A0A0A",
                  cursor: "pointer",
                }}
              >
                <ExternalLink size={12} />
                <span>Apply via {job.platform || "Source"}</span>
              </a>
            )}
            {hasValue(job.platform_url) && job.platform_url !== job.url && (
              <a
                href={job.platform_url!}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  fontSize: "12px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "#0A0A0A",
                  border: "2px solid #0A0A0A",
                  textDecoration: "none",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "2px 2px 0px #0A0A0A",
                  cursor: "pointer",
                }}
              >
                <Globe size={12} />
                <span>View Platform</span>
              </a>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {hasValue(job.reasoning) && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "18px", background: "rgba(0,71,255,0.04)", border: "3px solid #0A0A0A", boxShadow: "4px 4px 0px #0A0A0A", marginBottom: "28px" }}>
              <Sparkles size={18} color="#0A0A0A" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: "14px", color: "#0A0A0A", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                {job.reasoning}
              </p>
            </div>
          )}

          <SectionTitle>Job Details Matrix</SectionTitle>
          <div style={{ border: "3px solid #0A0A0A", padding: "0 20px", background: "transparent" }}>
            {hasValue(job.location) && (
              <InfoRow
                icon={<MapPin size={16} />}
                label="Location Scope"
                value={
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>{job.location}</span>
                    {job.is_remote && (
                      <span style={{ fontSize: "10px", background: "#C8FF00", color: "#0A0A0A", border: "1px solid #0A0A0A", padding: "1px 6px", fontWeight: 800 }}>
                        REMOTE
                      </span>
                    )}
                  </div>
                }
              />
            )}
            {hasValue(salaryDisplay) && salaryDisplay !== "Not listed" && (
              <InfoRow icon={<DollarSign size={16} />} label="Compensation Index" value={salaryDisplay} />
            )}
            {hasValue(job.job_type) && (
              <InfoRow icon={<Briefcase size={16} />} label="Employment Type" value={job.job_type} />
            )}
          </div>

          {hasValue(job.description) && (
            <>
              <SectionTitle>Role Core Description</SectionTitle>
              <div
                className="markdown-body"
                style={{
                  fontSize: "14px",
                  color: "#0A0A0A",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  padding: "4px 0",
                }}
              >
                <ReactMarkdown>{job.description!}</ReactMarkdown>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }
        .markdown-body strong { font-weight: 800; background: rgba(200,255,0,0.15); padding: 0 2px; }
        .markdown-body p { margin-top: 0; margin-bottom: 16px; }
        .markdown-body ul, .markdown-body ol { padding-left: 20px; margin-bottom: 16px; }
        .markdown-body li { margin-bottom: 6px; list-style: square; }
      `}</style>
    </div>
  );
}