import { Loader2 } from "lucide-react";

export default function JobSearchLoading() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", background: "#FFFEF0", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: "32px", border: "3px solid #0A0A0A", padding: "24px", background: "transparent" }}>
        <div style={{ height: "24px", background: "#EAE9E0", border: "2px solid #0A0A0A", marginBottom: "12px", width: "240px" }} />
        <div style={{ height: "16px", background: "#EAE9E0", border: "1px solid #0A0A0A", width: "420px" }} />
      </div>

      {/* Search bar skeleton */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div style={{ flex: 1, height: "48px", background: "transparent", border: "3px solid #0A0A0A" }} />
        <div style={{ width: "120px", height: "48px", background: "#EAE9E0", border: "3px solid #0A0A0A" }} />
      </div>

      {/* Loading active info ticker */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "48px 0" }}>
        <Loader2 size={24} color="#0047FF" className="animate-spin" />
        <p style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#0A0A0A", letterSpacing: "0.05em" }}>
          Synchronizing active global job clusters...
        </p>
      </div>

      {/* Skeleton Cards matrix */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              border: "3px solid #0A0A0A",
              padding: "20px",
              height: "150px",
              background: "transparent",
              boxShadow: "4px 4px 0px #0A0A0A",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", border: "2px solid #0A0A0A", background: "#EAE9E0" }} />
              <div>
                <div style={{ height: "16px", background: "#EAE9E0", border: "1px solid #0A0A0A", width: "200px", marginBottom: "6px" }} />
                <div style={{ height: "12px", background: "#EAE9E0", width: "120px" }} />
              </div>
            </div>
            <div style={{ height: "24px", background: "#EAE9E0", border: "1px solid #0A0A0A", width: "100px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}