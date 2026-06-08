"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // On success redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0047FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <div
        style={{
          background: "#FFFEF0",
          border: "4px solid #0A0A0A",
          boxShadow: "12px 12px 0px #0A0A0A",
          padding: "48px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 900,
            margin: "0 0 8px 0",
            letterSpacing: "-0.04em",
          }}
        >
          WELCOME BACK
        </h1>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#666",
            marginBottom: "32px",
          }}
        >
          Access your agentic career co-pilot.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "8px",
                letterSpacing: "0.05em",
              }}
            >
              EMAIL
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "16px",
                border: "3px solid #0A0A0A",
                background: "#FFFEF0",
                fontSize: "16px",
                fontWeight: 600,
                outline: "none",
                boxShadow: "4px 4px 0px #0A0A0A",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "8px",
                letterSpacing: "0.05em",
              }}
            >
              PASSWORD
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "16px",
                border: "3px solid #0A0A0A",
                background: "#FFFEF0",
                fontSize: "16px",
                fontWeight: 600,
                outline: "none",
                boxShadow: "4px 4px 0px #0A0A0A",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ color: "#f87171", fontWeight: 700 }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              background: "#C8FF00",
              border: "3px solid #0A0A0A",
              padding: "16px",
              fontSize: "16px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "6px 6px 0px #0A0A0A",
            }}
          >
            {loading ? "Signing in…" : "SIGN IN"}{" "}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/signup"
            style={{
              color: "#0047FF",
              textDecoration: "underline",
              fontWeight: 800,
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
