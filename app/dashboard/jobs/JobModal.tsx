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
  Users,
  Building2,
  Globe,
  Star,
  Clock,
  Sparkles,
  Wifi,
  Mail,
  Phone,
  Share2,
} from "lucide-react";
import type { Job } from "./types";

function fitColor(s: number) {
  if (s >= 75)
    return {
      bg: "rgba(5,150,105,0.12)",
      text: "#34d399",
      ring: "rgba(5,150,105,0.3)",
      label: "Strong fit",
    };
  if (s >= 50)
    return {
      bg: "rgba(245,158,11,0.12)",
      text: "#fbbf24",
      ring: "rgba(245,158,11,0.3)",
      label: "Partial fit",
    };
  return {
    bg: "rgba(239,68,68,0.12)",
    text: "#f87171",
    ring: "rgba(239,68,68,0.3)",
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
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 0",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "2px", color: "var(--muted)" }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "var(--muted)",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "15px",
            color: "var(--cream)",
            lineHeight: 1.6,
            wordBreak: "break-word",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "28px 0 12px",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--blue-light)",
      }}
    >
      {children}
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
      parts.push(
        `${job.salary_minimum!.toLocaleString()} – ${job.salary_maximum!.toLocaleString()}`,
      );
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
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "24px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "calc(100vh - 48px)",
          background: "linear-gradient(180deg, #131b2e 0%, #0d1424 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "slideUp 0.25s ease-out",
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            padding: "28px 32px 20px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(19,27,46,0.95)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "18px", flex: 1, minWidth: 0 }}>
              {/* Company logo */}
              {hasValue(job.company_logo) ? (
                <img
                  src={job.company_logo!}
                  alt={job.company}
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    objectFit: "cover",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border)",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    background: "rgba(37,99,235,0.1)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={28} color="var(--blue-light)" />
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--white)",
                    margin: "0 0 6px",
                    lineHeight: 1.2,
                  }}
                >
                  {job.title}
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--muted)",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {job.company}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              {/* Fit score badge */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: c.bg,
                  border: `1px solid ${c.ring}`,
                  borderRadius: "12px",
                  padding: "10px 18px",
                }}
              >
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: c.text,
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                  }}
                >
                  {job.fitScore}%
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: c.text,
                    opacity: 0.85,
                    marginTop: "4px",
                  }}
                >
                  {c.label}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "var(--cream)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "18px",
            }}
          >
            {validUrl && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "var(--blue)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--blue-glow)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--blue)")
                }
              >
                <ExternalLink size={14} /> Apply / View on{" "}
                {job.platform || "Source"}
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
                  padding: "10px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--muted)",
                  border: "1px solid var(--border-2)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "var(--cream)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-2)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
              >
                <Globe size={14} /> {job.platform || "Platform"}
              </a>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 36px" }}>
          {/* AI Reasoning */}
          {hasValue(job.reasoning) && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "16px 18px",
                background: "rgba(37,99,235,0.06)",
                border: "1px solid rgba(37,99,235,0.15)",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <Sparkles
                size={18}
                color="var(--blue-light)"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--cream)",
                  margin: 0,
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {job.reasoning}
              </p>
            </div>
          )}

          {/* ─── Job Details ─── */}
          <SectionTitle>Job Details</SectionTitle>
          <div
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "8px 20px",
            }}
          >
            {hasValue(job.location) && (
              <InfoRow
                icon={<MapPin size={16} />}
                label="Location"
                value={
                  <>
                    {job.location}
                    {job.is_remote && (
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "11px",
                          background: "rgba(52,211,153,0.1)",
                          color: "#34d399",
                          padding: "2px 8px",
                          borderRadius: "5px",
                          fontWeight: 600,
                        }}
                      >
                        REMOTE
                      </span>
                    )}
                  </>
                }
              />
            )}
            {hasValue(salaryDisplay) && salaryDisplay !== "Not listed" && (
              <InfoRow
                icon={<DollarSign size={16} />}
                label="Salary"
                value={salaryDisplay}
              />
            )}
            {hasValue(job.job_type) && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Job Type"
                value={job.job_type!}
              />
            )}
            {hasValue(job.job_level) && (
              <InfoRow
                icon={<Briefcase size={16} />}
                label="Level"
                value={job.job_level!}
              />
            )}
            {hasValue(job.job_function) && (
              <InfoRow
                icon={<Briefcase size={16} />}
                label="Function"
                value={job.job_function!}
              />
            )}
            {hasValue(job.experience_range) && (
              <InfoRow
                icon={<Clock size={16} />}
                label="Experience"
                value={job.experience_range!}
              />
            )}
            {hasValue(job.skills) && (
              <InfoRow
                icon={<Star size={16} />}
                label="Skills"
                value={job.skills!}
              />
            )}
            {hasValue(job.listing_type) && (
              <InfoRow
                icon={<Briefcase size={16} />}
                label="Listing Type"
                value={job.listing_type!}
              />
            )}
            {hasValue(job.vacancy_count) && (
              <InfoRow
                icon={<Users size={16} />}
                label="Vacancies"
                value={String(job.vacancy_count)}
              />
            )}
            {hasValue(job.applicant_count) && (
              <InfoRow
                icon={<Users size={16} />}
                label="Applicants"
                value={`${job.applicant_count!.toLocaleString()} applied`}
              />
            )}
            {hasValue(job.work_from_home) && (
              <InfoRow
                icon={<Wifi size={16} />}
                label="Work From Home"
                value={job.work_from_home!}
              />
            )}
            {hasValue(job.posted_date) && (
              <InfoRow
                icon={<Calendar size={16} />}
                label="Posted"
                value={new Date(job.posted_date!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            )}
            {hasValue(job.valid_through) && (
              <InfoRow
                icon={<Calendar size={16} />}
                label="Valid Through"
                value={new Date(job.valid_through!).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              />
            )}
            {hasValue(job.deadline) && (
              <InfoRow
                icon={<Calendar size={16} />}
                label="Deadline"
                value={job.deadline!}
              />
            )}
            {job.easy_apply === true && (
              <InfoRow
                icon={<Sparkles size={16} />}
                label="Easy Apply"
                value="Yes — apply directly on platform"
              />
            )}
            {hasValue(job.platform) && (
              <InfoRow
                icon={<Globe size={16} />}
                label="Platform"
                value={job.platform!}
              />
            )}
          </div>

          {/* ─── Description ─── */}
          {hasValue(job.description) && (
            <>
              <SectionTitle>Description</SectionTitle>
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  fontSize: "15px",
                  color: "var(--cream)",
                  lineHeight: 1.8,
                }}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        style={{ margin: "0 0 14px", lineHeight: 1.8 }}
                        {...props}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1
                        style={{
                          fontSize: "22px",
                          fontWeight: 700,
                          margin: "20px 0 10px",
                          color: "var(--white)",
                        }}
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          margin: "18px 0 10px",
                          color: "var(--white)",
                        }}
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          margin: "16px 0 8px",
                          color: "var(--white)",
                        }}
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        style={{ margin: "12px 0", paddingLeft: "28px" }}
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        style={{ margin: "12px 0", paddingLeft: "28px" }}
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        style={{
                          margin: "6px 0",
                          color: "var(--cream)",
                          fontSize: "15px",
                        }}
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        style={{ fontWeight: 700, color: "var(--white)" }}
                        {...props}
                      />
                    ),
                    em: ({ node, ...props }) => (
                      <em
                        style={{
                          fontStyle: "italic",
                          color: "var(--blue-light)",
                        }}
                        {...props}
                      />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        style={{
                          background: "rgba(37,99,235,0.1)",
                          padding: "4px 8px",
                          borderRadius: "5px",
                          fontSize: "14px",
                          fontFamily: "monospace",
                          color: "var(--blue-light)",
                        }}
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        style={{
                          borderLeft: "4px solid var(--blue-light)",
                          paddingLeft: "16px",
                          margin: "12px 0",
                          opacity: 0.85,
                          fontStyle: "italic",
                        }}
                        {...props}
                      />
                    ),
                    a: ({ node, href, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--blue-light)",
                          textDecoration: "none",
                          borderBottom: "1px solid rgba(37,99,235,0.3)",
                        }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {job.description}
                </ReactMarkdown>
              </div>
            </>
          )}

          {/* ─── Company ─── */}
          {(hasValue(job.company_industry) ||
            hasValue(job.company_type) ||
            hasValue(job.company_founded) ||
            hasValue(job.company_website) ||
            hasValue(job.company_addresses) ||
            hasValue(job.company_revenue) ||
            hasValue(job.company_description) ||
            hasValue(job.company_rating) ||
            hasValue(job.employee_count) ||
            hasValue(job.review_count)) && (
            <>
              <SectionTitle>Company</SectionTitle>
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "8px 20px",
                }}
              >
                {hasValue(job.company_industry) && (
                  <InfoRow
                    icon={<Building2 size={16} />}
                    label="Industry"
                    value={job.company_industry!}
                  />
                )}
                {hasValue(job.company_type) && (
                  <InfoRow
                    icon={<Building2 size={16} />}
                    label="Company Type"
                    value={job.company_type!}
                  />
                )}
                {hasValue(job.company_founded) && (
                  <InfoRow
                    icon={<Calendar size={16} />}
                    label="Founded"
                    value={String(job.company_founded)}
                  />
                )}
                {hasValue(job.employee_count) && (
                  <InfoRow
                    icon={<Users size={16} />}
                    label="Employees"
                    value={job.employee_count!}
                  />
                )}
                {hasValue(job.company_rating) && (
                  <InfoRow
                    icon={<Star size={16} />}
                    label="Rating"
                    value={`${job.company_rating} / 5`}
                  />
                )}
                {hasValue(job.review_count) && (
                  <InfoRow
                    icon={<Star size={16} />}
                    label="Reviews"
                    value={String(job.review_count)}
                  />
                )}
                {hasValue(job.company_revenue) && (
                  <InfoRow
                    icon={<DollarSign size={16} />}
                    label="Revenue"
                    value={job.company_revenue!}
                  />
                )}
                {hasValue(job.company_addresses) && (
                  <InfoRow
                    icon={<MapPin size={16} />}
                    label="Address"
                    value={job.company_addresses!}
                  />
                )}
                {hasValue(job.company_website) && (
                  <InfoRow
                    icon={<Globe size={16} />}
                    label="Website"
                    value={
                      <a
                        href={job.company_website!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--blue-light)",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {job.company_website}
                      </a>
                    }
                  />
                )}
                {hasValue(job.company_url) && (
                  <InfoRow
                    icon={<Globe size={16} />}
                    label="Company Page"
                    value={
                      <a
                        href={job.company_url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--blue-light)",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {job.company_url}
                      </a>
                    }
                  />
                )}
                {hasValue(job.company_description) && (
                  <div style={{ padding: "12px 0" }}>
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "12px",
                        color: "var(--muted)",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      About
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "15px",
                        color: "var(--cream)",
                        lineHeight: 1.7,
                      }}
                    >
                      {job.company_description}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── Contact ─── */}
          {(hasValue(job.emails) ||
            hasValue(job.phones) ||
            hasValue(job.social_links)) && (
            <>
              <SectionTitle>Contact</SectionTitle>
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "8px 20px",
                }}
              >
                {hasValue(job.emails) && (
                  <InfoRow
                    icon={<Mail size={16} />}
                    label="Email"
                    value={job.emails.join(", ")}
                  />
                )}
                {hasValue(job.phones) && (
                  <InfoRow
                    icon={<Phone size={16} />}
                    label="Phone"
                    value={job.phones.join(", ")}
                  />
                )}
                {hasValue(job.social_links) && (
                  <InfoRow
                    icon={<Share2 size={16} />}
                    label="Social"
                    value={
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {Object.entries(job.social_links).map(([key, url]) => (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "13px",
                              color: "var(--blue-light)",
                              textDecoration: "none",
                              background: "rgba(37,99,235,0.08)",
                              padding: "4px 10px",
                              borderRadius: "5px",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.textDecoration =
                                "underline")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.textDecoration = "none")
                            }
                          >
                            {key}
                          </a>
                        ))}
                      </div>
                    }
                  />
                )}
              </div>
            </>
          )}

          {/* ─── Links ─── */}
          {hasValue(job.official_url) && job.official_url !== job.url && (
            <>
              <SectionTitle>Links</SectionTitle>
              <div
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "8px 20px",
                }}
              >
                <InfoRow
                  icon={<ExternalLink size={16} />}
                  label="Official Listing"
                  value={
                    <a
                      href={job.official_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--blue-light)",
                        textDecoration: "none",
                        wordBreak: "break-all",
                        fontSize: "15px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      {job.official_url}
                    </a>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}
// ...existing code...
