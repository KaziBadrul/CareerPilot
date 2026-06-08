import { useState } from "react";
import {
  User,
  Bell,
  Zap,
  Shield,
  Link,
  Save,
  ChevronRight,
  Check,
  ToggleLeft,
  ToggleRight,
  Upload,
  Trash2,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "ai" | "integrations" | "privacy";

const tabs: { id: SettingsTab; label: string; icon: typeof User; color: string }[] = [
  { id: "profile", label: "Profile", icon: User, color: "#0047FF" },
  { id: "notifications", label: "Notifications", icon: Bell, color: "#FF5500" },
  { id: "ai", label: "AI Agent", icon: Zap, color: "#C8FF00" },
  { id: "integrations", label: "Integrations", icon: Link, color: "#00CC88" },
  { id: "privacy", label: "Privacy", icon: Shield, color: "#888" },
];

interface Toggle {
  label: string;
  desc: string;
  value: boolean;
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    title: "Senior Product Designer",
    location: "San Francisco, CA",
    email: "alex.johnson@email.com",
    linkedin: "linkedin.com/in/alexjohnson",
    targetRole: "Design Lead / Head of Design",
    targetSalaryMin: "160000",
    targetSalaryMax: "220000",
    workPreference: "remote",
  });

  const [notifToggles, setNotifToggles] = useState<Toggle[]>([
    { label: "New Job Matches", desc: "Alert when AI finds high-fit roles", value: true },
    { label: "Interview Reminders", desc: "24h and 1h before each session", value: true },
    { label: "Application Deadlines", desc: "3 days before deadline", value: true },
    { label: "Weekly Progress Report", desc: "Summary every Monday 9am", value: true },
    { label: "AI Agent Updates", desc: "When agent takes autonomous actions", value: false },
    { label: "Salary Insights", desc: "Market changes for target roles", value: false },
  ]);

  const [aiToggles, setAiToggles] = useState<Toggle[]>([
    { label: "Auto-apply to 95%+ matches", desc: "Agent applies with your saved templates", value: false },
    { label: "Smart follow-up emails", desc: "Draft and queue follow-ups automatically", value: true },
    { label: "Resume tailoring", desc: "Auto-adjust resume for each application", value: true },
    { label: "Interview coaching", desc: "Proactive prep before scheduled interviews", value: true },
    { label: "Salary negotiation assist", desc: "Real-time guidance during negotiation", value: false },
  ]);

  const integrations = [
    { name: "LinkedIn", status: "connected", color: "#0047FF", desc: "Syncing profile & connections" },
    { name: "Google Calendar", status: "connected", color: "#FF5500", desc: "Interview scheduling active" },
    { name: "Gmail", status: "connected", color: "#00CC88", desc: "Email tracking enabled" },
    { name: "Greenhouse ATS", status: "disconnected", color: "#888", desc: "Not connected" },
    { name: "Lever ATS", status: "disconnected", color: "#888", desc: "Not connected" },
    { name: "Notion", status: "disconnected", color: "#888", desc: "Not connected" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (i: number) => {
    setNotifToggles((prev) =>
      prev.map((t, j) => (j === i ? { ...t, value: !t.value } : t))
    );
  };

  const toggleAi = (i: number) => {
    setAiToggles((prev) =>
      prev.map((t, j) => (j === i ? { ...t, value: !t.value } : t))
    );
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
        <div
          style={{
            display: "inline-block",
            background: "#888",
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
          SETTINGS
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
          CONFIGURE YOUR
          <br />
          <span style={{ color: "#0047FF" }}>CAREERPILOT.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>
        {/* Tab sidebar */}
        <div>
          <div
            style={{
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            {tabs.map((tab, i) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    background: isActive ? tab.color : "transparent",
                    border: "none",
                    borderBottom: i < tabs.length - 1 ? "2px solid #E8E8E0" : "none",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    textAlign: "left",
                    transition: "all 0.08s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "#F5F5E0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }
                  }}
                >
                  <Icon
                    size={16}
                    color={isActive ? (tab.color === "#C8FF00" ? "#0A0A0A" : "#FFFEF0") : "#666"}
                    strokeWidth={isActive ? 3 : 2}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? (tab.color === "#C8FF00" ? "#0A0A0A" : "#FFFEF0") : "#555",
                      flex: 1,
                    }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <ChevronRight
                      size={13}
                      color={tab.color === "#C8FF00" ? "#0A0A0A" : "#FFFEF0"}
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === "profile" && (
            <div
              style={{
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                background: "#FFFEF0",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "3px solid #0A0A0A",
                  background: "#0047FF",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <User size={17} color="#FFFEF0" strokeWidth={3} />
                <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  PROFILE SETTINGS
                </span>
              </div>

              <div style={{ padding: "28px 24px" }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      background: "#0047FF",
                      border: "3px solid #0A0A0A",
                      boxShadow: "4px 4px 0px #0A0A0A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: 900,
                      color: "#FFFEF0",
                    }}
                  >
                    AJ
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "6px" }}>Alex Johnson</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 14px",
                          background: "#FFFEF0",
                          border: "2px solid #0A0A0A",
                          boxShadow: "2px 2px 0px #0A0A0A",
                          fontSize: "11px",
                          fontWeight: 800,
                          letterSpacing: "0.05em",
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                          transition: "all 0.08s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 0px #0A0A0A";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                        }}
                      >
                        <Upload size={12} strokeWidth={3} />
                        UPLOAD PHOTO
                      </button>
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "7px 14px",
                          background: "transparent",
                          border: "2px solid #DDD",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#888",
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        <Trash2 size={12} strokeWidth={2} />
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {[
                    { label: "Full Name", key: "name" as const, placeholder: "Your name" },
                    { label: "Current Title", key: "title" as const, placeholder: "Job title" },
                    { label: "Location", key: "location" as const, placeholder: "City, State" },
                    { label: "Email", key: "email" as const, placeholder: "you@email.com" },
                    { label: "LinkedIn URL", key: "linkedin" as const, placeholder: "linkedin.com/in/..." },
                    { label: "Target Role", key: "targetRole" as const, placeholder: "e.g. Design Lead" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          color: "#0A0A0A",
                          marginBottom: "6px",
                        }}
                      >
                        {field.label.toUpperCase()}
                      </label>
                      <input
                        value={profile[field.key]}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))
                        }
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          border: "2px solid #0A0A0A",
                          background: "#FFFEF0",
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#0A0A0A",
                          fontFamily: "'Space Grotesk', sans-serif",
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "box-shadow 0.08s ease",
                        }}
                        onFocus={(e) => {
                          (e.currentTarget as HTMLInputElement).style.boxShadow = "3px 3px 0px #0047FF";
                          (e.currentTarget as HTMLInputElement).style.borderColor = "#0047FF";
                        }}
                        onBlur={(e) => {
                          (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
                          (e.currentTarget as HTMLInputElement).style.borderColor = "#0A0A0A";
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Salary range */}
                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#0A0A0A",
                      marginBottom: "8px",
                    }}
                  >
                    TARGET SALARY RANGE
                  </label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input
                      value={profile.targetSalaryMin}
                      onChange={(e) => setProfile((prev) => ({ ...prev, targetSalaryMin: e.target.value }))}
                      placeholder="Min"
                      style={{
                        width: "140px",
                        padding: "12px 14px",
                        border: "2px solid #0A0A0A",
                        background: "#FFFEF0",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0A0A0A",
                        fontFamily: "'Space Grotesk', sans-serif",
                        outline: "none",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#888" }}>to</span>
                    <input
                      value={profile.targetSalaryMax}
                      onChange={(e) => setProfile((prev) => ({ ...prev, targetSalaryMax: e.target.value }))}
                      placeholder="Max"
                      style={{
                        width: "140px",
                        padding: "12px 14px",
                        border: "2px solid #0A0A0A",
                        background: "#FFFEF0",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#0A0A0A",
                        fontFamily: "'Space Grotesk', sans-serif",
                        outline: "none",
                      }}
                    />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#888" }}>USD / year</span>
                  </div>
                </div>

                {/* Work preference */}
                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#0A0A0A",
                      marginBottom: "8px",
                    }}
                  >
                    WORK PREFERENCE
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["remote", "hybrid", "onsite"].map((pref) => (
                      <button
                        key={pref}
                        onClick={() => setProfile((prev) => ({ ...prev, workPreference: pref }))}
                        style={{
                          padding: "10px 20px",
                          background: profile.workPreference === pref ? "#0047FF" : "#FFFEF0",
                          border: "2px solid #0A0A0A",
                          boxShadow: profile.workPreference === pref ? "3px 3px 0px #0A0A0A" : "none",
                          fontSize: "12px",
                          fontWeight: 800,
                          letterSpacing: "0.05em",
                          color: profile.workPreference === pref ? "#FFFEF0" : "#555",
                          cursor: "pointer",
                          fontFamily: "'Space Grotesk', sans-serif",
                          textTransform: "uppercase",
                          transition: "all 0.08s ease",
                        }}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div
              style={{
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                background: "#FFFEF0",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "3px solid #0A0A0A",
                  background: "#FF5500",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Bell size={17} color="#FFFEF0" strokeWidth={3} />
                <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  NOTIFICATION SETTINGS
                </span>
              </div>
              <div style={{ padding: "8px 0" }}>
                {notifToggles.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderBottom: i < notifToggles.length - 1 ? "1px solid #E8E8E0" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleNotif(i)}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0A0A0A", marginBottom: "3px" }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#888" }}>
                        {t.desc}
                      </div>
                    </div>
                    <div>
                      {t.value ? (
                        <ToggleRight size={32} color="#FF5500" strokeWidth={2} />
                      ) : (
                        <ToggleLeft size={32} color="#CCC" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div
              style={{
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                background: "#FFFEF0",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "3px solid #0A0A0A",
                  background: "#C8FF00",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Zap size={17} color="#0A0A0A" strokeWidth={3} />
                <span style={{ color: "#0A0A0A", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  AI AGENT SETTINGS
                </span>
              </div>

              <div
                style={{
                  margin: "20px 24px",
                  padding: "14px",
                  background: "#0A0A0A",
                  border: "2px solid #0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Zap size={16} color="#C8FF00" strokeWidth={3} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFEF0" }}>
                  Agent autonomy level: <strong style={{ color: "#C8FF00" }}>Supervised</strong> — All actions require your approval
                </span>
              </div>

              <div style={{ padding: "0 0 8px" }}>
                {aiToggles.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderBottom: i < aiToggles.length - 1 ? "1px solid #E8E8E0" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleAi(i)}
                  >
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0A0A0A", marginBottom: "3px" }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#888" }}>
                        {t.desc}
                      </div>
                    </div>
                    <div>
                      {t.value ? (
                        <ToggleRight size={32} color="#C8FF00" strokeWidth={2} style={{ filter: "drop-shadow(0 0 4px #C8FF00)" }} />
                      ) : (
                        <ToggleLeft size={32} color="#CCC" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div
              style={{
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                background: "#FFFEF0",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "3px solid #0A0A0A",
                  background: "#00CC88",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Link size={17} color="#0A0A0A" strokeWidth={3} />
                <span style={{ color: "#0A0A0A", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  INTEGRATIONS
                </span>
              </div>

              <div style={{ padding: "8px 0" }}>
                {integrations.map((intg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 24px",
                      borderBottom: i < integrations.length - 1 ? "1px solid #E8E8E0" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: intg.color,
                        border: "2px solid #0A0A0A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 900,
                        color: intg.color === "#C8FF00" || intg.color === "#00CC88" ? "#0A0A0A" : "#FFFEF0",
                        flexShrink: 0,
                      }}
                    >
                      {intg.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0A0A0A", marginBottom: "2px" }}>
                        {intg.name}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: "#888" }}>
                        {intg.desc}
                      </div>
                    </div>
                    <button
                      style={{
                        padding: "8px 16px",
                        background: intg.status === "connected" ? "#FFFEF0" : "#0047FF",
                        border: "2px solid #0A0A0A",
                        boxShadow: "2px 2px 0px #0A0A0A",
                        fontSize: "11px",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        color: intg.status === "connected" ? "#0A0A0A" : "#FFFEF0",
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.08s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 0px #0A0A0A";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                      }}
                    >
                      {intg.status === "connected" ? (
                        <>
                          <Check size={12} strokeWidth={3} />
                          CONNECTED
                        </>
                      ) : (
                        "CONNECT"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div
              style={{
                border: "3px solid #0A0A0A",
                boxShadow: "4px 4px 0px #0A0A0A",
                background: "#FFFEF0",
              }}
            >
              <div
                style={{
                  padding: "14px 24px",
                  borderBottom: "3px solid #0A0A0A",
                  background: "#0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Shield size={17} color="#FFFEF0" strokeWidth={3} />
                <span style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 900, letterSpacing: "0.07em" }}>
                  PRIVACY & DATA
                </span>
              </div>

              <div style={{ padding: "24px" }}>
                {[
                  {
                    title: "Data Sharing",
                    desc: "CareerPilot uses your data to improve AI recommendations. Your data is never sold to third parties.",
                    color: "#0047FF",
                  },
                  {
                    title: "AI Training",
                    desc: "Opt out of anonymous usage data being used to improve the AI models.",
                    color: "#FF5500",
                  },
                  {
                    title: "Profile Visibility",
                    desc: "Control whether recruiters on partner platforms can discover your profile.",
                    color: "#00CC88",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      border: "2px solid #0A0A0A",
                      marginBottom: "12px",
                      background: "#FFFEF0",
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "20px",
                        background: item.color,
                        display: "inline-block",
                        marginRight: "12px",
                        verticalAlign: "middle",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "#0A0A0A", verticalAlign: "middle" }}>
                      {item.title}
                    </span>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#666", margin: "8px 0 0 16px" }}>
                      {item.desc}
                    </p>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    background: "#FFF0F0",
                    border: "2px solid #FF5500",
                    boxShadow: "3px 3px 0px #FF5500",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#FF5500", marginBottom: "6px" }}>
                    DANGER ZONE
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#888", marginBottom: "12px" }}>
                    Delete your account and all associated data. This action cannot be undone.
                  </div>
                  <button
                    style={{
                      padding: "10px 20px",
                      background: "#FF5500",
                      border: "2px solid #0A0A0A",
                      boxShadow: "3px 3px 0px #0A0A0A",
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      color: "#FFFEF0",
                      cursor: "pointer",
                      fontFamily: "'Space Grotesk', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.08s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0px 0px 0px #0A0A0A";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translate(3px, 3px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px #0A0A0A";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                    }}
                  >
                    <Trash2 size={14} strokeWidth={3} />
                    DELETE MY ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: saved ? "#00CC88" : "#0A0A0A",
                border: "3px solid #0A0A0A",
                boxShadow: saved ? "4px 4px 0px #005533" : "4px 4px 0px #0A0A0A",
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "0.06em",
                color: "#FFFEF0",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!saved) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!saved) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "4px 4px 0px #0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                }
              }}
            >
              {saved ? (
                <>
                  <Check size={16} strokeWidth={3} />
                  SAVED!
                </>
              ) : (
                <>
                  <Save size={16} strokeWidth={3} />
                  SAVE CHANGES
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
