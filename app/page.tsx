"use client";

import Link from "next/link";
import { Zap, ArrowRight, Terminal } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFEF0", fontFamily: "'Space Grotesk', sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{ padding: "20px 40px", borderBottom: "3px solid #0A0A0A", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFEF0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#C8FF00", border: "3px solid #0A0A0A", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px #0A0A0A" }}>
            <Terminal size={24} color="#0A0A0A" strokeWidth={3} />
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.04em", color: "#0A0A0A" }}>
            CAREER<span style={{ color: "#0047FF" }}>PILOT</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "10px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer", boxShadow: "4px 4px 0px #0A0A0A" }}>
              LOGIN
            </button>
          </Link>
          <Link href="/signup" style={{ textDecoration: "none" }}>
            <button style={{ background: "#0047FF", color: "#FFFEF0", border: "3px solid #0A0A0A", padding: "10px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer", boxShadow: "4px 4px 0px #0A0A0A" }}>
              GET STARTED
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ background: "#FF5500", color: "#FFFEF0", padding: "8px 16px", border: "3px solid #0A0A0A", fontWeight: 900, fontSize: "14px", letterSpacing: "0.1em", marginBottom: "24px", boxShadow: "4px 4px 0px #0A0A0A", transform: "rotate(-2deg)" }}>
          YOUR AGENTIC CAREER CO-PILOT
        </div>
        <h1 style={{ fontSize: "80px", fontWeight: 900, color: "#0A0A0A", lineHeight: 0.9, letterSpacing: "-0.04em", maxWidth: "900px", margin: "0 0 32px 0" }}>
          HUNT JOBS. <br />
          SCORE FIT. <br />
          <span style={{ color: "#0047FF", textDecoration: "underline", textDecorationThickness: "8px", textUnderlineOffset: "8px" }}>GET HIRED.</span>
        </h1>
        <p style={{ fontSize: "20px", fontWeight: 600, color: "#444", maxWidth: "600px", marginBottom: "48px", lineHeight: 1.5 }}>
          Build an AI platform that knows you. Grounded entirely in your CV, tracking your applications, and mapping your skills.
        </p>
        <Link href="/signup" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "12px", background: "#C8FF00", border: "4px solid #0A0A0A", padding: "16px 40px", fontSize: "18px", fontWeight: 900, cursor: "pointer", boxShadow: "8px 8px 0px #0A0A0A", transition: "transform 0.1s" }}>
            <Zap size={24} strokeWidth={3} />
            LAUNCH PLATFORM
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </Link>
      </main>
    </div>
  );
}