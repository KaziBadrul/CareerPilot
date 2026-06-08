import { useState, type ReactNode } from "react";
import {
  Briefcase,
  Star,
  Target,
  Send,
  ArrowUpRight,
  Zap,
  Check,
  Plus,
  Clock,
  TrendingUp,
} from "lucide-react";
import type { Page } from "../types";

const kanbanColumns = [
  {
    id: "applied",
    label: "APPLIED",
    color: "#0047FF",
    light: false,
    count: 12,
    jobs: [
      { company: "Google", role: "Senior UX Designer", time: "2h ago" },
      { company: "Figma", role: "Product Designer", time: "1d ago" },
      { company: "Notion", role: "Lead Designer", time: "2d ago" },
    ],
  },
  {
    id: "screen",
    label: "SCREENING",
    color: "#C8FF00",
    light: true,
    count: 5,
    jobs: [
      { company: "Airbnb", role: "UX Lead", time: "3d ago" },
      { company: "Stripe", role: "Design System Lead", time: "4d ago" },
    ],
  },
  {
    id: "interview",
    label: "INTERVIEW",
    color: "#FF5500",
    light: false,
    count: 3,
    jobs: [
      { company: "Apple", role: "HIG Designer", time: "5d ago" },
      { company: "Meta", role: "Reality Labs UX", time: "1w ago" },
    ],
  },
  {
    id: "offer",
    label: "OFFER",
    color: "#00CC88",
    light: true,
    count: 1,
    jobs: [{ company: "Linear", role: "Head of Design", time: "2w ago" }],
  },
];

const recentMatches = [
  {
    company: "OpenAI",
    role: "Senior Product Designer",
    salary: "$180K–$220K",
    match: 97,
    tags: ["Remote", "AI/ML"],
    logo: "OA",
    logoColor: "#0A0A0A",
  },
  {
    company: "Vercel",
    role: "Design Lead",
    salary: "$160K–$195K",
    match: 94,
    tags: ["Remote", "Dev Tools"],
    logo: "VC",
    logoColor: "#0047FF",
  },
  {
    company: "Figma",
    role: "Staff Designer",
    salary: "$175K–$210K",
    match: 91,
    tags: ["SF / Remote"],
    logo: "FG",
    logoColor: "#FF5500",
  },
  {
    company: "Linear",
    role: "Head of Design",
    salary: "$185K–$225K",
    match: 88,
    tags: ["Remote", "B2B"],
    logo: "LN",
    logoColor: "#C8FF00",
  },
];

const goals = [
  { label: "Applications This Week", current: 8, target: 10, color: "#0047FF" },
  { label: "Interview Prep Hours", current: 4.5, target: 5, color: "#FF5500" },
  { label: "Networking Calls", current: 3, target: 4, color: "#C8FF00" },
  { label: "Resume Versions", current: 2, target: 2, color: "#00CC88" },
];

const initialMessages = [
  {
    role: "ai" as const,
    text: "Morning, Alex! 7 new matches today. You have an interview with Apple tomorrow — want me to run a prep session?",
  },
  { role: "user" as const, text: "Yes, and draft a follow-up for the OpenAI role" },
  {
    role: "ai" as const,
    text: "On it! Drafting follow-up now. I've also pulled relevant interview Qs for Apple's HIG team. Ready when you are.",
  },
];

const aiResponses = [
  "Analyzing your profile against the JD — strong match on interaction design and systems thinking. Tailoring the cover letter now.",
  "Done! I've updated your tracker and set a reminder for the deadline. What else can I help with?",
  "Great question. Based on your target role at OpenAI, I'd highlight your AI product experience from 2022–2024 first.",
  "I've found 3 more roles matching your criteria. Want me to add them to your shortlist?",
];

interface DashboardProps {
  setActivePage: (page: Page) => void;
}

export function Dashboard({ setActivePage }: DashboardProps) {
  const [searchValue, setSearchValue] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [responseIndex, setResponseIndex] = useState(0);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: aiResponses[responseIndex % aiResponses.length] },
      ]);
      setResponseIndex((i) => i + 1);
    }, 700);
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
      {/* ── Header ── */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#888",
                letterSpacing: "0.12em",
                marginBottom: "6px",
              }}
            >
              MONDAY, JUNE 9, 2025
            </div>
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                margin: 0,
              }}
            >
              GOOD MORNING,
              <br />
              <span style={{ color: "#0047FF" }}>ALEX.</span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            {[
              { label: "ACTIVE APPS", value: "21", bg: "#0047FF", fg: "#FFFEF0", subFg: "rgba(255,255,240,0.65)" },
              { label: "NEW MATCHES", value: "7", bg: "#C8FF00", fg: "#0A0A0A", subFg: "#555" },
              { label: "INTERVIEWS", value: "3", bg: "#FF5500", fg: "#FFFEF0", subFg: "rgba(255,255,240,0.65)" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: stat.bg,
                  border: "3px solid #0A0A0A",
                  boxShadow: "4px 4px 0px #0A0A0A",
                  padding: "14px 20px",
                  textAlign: "center",
                  minWidth: "90px",
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    color: stat.fg,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: stat.subFg,
                    marginTop: "4px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search bar */}
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
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              borderRight: "3px solid #0A0A0A",
              background: "#C8FF00",
              gap: "8px",
            }}
          >
            <Zap size={18} color="#0A0A0A" strokeWidth={3} />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#0A0A0A",
              }}
            >
              AI
            </span>
          </div>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="What would you like to do today? Ask your AI career agent..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              padding: "16px 20px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#0A0A0A",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
          <button
            style={{
              background: "#0A0A0A",
              color: "#C8FF00",
              border: "none",
              padding: "0 28px",
              fontSize: "13px",
              fontWeight: 900,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#0047FF";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#0A0A0A";
            }}
          >
            GO →
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 340px",
          gridTemplateRows: "auto auto",
          gap: "20px",
        }}
      >
        {/* Kanban — spans first 2 cols */}
        <div style={{ gridColumn: "1 / 3" }}>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "3px solid #0A0A0A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#0047FF",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Briefcase size={17} color="#FFFEF0" strokeWidth={3} />
                <span
                  style={{
                    color: "#FFFEF0",
                    fontSize: "13px",
                    fontWeight: 900,
                    letterSpacing: "0.07em",
                  }}
                >
                  ACTIVE APPLICATIONS
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "rgba(255,255,240,0.6)", fontSize: "12px", fontWeight: 600 }}>
                  21 total
                </span>
                <BrutalButton
                  onClick={() => setActivePage("job-hunter")}
                  bg="#FFFEF0"
                  textColor="#0047FF"
                  border="2px solid #FFFEF0"
                  shadow="2px 2px 0px #0A0A0A"
                >
                  VIEW ALL <ArrowUpRight size={11} strokeWidth={3} style={{ display: "inline" }} />
                </BrutalButton>
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              {kanbanColumns.map((col) => (
                <div key={col.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      background: col.color,
                      border: "2px solid #0A0A0A",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        color: col.light ? "#0A0A0A" : "#FFFEF0",
                      }}
                    >
                      {col.label}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 900,
                        color: col.light ? "#0A0A0A" : "#FFFEF0",
                      }}
                    >
                      {col.count}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {col.jobs.map((job, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#FFFEF0",
                          border: "2px solid #0A0A0A",
                          boxShadow: "2px 2px 0px #0A0A0A",
                          padding: "10px",
                          cursor: "pointer",
                          transition: "all 0.08s ease",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.boxShadow = "4px 4px 0px #0A0A0A";
                          el.style.transform = "translate(-2px, -2px)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.boxShadow = "2px 2px 0px #0A0A0A";
                          el.style.transform = "translate(0, 0)";
                        }}
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "3px",
                            background: col.color,
                            border: "1px solid #0A0A0A",
                            marginBottom: "8px",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "#0A0A0A",
                            marginBottom: "2px",
                          }}
                        >
                          {job.company}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#666",
                            marginBottom: "8px",
                          }}
                        >
                          {job.role}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock size={10} color="#AAA" strokeWidth={2} />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: "#AAA" }}>
                            {job.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    {col.count > col.jobs.length && (
                      <div
                        style={{
                          padding: "8px",
                          border: "2px dashed #CCC",
                          textAlign: "center",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#AAA",
                          cursor: "pointer",
                          background: "#FAFAF2",
                        }}
                      >
                        +{col.count - col.jobs.length} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Chat — right column, spans 2 rows */}
        <div style={{ gridRow: "1 / 3", gridColumn: "3" }}>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#0A0A0A",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: "600px",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "3px solid #C8FF00",
                background: "#C8FF00",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Zap size={17} color="#0A0A0A" strokeWidth={3} />
              <span
                style={{
                  color: "#0A0A0A",
                  fontSize: "13px",
                  fontWeight: 900,
                  letterSpacing: "0.07em",
                }}
              >
                AI CAREER AGENT
              </span>
              <div
                style={{
                  marginLeft: "auto",
                  width: "8px",
                  height: "8px",
                  background: "#0A0A0A",
                  borderRadius: "50%",
                  boxShadow: "0 0 4px #000",
                }}
              />
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                overflowY: "auto",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "ai" && (
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        color: "#C8FF00",
                        marginBottom: "4px",
                      }}
                    >
                      PILOT AI
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "10px 14px",
                      border:
                        msg.role === "ai"
                          ? "2px solid #C8FF00"
                          : "2px solid #0047FF",
                      background: msg.role === "ai" ? "transparent" : "#0047FF",
                      boxShadow:
                        msg.role === "ai"
                          ? "3px 3px 0px #C8FF00"
                          : "3px 3px 0px #0047FF",
                    }}
                  >
                    <p
                      style={{
                        color: msg.role === "ai" ? "#C8FF00" : "#FFFEF0",
                        fontSize: "12px",
                        fontWeight: msg.role === "ai" ? 400 : 600,
                        margin: 0,
                        lineHeight: 1.6,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px",
                borderTop: "3px solid #222",
                display: "flex",
                gap: "0",
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask your agent..."
                style={{
                  flex: 1,
                  background: "#111",
                  border: "2px solid #2A2A2A",
                  borderRight: "none",
                  padding: "10px 14px",
                  color: "#FFFEF0",
                  fontSize: "12px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  background: "#C8FF00",
                  border: "2px solid #C8FF00",
                  padding: "10px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "2px 2px 0px #888",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 0px #888";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #888";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                }}
              >
                <Send size={14} color="#0A0A0A" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "3px solid #0A0A0A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Star size={17} color="#0A0A0A" strokeWidth={3} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 900,
                    letterSpacing: "0.07em",
                  }}
                >
                  RECENT MATCHES
                </span>
              </div>
              <BrutalButton
                onClick={() => setActivePage("job-hunter")}
                bg="#0A0A0A"
                textColor="#FFFEF0"
                border="2px solid #0A0A0A"
                shadow="2px 2px 0px #555"
              >
                SEE ALL
              </BrutalButton>
            </div>

            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentMatches.map((job, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    border: "2px solid #E8E8E0",
                    background: "#FFFEF0",
                    cursor: "pointer",
                    transition: "all 0.08s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.border = "2px solid #0A0A0A";
                    el.style.boxShadow = "3px 3px 0px #0A0A0A";
                    el.style.transform = "translate(-1px, -1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.border = "2px solid #E8E8E0";
                    el.style.boxShadow = "none";
                    el.style.transform = "translate(0, 0)";
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: job.logoColor,
                      border: "2px solid #0A0A0A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 900,
                      color: job.logoColor === "#C8FF00" ? "#0A0A0A" : "#FFFEF0",
                      flexShrink: 0,
                    }}
                  >
                    {job.logo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#0A0A0A",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {job.role}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      {job.company} · {job.salary}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {job.tags.map((tag, j) => (
                        <span
                          key={j}
                          style={{
                            fontSize: "10px",
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
                  <FitBadge score={job.match} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Status */}
        <div>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "3px solid #0A0A0A",
                background: "#FF5500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Target size={17} color="#FFFEF0" strokeWidth={3} />
              <span
                style={{
                  color: "#FFFEF0",
                  fontSize: "13px",
                  fontWeight: 900,
                  letterSpacing: "0.07em",
                }}
              >
                GOAL STATUS
              </span>
              <div
                style={{
                  marginLeft: "auto",
                  background: "#FFFEF0",
                  border: "2px solid #FFFEF0",
                  padding: "3px 10px",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#FF5500",
                  boxShadow: "2px 2px 0px #0A0A0A",
                  cursor: "pointer",
                }}
              >
                WEEK 23
              </div>
            </div>

            <div
              style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {goals.map((goal, i) => {
                const pct = Math.round((goal.current / goal.target) * 100);
                const isComplete = pct >= 100;
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "7px",
                      }}
                    >
                      <span
                        style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A" }}
                      >
                        {goal.label}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        {isComplete && (
                          <Check size={11} color="#00CC88" strokeWidth={3} />
                        )}
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 900,
                            color: isComplete ? "#00CC88" : "#0A0A0A",
                          }}
                        >
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "14px",
                        background: "#E8E8E0",
                        border: "2px solid #0A0A0A",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          height: "100%",
                          width: `${Math.min(pct, 100)}%`,
                          background: goal.color,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#888",
                        marginTop: "3px",
                        textAlign: "right",
                      }}
                    >
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "0 20px 16px" }}>
              <div
                style={{
                  padding: "12px",
                  background: "#0A0A0A",
                  border: "2px solid #0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#0047FF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#0A0A0A";
                }}
              >
                <TrendingUp size={14} color="#C8FF00" strokeWidth={3} />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#FFFEF0",
                    flex: 1,
                  }}
                >
                  Current pace: On track for 40 apps/mo
                </span>
                <ArrowUpRight size={13} color="#C8FF00" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small reusable components

function BrutalButton({
  children,
  onClick,
  bg,
  textColor,
  border,
  shadow,
}: {
  children: ReactNode;
  onClick?: () => void;
  bg: string;
  textColor: string;
  border: string;
  shadow: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        color: textColor,
        border,
        padding: "6px 12px",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "0.05em",
        cursor: "pointer",
        boxShadow: shadow,
        fontFamily: "'Space Grotesk', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        transition: "all 0.08s ease",
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.boxShadow = "0px 0px 0px transparent";
        btn.style.transform = "translate(2px, 2px)";
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.style.boxShadow = shadow;
        btn.style.transform = "translate(0, 0)";
      }}
    >
      {children}
    </button>
  );
}

function FitBadge({ score }: { score: number }) {
  const bg = score >= 95 ? "#C8FF00" : score >= 90 ? "#0047FF" : "#FF5500";
  const fg = score >= 95 ? "#0A0A0A" : "#FFFEF0";
  return (
    <div
      style={{
        width: "46px",
        height: "46px",
        background: bg,
        border: "2px solid #0A0A0A",
        boxShadow: "2px 2px 0px #0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 900,
          color: fg,
          lineHeight: 1,
        }}
      >
        {score}
      </div>
      <div
        style={{
          fontSize: "8px",
          fontWeight: 800,
          color: score >= 95 ? "#333" : "rgba(255,255,240,0.75)",
          letterSpacing: "0.05em",
        }}
      >
        FIT
      </div>
    </div>
  );
}
