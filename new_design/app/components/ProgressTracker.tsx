import { useState } from "react";
import {
  TrendingUp,
  Target,
  Zap,
  Check,
  Calendar,
  Award,
  Clock,
  ChevronRight,
  ArrowUp,
  Flame,
} from "lucide-react";

const weeklyData = [
  { day: "MON", apps: 2, interviews: 0, value: 2 },
  { day: "TUE", apps: 3, interviews: 1, value: 3 },
  { day: "WED", apps: 1, interviews: 0, value: 1 },
  { day: "THU", apps: 0, interviews: 1, value: 0 },
  { day: "FRI", apps: 2, interviews: 0, value: 2 },
  { day: "SAT", apps: 0, interviews: 0, value: 0 },
  { day: "SUN", apps: 0, interviews: 0, value: 0 },
];
const maxVal = Math.max(...weeklyData.map((d) => d.value), 1);

const milestones = [
  {
    id: 1,
    label: "First 10 Applications",
    complete: true,
    date: "Jun 1",
    color: "#00CC88",
    icon: Target,
  },
  {
    id: 2,
    label: "First Phone Screen",
    complete: true,
    date: "Jun 3",
    color: "#00CC88",
    icon: Award,
  },
  {
    id: 3,
    label: "First In-Person Interview",
    complete: true,
    date: "Jun 7",
    color: "#00CC88",
    icon: Zap,
  },
  {
    id: 4,
    label: "Receive an Offer",
    complete: false,
    date: "Upcoming",
    color: "#0047FF",
    icon: Award,
  },
  {
    id: 5,
    label: "Negotiate & Accept",
    complete: false,
    date: "Upcoming",
    color: "#888",
    icon: Check,
  },
];

const skillProgress = [
  { skill: "Portfolio Presentation", level: 90, color: "#0047FF" },
  { skill: "Behavioral Q&A", level: 78, color: "#C8FF00" },
  { skill: "Technical Deep Dives", level: 65, color: "#FF5500" },
  { skill: "Negotiation Skills", level: 55, color: "#0047FF" },
  { skill: "Networking Outreach", level: 72, color: "#00CC88" },
];

const monthlyGoals = [
  { label: "Total Applications", current: 23, target: 40, color: "#0047FF" },
  { label: "Phone Screens", current: 5, target: 8, color: "#C8FF00" },
  { label: "Final Round Interviews", current: 3, target: 5, color: "#FF5500" },
  { label: "Offers Received", current: 1, target: 2, color: "#00CC88" },
];

const activityFeed = [
  { time: "2h ago", action: "Applied to", target: "OpenAI — Sr. Product Designer", color: "#0047FF" },
  { time: "5h ago", action: "Interview prep for", target: "Apple HIG Team", color: "#C8FF00" },
  { time: "1d ago", action: "Phone screen completed:", target: "Stripe Design Systems", color: "#FF5500" },
  { time: "2d ago", action: "Resume updated:", target: "Version 4 — AI Focus", color: "#00CC88" },
  { time: "3d ago", action: "Applied to", target: "Vercel — Design Lead", color: "#0047FF" },
];

export function ProgressTracker() {
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");

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
        <div
          style={{
            display: "inline-block",
            background: "#FF5500",
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
          PROGRESS TRACKER
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
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
            YOUR CAREER
            <br />
            <span style={{ color: "#FF5500" }}>MOMENTUM.</span>
          </h1>

          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { v: "23", l: "APPS SENT", c: "#0047FF", fg: "#FFFEF0" },
              { v: "14", l: "DAY STREAK", c: "#FF5500", fg: "#FFFEF0" },
              { v: "3", l: "INTERVIEWS", c: "#C8FF00", fg: "#0A0A0A" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: s.c,
                  border: "3px solid #0A0A0A",
                  boxShadow: "4px 4px 0px #0A0A0A",
                  padding: "12px 18px",
                  textAlign: "center",
                  minWidth: "85px",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 900,
                    color: s.fg,
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
                    color: s.c === "#C8FF00" ? "#444" : "rgba(255,255,240,0.65)",
                    marginTop: "3px",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
        {/* Activity chart */}
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
                background: "#FF5500",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <TrendingUp size={17} color="#FFFEF0" strokeWidth={3} />
                <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  APPLICATION ACTIVITY
                </span>
              </div>
              <div style={{ display: "flex", border: "2px solid rgba(255,255,240,0.3)" }}>
                {(["week", "month"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "5px 14px",
                      background: activeTab === tab ? "#FFFEF0" : "transparent",
                      border: "none",
                      color: activeTab === tab ? "#FF5500" : "rgba(255,255,240,0.7)",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: "24px 20px" }}>
              {/* Chart */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "140px", marginBottom: "8px" }}>
                {weeklyData.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    {d.interviews > 0 && (
                      <div
                        style={{
                          width: "100%",
                          height: `${(d.interviews / maxVal) * 80}px`,
                          background: "#FF5500",
                          border: "2px solid #0A0A0A",
                          minHeight: "8px",
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: "100%",
                        height: `${(d.apps / maxVal) * 80 + (d.value === 0 ? 6 : 0)}px`,
                        background: d.apps > 0 ? "#0047FF" : "#E8E8E0",
                        border: "2px solid #0A0A0A",
                        minHeight: "8px",
                      }}
                    />
                    <div style={{ fontSize: "10px", fontWeight: 800, color: "#888", marginTop: "4px" }}>
                      {d.day}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                {[
                  { color: "#0047FF", label: "Applications" },
                  { color: "#FF5500", label: "Interviews" },
                  { color: "#E8E8E0", label: "No activity" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        background: l.color,
                        border: "2px solid #0A0A0A",
                      }}
                    />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#666" }}>
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Streak card */}
        <div>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#0A0A0A",
              height: "100%",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "3px solid #FF5500",
                background: "#FF5500",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Flame size={17} color="#FFFEF0" strokeWidth={3} />
              <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                STREAK
              </span>
            </div>

            <div
              style={{
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  background: "#FF5500",
                  border: "4px solid #FF5500",
                  boxShadow: "6px 6px 0px #555",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "44px", fontWeight: 900, color: "#FFFEF0", lineHeight: 1 }}>
                  14
                </div>
                <div style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,240,0.7)", letterSpacing: "0.1em" }}>
                  DAYS
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#FFFEF0", marginBottom: "4px" }}>
                  Current Streak
                </div>
                <div style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>
                  Personal best: 21 days
                </div>
              </div>

              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Longest Streak", v: "21 days", c: "#C8FF00" },
                  { label: "This Month", v: "23 active days", c: "#C8FF00" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: "#111",
                      border: "1px solid #222",
                    }}
                  >
                    <span style={{ fontSize: "11px", fontWeight: 500, color: "#666" }}>{s.label}</span>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: s.c }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly goals */}
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
                background: "#0047FF",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Target size={17} color="#FFFEF0" strokeWidth={3} />
              <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                JUNE GOALS
              </span>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {monthlyGoals.map((goal, i) => {
                const pct = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A" }}>
                        {goal.label}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 900, color: "#0A0A0A" }}>
                        {goal.current}
                        <span style={{ color: "#AAA" }}>/{goal.target}</span>
                      </span>
                    </div>
                    <div
                      style={{
                        height: "12px",
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
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#888", marginTop: "2px", display: "flex", justifyContent: "space-between" }}>
                      <span>{pct}% complete</span>
                      {pct >= 100 && <span style={{ color: "#00CC88" }}>✓ DONE</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestones */}
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
                background: "#C8FF00",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Award size={17} color="#0A0A0A" strokeWidth={3} />
              <span style={{ color: "#0A0A0A", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                MILESTONES
              </span>
            </div>

            <div style={{ padding: "16px" }}>
              {milestones.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={m.id} style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: m.complete ? m.color : "#E8E8E0",
                          border: `2px solid ${m.complete ? "#0A0A0A" : "#CCC"}`,
                          boxShadow: m.complete ? "2px 2px 0px #0A0A0A" : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {m.complete ? (
                          <Check size={14} color={m.color === "#C8FF00" ? "#0A0A0A" : "#FFFEF0"} strokeWidth={3} />
                        ) : (
                          <Icon size={14} color="#AAA" strokeWidth={2} />
                        )}
                      </div>
                      {i < milestones.length - 1 && (
                        <div
                          style={{
                            width: "2px",
                            flex: 1,
                            minHeight: "16px",
                            background: m.complete ? "#0A0A0A" : "#DDD",
                            marginTop: "4px",
                          }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingTop: "4px" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 800,
                          color: m.complete ? "#0A0A0A" : "#AAA",
                          marginBottom: "2px",
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: m.complete ? "#00CC88" : "#CCC" }}>
                        {m.complete ? `✓ Achieved ${m.date}` : m.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skill progress */}
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
                background: "#0A0A0A",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Zap size={17} color="#C8FF00" strokeWidth={3} />
              <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                SKILL READINESS
              </span>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {skillProgress.map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A" }}>
                      {s.skill}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 900, color: "#0A0A0A" }}>
                      {s.level}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "12px",
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
                        width: `${s.level}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "8px",
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
                <ArrowUp size={14} color="#C8FF00" strokeWidth={3} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFFEF0", flex: 1 }}>
                  Improve negotiation: 2 resources ready
                </span>
                <ChevronRight size={13} color="#C8FF00" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Activity feed */}
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
                gap: "10px",
              }}
            >
              <Clock size={17} color="#0A0A0A" strokeWidth={3} />
              <span style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                RECENT ACTIVITY
              </span>
            </div>

            <div style={{ padding: "12px" }}>
              {activityFeed.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "10px 12px",
                    borderBottom: i < activityFeed.length - 1 ? "1px solid #E8E8E0" : "none",
                    cursor: "pointer",
                    transition: "background 0.08s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#F5F5E0";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: a.color,
                      border: "1px solid #0A0A0A",
                      flexShrink: 0,
                      marginTop: "5px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#444", marginBottom: "2px" }}>
                      {a.action}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: "#0A0A0A" }}>
                      {a.target}
                    </div>
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: "#AAA", flexShrink: 0, marginTop: "2px" }}>
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
