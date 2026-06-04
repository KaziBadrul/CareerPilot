import { Loader2 } from "lucide-react";

export default function JobSearchLoading() {
  return (
    <div style={{ maxWidth: "740px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            height: "24px",
            background: "var(--field)",
            borderRadius: "8px",
            marginBottom: "8px",
            width: "200px",
          }}
        />
        <div
          style={{
            height: "16px",
            background: "var(--field)",
            borderRadius: "6px",
            width: "350px",
          }}
        />
      </div>

      {/* Search bar skeleton */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            height: "40px",
            background: "var(--field)",
            borderRadius: "10px",
          }}
        />
        <div
          style={{
            width: "120px",
            height: "40px",
            background: "var(--field)",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Examples skeleton */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            height: "12px",
            background: "var(--field)",
            borderRadius: "6px",
            marginBottom: "8px",
            width: "80px",
          }}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "32px",
                width: "150px",
                background: "var(--field)",
                borderRadius: "100px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "48px 0",
          color: "var(--muted)",
        }}
      >
        <Loader2 size={22} className="animate-spin" />
        <p style={{ fontSize: "13px", margin: 0 }}>Loading job search...</p>
      </div>

      {/* Job card skeletons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "16px",
              height: "160px",
              background:
                "linear-gradient(90deg, var(--surface) 0%, var(--surface-hover) 50%, var(--surface) 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  );
}
