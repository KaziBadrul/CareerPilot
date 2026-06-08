"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } } as any,
      });
      if (error) throw error;

      // If a user object is returned, create a record in the users table
      const userId = data?.user?.id;
      if (userId) {
        await supabase.from("users").upsert({ id: userId, email, name });
      }

      setDone(true);
      // After sign up, redirect to login (or directly to dashboard if session exists)
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#C8FF00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        padding: "20px",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <Zap size={32} color="#0047FF" strokeWidth={3} />
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.04em",
            }}
          >
            INITIALIZE
          </h1>
        </div>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#666",
            marginBottom: "32px",
          }}
        >
          Upload your CV and configure your AI agent.
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
              FULL NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="John Doe"
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
              background: "#0047FF",
              color: "#FFFEF0",
              border: "3px solid #0A0A0A",
              padding: "16px",
              fontSize: "16px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "6px 6px 0px #0A0A0A",
            }}
          >
            {loading ? "Creating…" : "CREATE ACCOUNT"}
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
          Already flying?{" "}
          <Link
            href="/login"
            style={{
              color: "#FF5500",
              textDecoration: "underline",
              fontWeight: 800,
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
