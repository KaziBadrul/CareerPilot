"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Dynamic User Profile Component
const UserProfile = () => {
  const [profile, setProfile] = useState({ name: "Loading...", title: "..." });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          if (mounted) setProfile({ name: "User", title: "Developer" });
          return;
        }

        const { data: userRow, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (!mounted) return;

        if (error) {
          setProfile({
            name: user.email?.split("@")[0] || "User",
            title: "Developer",
          });
        } else {
          setProfile({
            name: userRow?.name || user.email?.split("@")[0] || "User",
            title: "Developer",
          });
        }
      } catch {
        if (mounted) setProfile({ name: "User", title: "Developer" });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const initials = (profile.name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        background: "#111",
        border: "2px solid #2A2A2A",
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
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#FFFEF0", fontSize: "13px", fontWeight: 700 }}>
          {profile.name}
        </div>
        <div style={{ color: "#555", fontSize: "11px" }}>{profile.title}</div>
      </div>
      <Bell size={14} color="#555" />
    </div>
  );
};

const navItems = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    accent: "#C8FF00",
    textDark: true,
  },
  {
    id: "job-hunter",
    href: "/dashboard/jobs",
    label: "Job Hunter",
    icon: Search,
    accent: "#0047FF",
    textDark: false,
  },
  {
    id: "ai-assistant",
    href: "/dashboard/assistant",
    label: "AI Assistant",
    icon: MessageSquare,
    accent: "#C8FF00",
    textDark: true,
  },
  {
    id: "progress-tracker",
    href: "/dashboard/kanban",
    label: "Progress Tracker",
    icon: TrendingUp,
    accent: "#FF5500",
    textDark: false,
  },
  {
    id: "settings",
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    accent: "#444",
    textDark: false,
  },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (mounted && !user) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (mounted) router.push("/login");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#FFFEF0",
        fontFamily: "'Space Grotesk', sans-serif",
        overflow: "hidden",
      }}
    >
      <aside
        style={{
          width: "256px",
          height: "100vh",
          background: "#0A0A0A",
          borderRight: "3px solid #000",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "24px 20px", borderBottom: "3px solid #222" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
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
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
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
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 10px",
                    background: isActive ? item.accent : "transparent",
                    border: isActive
                      ? `2px solid ${item.accent}`
                      : "2px solid transparent",
                    cursor: "pointer",
                    marginBottom: "4px",
                    textAlign: "left",
                    boxShadow: isActive ? "3px 3px 0px #000" : "none",
                    transform: isActive ? "translate(-1px, -1px)" : "none",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <Icon
                    size={17}
                    color={
                      isActive
                        ? item.textDark
                          ? "#0A0A0A"
                          : "#FFFEF0"
                        : "#666"
                    }
                    strokeWidth={isActive ? 3 : 2}
                  />
                  <span
                    style={{
                      color: isActive
                        ? item.textDark
                          ? "#0A0A0A"
                          : "#FFFEF0"
                        : "#888",
                      fontSize: "14px",
                      fontWeight: isActive ? 800 : 500,
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
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div style={{ padding: "16px", borderTop: "3px solid #222" }}>
          <UserProfile />

          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <button
              onClick={handleSignOut}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "transparent",
                border: "2px solid #2A2A2A",
                color: "#DDD",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", background: "#FFFEF0" }}>
        {children}
      </main>
    </div>
  );
}
