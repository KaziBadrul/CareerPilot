import {
  LayoutDashboard,
  Search,
  MessageSquare,
  TrendingUp,
  Settings,
  Zap,
  Bell,
  ChevronRight,
} from "lucide-react";
import type { Page } from "../types";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, accent: "#C8FF00", textDark: true },
  { id: "job-hunter", label: "Job Hunter", icon: Search, accent: "#0047FF", textDark: false },
  { id: "ai-assistant", label: "AI Assistant", icon: MessageSquare, accent: "#C8FF00", textDark: true },
  { id: "progress-tracker", label: "Progress Tracker", icon: TrendingUp, accent: "#FF5500", textDark: false },
  { id: "settings", label: "Settings", icon: Settings, accent: "#444", textDark: false },
] as const;

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside
      style={{
        width: "256px",
        minHeight: "100vh",
        background: "#0A0A0A",
        borderRight: "3px solid #000",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "3px solid #222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              background: "#C8FF00",
              border: "3px solid #C8FF00",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "3px 3px 0px #444",
              flexShrink: 0,
            }}
          >
            <Zap size={20} color="#0A0A0A" strokeWidth={3} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <div
              style={{
                color: "#FFFEF0",
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              CAREER
            </div>
            <div
              style={{
                color: "#C8FF00",
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              PILOT
            </div>
          </div>
        </div>

        <div
          style={{
            background: "transparent",
            border: "2px solid #2A2A2A",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#C8FF00",
              borderRadius: "50%",
              boxShadow: "0 0 6px #C8FF00",
            }}
          />
          <span
            style={{
              color: "#777",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            AI AGENT ACTIVE
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: "#C8FF00",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            v2.4
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#444",
            letterSpacing: "0.12em",
            padding: "0 10px",
            marginBottom: "10px",
          }}
        >
          NAVIGATION
        </div>

        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as Page)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 10px",
                background: isActive ? item.accent : "transparent",
                border: isActive ? `2px solid ${item.accent}` : "2px solid transparent",
                cursor: "pointer",
                marginBottom: "4px",
                textAlign: "left",
                boxShadow: isActive ? "3px 3px 0px #000" : "none",
                transition: "all 0.08s ease",
                transform: isActive ? "translate(-1px, -1px)" : "none",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "#1A1A1A";
                  btn.style.borderColor = "#333";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "transparent";
                  btn.style.borderColor = "transparent";
                }
              }}
            >
              <Icon
                size={17}
                color={isActive ? (item.textDark ? "#0A0A0A" : "#FFFEF0") : "#666"}
                strokeWidth={isActive ? 3 : 2}
              />
              <span
                style={{
                  color: isActive ? (item.textDark ? "#0A0A0A" : "#FFFEF0") : "#888",
                  fontSize: "14px",
                  fontWeight: isActive ? 800 : 500,
                  letterSpacing: isActive ? "0.02em" : "0",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <ChevronRight
                  size={13}
                  color={item.textDark ? "#0A0A0A" : "#FFFEF0"}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ margin: "16px 0", borderTop: "1px solid #222" }} />

        {/* Quick stats */}
        <div style={{ padding: "0 4px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#444",
              letterSpacing: "0.12em",
              marginBottom: "10px",
              padding: "0 6px",
            }}
          >
            THIS WEEK
          </div>
          {[
            { label: "Jobs Applied", value: "8", color: "#0047FF" },
            { label: "AI Prompts Used", value: "47", color: "#C8FF00" },
            { label: "Interviews Set", value: "2", color: "#FF5500" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                marginBottom: "4px",
                background: "#111",
                border: "1px solid #222",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#777" }}>
                {stat.label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 900,
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </nav>

      {/* User profile */}
      <div style={{ padding: "16px", borderTop: "3px solid #222" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            background: "#111",
            border: "2px solid #2A2A2A",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "#0047FF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "#2A2A2A";
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "#0047FF",
              border: "2px solid #0047FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 900,
              color: "#FFFEF0",
              flexShrink: 0,
            }}
          >
            AJ
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: "#FFFEF0",
                fontSize: "13px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Alex Johnson
            </div>
            <div style={{ color: "#555", fontSize: "11px" }}>Sr. Product Designer</div>
          </div>
          <Bell size={14} color="#555" />
        </div>
      </div>
    </aside>
  );
}
