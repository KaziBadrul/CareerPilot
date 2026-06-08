import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ArrowUpRight,
  Bookmark,
  Zap,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react";

type SortKey = "match" | "salary" | "deadline" | "company";

const jobsData = [
  {
    id: 1,
    company: "OpenAI",
    companyColor: "#0A0A0A",
    logo: "OA",
    role: "Senior Product Designer",
    location: "Remote / SF",
    salaryMin: 180000,
    salaryMax: 220000,
    match: 97,
    deadline: "2025-06-20",
    status: "new",
    type: "Full-time",
    tags: ["AI/ML", "B2B", "Series C+"],
    saved: true,
  },
  {
    id: 2,
    company: "Vercel",
    companyColor: "#0047FF",
    logo: "VC",
    role: "Design Lead",
    location: "Remote",
    salaryMin: 160000,
    salaryMax: 195000,
    match: 94,
    deadline: "2025-06-25",
    status: "new",
    type: "Full-time",
    tags: ["Dev Tools", "Remote-first"],
    saved: false,
  },
  {
    id: 3,
    company: "Figma",
    companyColor: "#FF5500",
    logo: "FG",
    role: "Staff Product Designer",
    location: "SF / NYC / Remote",
    salaryMin: 175000,
    salaryMax: 215000,
    match: 91,
    deadline: "2025-07-01",
    status: "applied",
    type: "Full-time",
    tags: ["Design Tools", "PLG"],
    saved: true,
  },
  {
    id: 4,
    company: "Linear",
    companyColor: "#C8FF00",
    logo: "LN",
    role: "Head of Design",
    location: "Remote",
    salaryMin: 185000,
    salaryMax: 225000,
    match: 88,
    deadline: "2025-06-15",
    status: "screening",
    type: "Full-time",
    tags: ["B2B SaaS", "Small Team"],
    saved: false,
  },
  {
    id: 5,
    company: "Anthropic",
    companyColor: "#FF5500",
    logo: "AN",
    role: "Product Design Manager",
    location: "SF",
    salaryMin: 200000,
    salaryMax: 240000,
    match: 86,
    deadline: "2025-07-10",
    status: "new",
    type: "Full-time",
    tags: ["AI Safety", "Research"],
    saved: false,
  },
  {
    id: 6,
    company: "Stripe",
    companyColor: "#0047FF",
    logo: "ST",
    role: "Design Systems Lead",
    location: "SF / Remote",
    salaryMin: 170000,
    salaryMax: 205000,
    match: 84,
    deadline: "2025-06-30",
    status: "applied",
    type: "Full-time",
    tags: ["Fintech", "Design Systems"],
    saved: true,
  },
  {
    id: 7,
    company: "Notion",
    companyColor: "#0A0A0A",
    logo: "NT",
    role: "Principal Designer",
    location: "NYC / Remote",
    salaryMin: 165000,
    salaryMax: 195000,
    match: 82,
    deadline: "2025-07-15",
    status: "new",
    type: "Full-time",
    tags: ["PLG", "B2C", "Productivity"],
    saved: false,
  },
  {
    id: 8,
    company: "Airbnb",
    companyColor: "#FF5500",
    logo: "AB",
    role: "Senior UX Researcher",
    location: "SF / Hybrid",
    salaryMin: 155000,
    salaryMax: 185000,
    match: 79,
    deadline: "2025-06-28",
    status: "interview",
    type: "Full-time",
    tags: ["Consumer", "Mixed Methods"],
    saved: false,
  },
];

const statusConfig: Record<string, { label: string; bg: string; fg: string }> = {
  new: { label: "NEW", bg: "#C8FF00", fg: "#0A0A0A" },
  applied: { label: "APPLIED", bg: "#0047FF", fg: "#FFFEF0" },
  screening: { label: "SCREENING", bg: "#FF5500", fg: "#FFFEF0" },
  interview: { label: "INTERVIEW", bg: "#00CC88", fg: "#0A0A0A" },
};

const filters = ["All", "New", "Applied", "Screening", "Interview", "Saved"];

export function JobHunter() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("match");
  const [savedJobs, setSavedJobs] = useState<Set<number>>(
    new Set(jobsData.filter((j) => j.saved).map((j) => j.id))
  );

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = jobsData
    .filter((job) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Saved") return savedJobs.has(job.id);
      return job.status === activeFilter.toLowerCase();
    })
    .filter(
      (job) =>
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "match") return b.match - a.match;
      if (sortKey === "salary") return b.salaryMax - a.salaryMax;
      if (sortKey === "deadline")
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortKey === "company") return a.company.localeCompare(b.company);
      return 0;
    });

  const formatSalary = (min: number, max: number) =>
    `$${Math.round(min / 1000)}K – $${Math.round(max / 1000)}K`;

  const daysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div
      style={{
        padding: "36px 40px",
        minHeight: "100vh",
        background: "#FFFEF0",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <div
              style={{
                display: "inline-block",
                background: "#0047FF",
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                padding: "4px 14px",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "#FFFEF0",
                marginBottom: "12px",
              }}
            >
              JOB HUNTER
            </div>
            <h1
              style={{
                fontSize: "44px",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              FIND YOUR
              <br />
              <span style={{ color: "#0047FF" }}>NEXT ROLE.</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { v: "147", l: "ROLES SCANNED", c: "#0047FF", lc: "rgba(255,255,240,0.65)" },
              { v: "23", l: "AI SHORTLISTED", c: "#C8FF00", lc: "#444" },
              { v: "8", l: "APPLIED", c: "#0A0A0A", lc: "rgba(255,255,240,0.65)" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: s.c,
                  border: "3px solid #0A0A0A",
                  boxShadow: "4px 4px 0px #0A0A0A",
                  padding: "12px 18px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    color: s.c === "#C8FF00" ? "#0A0A0A" : "#FFFEF0",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: s.c === "#C8FF00" ? "#444" : s.lc,
                    marginTop: "3px",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + sort bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <div
              style={{
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                borderRight: "3px solid #0A0A0A",
              }}
            >
              <Search size={16} color="#0A0A0A" strokeWidth={3} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles, companies, skills..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "14px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0A0A0A",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <div
              style={{
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRight: "3px solid #0A0A0A",
                background: "#F0F0E8",
              }}
            >
              <Filter size={14} color="#0A0A0A" strokeWidth={3} />
              <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.05em" }}>
                SORT
              </span>
            </div>
            {(["match", "salary", "deadline", "company"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                style={{
                  padding: "0 14px",
                  border: "none",
                  borderRight: "2px solid #E0E0D8",
                  background: sortKey === key ? "#0A0A0A" : "transparent",
                  color: sortKey === key ? "#C8FF00" : "#555",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  textTransform: "uppercase",
                }}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#C8FF00",
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              padding: "0 20px",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#0A0A0A",
              transition: "all 0.08s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #0A0A0A";
              (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
            }}
          >
            <Zap size={14} strokeWidth={3} />
            AI SCAN
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: "3px solid #0A0A0A" }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRight: "2px solid #E0E0D8",
                borderBottom: activeFilter === f ? "3px solid #0047FF" : "none",
                background: activeFilter === f ? "#0047FF" : "transparent",
                color: activeFilter === f ? "#FFFEF0" : "#666",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: activeFilter === f ? "-3px" : "0",
              }}
            >
              {f.toUpperCase()}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span
            style={{
              padding: "10px 16px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#888",
              alignSelf: "center",
            }}
          >
            {filtered.length} RESULTS
          </span>
        </div>
      </div>

      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 100px 100px 100px 80px",
          gap: "0",
          padding: "10px 16px",
          background: "#0A0A0A",
          border: "3px solid #0A0A0A",
          borderBottom: "none",
          marginBottom: "0",
        }}
      >
        {[
          { label: "ROLE / COMPANY", icon: <Briefcase size={11} strokeWidth={3} color="#888" /> },
          { label: "SALARY", icon: <DollarSign size={11} strokeWidth={3} color="#888" /> },
          { label: "FIT SCORE", icon: <TrendingUp size={11} strokeWidth={3} color="#888" /> },
          { label: "DEADLINE", icon: <Calendar size={11} strokeWidth={3} color="#888" /> },
          { label: "STATUS", icon: null },
          { label: "ACTIONS", icon: null },
        ].map((col, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "#888",
              padding: "0 4px",
            }}
          >
            {col.icon}
            {col.label}
          </div>
        ))}
      </div>

      {/* Job rows */}
      <div
        style={{
          border: "3px solid #0A0A0A",
          boxShadow: "4px 4px 0px #0A0A0A",
        }}
      >
        {filtered.map((job, i) => {
          const days = daysUntil(job.deadline);
          const status = statusConfig[job.status];
          const isSaved = savedJobs.has(job.id);
          return (
            <div
              key={job.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 100px 100px 100px 80px",
                gap: "0",
                padding: "14px 16px",
                borderBottom: i < filtered.length - 1 ? "2px solid #E8E8E0" : "none",
                background: "#FFFEF0",
                cursor: "pointer",
                transition: "all 0.08s ease",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#F5F5E0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#FFFEF0";
              }}
            >
              {/* Role / Company */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    background: job.companyColor,
                    border: "2px solid #0A0A0A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                    color: job.companyColor === "#C8FF00" ? "#0A0A0A" : "#FFFEF0",
                    flexShrink: 0,
                  }}
                >
                  {job.logo}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#0A0A0A",
                      marginBottom: "2px",
                    }}
                  >
                    {job.role}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#777",
                    }}
                  >
                    {job.company}
                    <span style={{ color: "#DDD" }}>·</span>
                    <MapPin size={10} strokeWidth={2} />
                    {job.location}
                  </div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "5px", flexWrap: "wrap" }}>
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          border: "1px solid #DDD",
                          color: "#666",
                          background: "#F5F5ED",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary */}
              <div>
                <div
                  style={{ fontSize: "14px", fontWeight: 800, color: "#0A0A0A", marginBottom: "2px" }}
                >
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "#888" }}>
                  {job.type}
                </div>
              </div>

              {/* Fit Score */}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "5px" }}>
                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color:
                        job.match >= 90
                          ? "#0047FF"
                          : job.match >= 80
                          ? "#FF5500"
                          : "#888",
                      lineHeight: 1,
                    }}
                  >
                    {job.match}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#888" }}>%</span>
                </div>
                <div
                  style={{
                    height: "4px",
                    background: "#E8E8E0",
                    border: "1px solid #CCC",
                    position: "relative",
                    width: "60px",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${job.match}%`,
                      background:
                        job.match >= 90
                          ? "#0047FF"
                          : job.match >= 80
                          ? "#FF5500"
                          : "#888",
                    }}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: days <= 7 ? "#FF5500" : "#0A0A0A",
                    marginBottom: "2px",
                  }}
                >
                  {days <= 0 ? "Expired" : `${days}d left`}
                </div>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "#888" }}>
                  {new Date(job.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <div
                  style={{
                    display: "inline-block",
                    background: status.bg,
                    border: "2px solid #0A0A0A",
                    padding: "4px 8px",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    color: status.fg,
                    boxShadow: "2px 2px 0px #0A0A0A",
                  }}
                >
                  {status.label}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id);
                  }}
                  style={{
                    background: isSaved ? "#C8FF00" : "transparent",
                    border: `2px solid ${isSaved ? "#0A0A0A" : "#CCC"}`,
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isSaved ? "2px 2px 0px #0A0A0A" : "none",
                    transition: "all 0.08s ease",
                  }}
                >
                  <Bookmark
                    size={13}
                    color={isSaved ? "#0A0A0A" : "#AAA"}
                    strokeWidth={3}
                    fill={isSaved ? "#0A0A0A" : "none"}
                  />
                </button>
                <button
                  style={{
                    background: "#0A0A0A",
                    border: "2px solid #0A0A0A",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "2px 2px 0px #555",
                    transition: "all 0.08s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#0047FF";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 0px #555";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#0A0A0A";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #555";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                  }}
                >
                  <ArrowUpRight size={13} color="#FFFEF0" strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#0047FF",
            border: "3px solid #0A0A0A",
            boxShadow: "4px 4px 0px #0A0A0A",
            padding: "12px 24px",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "0.06em",
            cursor: "pointer",
            color: "#FFFEF0",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.08s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #0A0A0A";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
          }}
        >
          <Plus size={16} strokeWidth={3} />
          ADD CUSTOM ROLE
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#FFFEF0",
            border: "3px solid #0A0A0A",
            boxShadow: "4px 4px 0px #0A0A0A",
            padding: "12px 24px",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "0.06em",
            cursor: "pointer",
            color: "#0A0A0A",
            fontFamily: "'Space Grotesk', sans-serif",
            transition: "all 0.08s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #0A0A0A";
            (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
          }}
        >
          <Zap size={16} strokeWidth={3} />
          RUN AI BATCH APPLY
        </button>
      </div>
    </div>
  );
}
