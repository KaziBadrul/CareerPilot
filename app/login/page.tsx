"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0047FF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ background: "#FFFEF0", border: "4px solid #0A0A0A", boxShadow: "12px 12px 0px #0A0A0A", padding: "48px", width: "100%", maxWidth: "480px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: 900, margin: "0 0 8px 0", letterSpacing: "-0.04em" }}>WELCOME BACK</h1>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#666", marginBottom: "32px" }}>Access your agentic career co-pilot.</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.05em" }}>EMAIL</label>
            <input type="email" placeholder="you@example.com" style={{ width: "100%", padding: "16px", border: "3px solid #0A0A0A", background: "#FFFEF0", fontSize: "16px", fontWeight: 600, outline: "none", boxShadow: "4px 4px 0px #0A0A0A", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.05em" }}>PASSWORD</label>
            <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "16px", border: "3px solid #0A0A0A", background: "#FFFEF0", fontSize: "16px", fontWeight: 600, outline: "none", boxShadow: "4px 4px 0px #0A0A0A", boxSizing: "border-box" }} />
          </div>
        </div>

        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: "#C8FF00", border: "3px solid #0A0A0A", padding: "16px", fontSize: "16px", fontWeight: 900, cursor: "pointer", boxShadow: "6px 6px 0px #0A0A0A" }}>
            SIGN IN <ArrowRight size={20} strokeWidth={3} />
          </button>
        </Link>
        
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", fontWeight: 600 }}>
          Don't have an account? <Link href="/signup" style={{ color: "#0047FF", textDecoration: "underline", fontWeight: 800 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}