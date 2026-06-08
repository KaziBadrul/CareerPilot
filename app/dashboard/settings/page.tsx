"use client";

import { User, Bell, Zap, Link as LinkIcon, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ padding: "36px 40px", minHeight: "100%", background: "#FFFEF0" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "inline-block", background: "#888", border: "3px solid #0A0A0A", padding: "4px 14px", fontSize: "11px", fontWeight: 900, color: "#FFFEF0", marginBottom: "12px", boxShadow: "4px 4px 0px #0A0A0A" }}>
          SETTINGS
        </div>
        <h1 style={{ fontSize: "44px", fontWeight: 900, margin: 0, lineHeight: 0.95 }}>
          CONFIGURE YOUR<br/><span style={{ color: "#0047FF" }}>CAREERPILOT.</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>
        <div style={{ border: "3px solid #0A0A0A", boxShadow: "4px 4px 0px #0A0A0A", background: "#FFFEF0", height: "fit-content" }}>
          {[
            { l: "Profile", i: User, active: true },
            { l: "Notifications", i: Bell, active: false },
            { l: "AI Agent", i: Zap, active: false },
            { l: "Integrations", i: LinkIcon, active: false },
            { l: "Privacy", i: Shield, active: false },
          ].map((t, i) => (
            <button key={i} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: t.active ? "#0047FF" : "transparent", color: t.active ? "#FFFEF0" : "#555", border: "none", borderBottom: i < 4 ? "2px solid #E8E8E0" : "none", textAlign: "left", cursor: "pointer" }}>
              <t.i size={16} strokeWidth={t.active ? 3 : 2} />
              <span style={{ fontSize: "13px", fontWeight: t.active ? 800 : 600 }}>{t.l}</span>
            </button>
          ))}
        </div>

        <div>
          <div style={{ border: "3px solid #0A0A0A", boxShadow: "4px 4px 0px #0A0A0A", background: "#FFFEF0" }}>
            <div style={{ padding: "14px 24px", borderBottom: "3px solid #0A0A0A", background: "#0047FF", display: "flex", alignItems: "center", gap: "10px", color: "#FFFEF0" }}>
              <User size={17} strokeWidth={3} />
              <span style={{ fontSize: "13px", fontWeight: 900 }}>PROFILE SETTINGS</span>
            </div>
            
            <div style={{ padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
                <div style={{ width: "72px", height: "72px", background: "#0047FF", border: "3px solid #0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: 900, color: "#FFFEF0", boxShadow: "4px 4px 0px #0A0A0A" }}>
                  AJ
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 900, marginBottom: "8px" }}>Alex Johnson</div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ border: "2px solid #0A0A0A", background: "#FFFEF0", padding: "6px 12px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>UPLOAD PHOTO</button>
                    <button style={{ border: "2px solid #DDD", background: "transparent", color: "#888", padding: "6px 12px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}>REMOVE</button>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>FULL NAME</label>
                  <input defaultValue="Alex Johnson" style={{ width: "100%", padding: "12px", border: "2px solid #0A0A0A", outline: "none", fontSize: "14px", fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, marginBottom: "8px" }}>CURRENT TITLE</label>
                  <input defaultValue="Student & Researcher" style={{ width: "100%", padding: "12px", border: "2px solid #0A0A0A", outline: "none", fontSize: "14px", fontWeight: 600 }} />
                </div>
              </div>
            </div>
          </div>
          <button style={{ marginTop: "16px", background: "#0A0A0A", color: "#FFFEF0", border: "3px solid #0A0A0A", padding: "12px 24px", fontSize: "12px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "4px 4px 0px #0A0A0A" }}>
            <Save size={16} strokeWidth={3} /> SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}