"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Search, Loader2, Clock } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface JobSearch {
  id: string;
  query: string;
  results_count: number;
  created_at: string;
}

export default function SearchesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [searches, setSearches] = useState<JobSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSearches = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("job_searches")
          .select("id, query, results_count, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        setSearches(data || []);
      } catch (err) {
        console.error("Failed to fetch searches:", err);
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        fetchSearches(user.id);
      } catch (err) {
        console.error("Auth error:", err);
        router.push("/login");
      }
    }
    init();
  }, [router, supabase, fetchSearches]);

  const handleDelete = async (searchId: string) => {
    setDeleting(searchId);
    try {
      const { error } = await supabase
        .from("job_searches")
        .delete()
        .eq("id", searchId);

      if (error) throw error;
      setSearches((prev) => prev.filter((s) => s.id !== searchId));
    } catch (err) {
      console.error("Failed to delete search:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleSearchClick = (query: string) => {
    router.push(`/dashboard/jobs?q=${encodeURIComponent(query)}`);
  };

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          color: "var(--muted)",
        }}
      >
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--white)",
            margin: "0 0 8px",
          }}
        >
          Recent Searches
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", margin: 0 }}>
          View and manage your job search history
        </p>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            color: "var(--muted)",
          }}
        >
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : searches.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <Search
            size={32}
            color="var(--muted)"
            style={{ opacity: 0.3, marginBottom: "12px" }}
          />
          <p style={{ fontSize: "15px", color: "var(--muted)", margin: 0 }}>
            No searches yet. Start by searching for jobs!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {searches.map((search) => {
            const date = new Date(search.created_at);
            const isToday = date.toDateString() === new Date().toDateString();
            const displayDate = isToday
              ? date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year:
                    date.getFullYear() !== new Date().getFullYear()
                      ? "numeric"
                      : undefined,
                });

            return (
              <div
                key={search.id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)";
                  e.currentTarget.style.background = "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--surface)";
                }}
              >
                <div
                  style={{ flex: 1, minWidth: 0 }}
                  onClick={() => handleSearchClick(search.query)}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--white)",
                      margin: "0 0 6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {search.query}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      fontSize: "13px",
                      color: "var(--muted)",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Search size={13} />
                      {search.results_count} result
                      {search.results_count !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock size={13} />
                      {displayDate}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(search.id);
                  }}
                  disabled={deleting === search.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    color: "#f87171",
                    cursor: deleting === search.id ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (deleting !== search.id) {
                      e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  }}
                  title="Delete search"
                >
                  {deleting === search.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
