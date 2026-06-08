"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  LogOut,
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  FileUp,
  Briefcase,
  MessageSquare,
  Trash2,
  Clock,
  Bookmark,
  Target,
  KanbanSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CVDocument {
  id: string;
  filename: string;
  created_at: string;
  storage_path: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [documents, setDocuments] = useState<CVDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push("/login");
        } else {
          setUser(user);
          fetchDocuments(user.id);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function fetchDocuments(userId: string) {
    setDocsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cv_documents")
        .select("id, filename, created_at, storage_path")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
    } finally {
      setDocsLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!user || deletingId) return;
    setDeletingId(docId);
    try {
      const res = await fetch("/api/cv/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId, userId: user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error("Delete failed:", data.error);
      } else {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError("");
    setUploadSuccess(false);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isPDF = file.name.endsWith(".pdf");
    const isDOCX = file.name.endsWith(".docx");
    if (!validTypes.includes(file.type) && !isPDF && !isDOCX) {
      setUploadError("Only PDF or DOCX files are allowed.");
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds the 10MB limit.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", user.id);
      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload and parse CV");
      }
      setUploadSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocuments(user.id);
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 className="animate-spin" size={32} color="#C8FF00" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#FFFEF0", fontFamily: "'Space Grotesk', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em" }}>
            INITIALIZING DASHBOARD...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFEF0", color: "#0A0A0A", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Main Content */}
      <main style={{ padding: "40px", boxSizing: "border-box" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "6px", height: "28px", background: "#C8FF00", border: "2px solid #0A0A0A" }} />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 900, margin: 0, color: "#0A0A0A", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                Dashboard
              </h1>
            </div>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 0 16px", fontWeight: 500 }}>
              Manage your uploaded CV documents and view AI indexing status.
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "#0A0A0A", color: "#FFFEF0", border: "3px solid #0A0A0A",
              padding: "10px 16px", fontSize: "12px", fontWeight: 800,
              cursor: "pointer", letterSpacing: "0.08em", fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "3px 3px 0px #555",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "5px 5px 0px #555"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0px #555"; }}
          >
            <LogOut size={14} />
            SIGN OUT
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0", marginBottom: "40px", border: "3px solid #0A0A0A" }}>
          {[
            { label: "Indexed CVs", value: documents.length, desc: "Ready for AI Search", accent: "#C8FF00", textDark: true },
            { label: "Qdrant Vector DB", value: "Active", desc: "Running in Cloud", accent: "#0047FF", textDark: false },
            { label: "Supabase Storage", value: "Connected", desc: "Secure document vault", accent: "#FF5500", textDark: false },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: stat.accent,
                padding: "24px",
                borderRight: i < 2 ? "3px solid #0A0A0A" : "none",
                boxShadow: "inset 0 0 0 0 transparent",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: "10px", color: stat.textDark ? "#0A0A0A" : "#FFFEF0", fontWeight: 800, letterSpacing: "0.12em", opacity: 0.7 }}>
                {stat.label.toUpperCase()}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 900, color: stat.textDark ? "#0A0A0A" : "#FFFEF0", letterSpacing: "-0.03em" }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: stat.textDark ? "#0A0A0A" : "#FFFEF0", fontWeight: 500, opacity: 0.75 }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Access Cards — shown once a CV is indexed */}
        {documents.length > 0 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "40px" }}
            className="content-grid"
          >
            {[
              {
                href: "/dashboard/jobs",
                accent: "#0047FF",
                icon: <Briefcase size={20} color="#FFFEF0" />,
                label: "Job Hunter",
                desc: "Search jobs, get fit scores",
              },
              {
                href: "/dashboard/assistant",
                accent: "#C8FF00",
                icon: <MessageSquare size={20} color="#0A0A0A" />,
                label: "AI Assistant",
                desc: "Readiness, gaps, roadmaps, letters",
              },
              {
                href: "/dashboard/kanban",
                accent: "#FF5500",
                icon: <KanbanSquare size={20} color="#FFFEF0" />,
                label: "Kanban Tracker",
                desc: "Drag & drop application pipeline",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                style={{
                  background: "transparent",
                  border: "3px solid #0A0A0A",
                  padding: "24px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "4px 4px 0px #0A0A0A",
                  transition: "all 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px #0A0A0A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #0A0A0A"; }}
              >
                <div style={{ width: "44px", height: "44px", background: card.accent, border: "2px solid #0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                    {card.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555", fontWeight: 500 }}>
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Content Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
          className="content-grid"
        >
          {/* Column 1: Upload Box */}
          <div>
            <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "28px", height: "100%", boxSizing: "border-box", boxShadow: "5px 5px 0px #0A0A0A" }}>
              {/* Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "4px", height: "20px", background: "#0A0A0A" }} />
                <h2 style={{ fontSize: "16px", fontWeight: 900, margin: 0, color: "#0A0A0A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Upload &amp; Analyze CV
                </h2>
              </div>
              <p style={{ fontSize: "13px", color: "#555", margin: "0 0 24px", fontWeight: 500 }}>
                Upload your CV in PDF or DOCX format. CareerPilot will automatically parse the text, generate vector embeddings, and store them securely for search.
              </p>

              <form onSubmit={handleUploadSubmit}>
                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `3px dashed ${dragActive ? "#C8FF00" : selectedFile ? "#0047FF" : "#0A0A0A"}`,
                    background: dragActive ? "rgba(200,255,0,0.1)" : selectedFile ? "rgba(0,71,255,0.05)" : "transparent",
                    padding: "40px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div style={{ display: "inline-flex", width: "48px", height: "48px", background: "#C8FF00", border: "2px solid #0A0A0A", alignItems: "center", justifyContent: "center", marginBottom: "14px", boxShadow: "2px 2px 0px #0A0A0A" }}>
                    <UploadCloud size={22} color="#0A0A0A" strokeWidth={2.5} />
                  </div>

                  {selectedFile ? (
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#0A0A0A" }}>
                        {selectedFile.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#555", fontWeight: 500 }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#0A0A0A" }}>
                        Drag &amp; drop your file here, or{" "}
                        <span style={{ textDecoration: "underline", color: "#0047FF" }}>browse</span>
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#777", fontWeight: 500 }}>
                        Supports PDF or DOCX up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback Messages */}
                {uploadError && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700,
                    color: "#FFFEF0", background: "#FF5500", border: "3px solid #0A0A0A",
                    padding: "10px 14px", marginBottom: "20px", letterSpacing: "0.02em",
                    boxShadow: "3px 3px 0px #0A0A0A"
                  }}>
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700,
                    color: "#0A0A0A", background: "#C8FF00", border: "3px solid #0A0A0A",
                    padding: "10px 14px", marginBottom: "20px", letterSpacing: "0.02em",
                    boxShadow: "3px 3px 0px #0A0A0A"
                  }}>
                    <CheckCircle size={15} style={{ flexShrink: 0 }} />
                    CV uploaded and indexed successfully!
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  style={{
                    width: "100%",
                    background: !selectedFile || uploading ? "#EAE9E0" : "#C8FF00",
                    color: !selectedFile || uploading ? "#999" : "#0A0A0A",
                    border: "3px solid #0A0A0A",
                    padding: "14px",
                    fontSize: "13px",
                    fontWeight: 900,
                    cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: selectedFile && !uploading ? "4px 4px 0px #0A0A0A" : "none",
                    transition: "all 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFile && !uploading) { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px #0A0A0A"; }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFile && !uploading) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0px #0A0A0A"; }
                  }}
                >
                  {uploading ? (
                    <><Loader2 className="animate-spin" size={15} />Uploading &amp; parsing CV…</>
                  ) : (
                    <><FileUp size={15} />Start Indexing</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Document History */}
          <div>
            <div style={{ background: "transparent", border: "3px solid #0A0A0A", padding: "28px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", boxShadow: "5px 5px 0px #0A0A0A" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "4px", height: "20px", background: "#0047FF" }} />
                <h2 style={{ fontSize: "16px", fontWeight: 900, margin: 0, color: "#0A0A0A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Indexed Documents
                </h2>
              </div>

              {docsLoading ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <Loader2 className="animate-spin" size={24} color="#0047FF" style={{ margin: "0 auto 12px" }} />
                    <p style={{ color: "#555", fontSize: "13px", fontWeight: 600 }}>Loading document history...</p>
                  </div>
                </div>
              ) : documents.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "3px dashed #0A0A0A", padding: "40px 20px", textAlign: "center" }}>
                  <FileText size={32} color="#0A0A0A" style={{ marginBottom: "12px" }} />
                  <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#0A0A0A" }}>
                    No documents found
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#555", fontWeight: 500 }}>
                    Upload your first CV to start indexing.
                  </p>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", maxHeight: "380px", paddingRight: "4px" }}>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: "transparent",
                        border: "2px solid #0A0A0A",
                        padding: "14px 16px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                        opacity: deletingId === doc.id ? 0.5 : 1,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(0, 71, 255, 0.03)";
                        e.currentTarget.style.transform = "translateX(2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{ width: "36px", height: "36px", background: "#0047FF", border: "2px solid #0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={16} color="#FFFEF0" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={doc.filename}>
                            {doc.filename}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#555", fontSize: "11px", fontWeight: 500 }}>
                              <Calendar size={11} />
                              {new Date(doc.created_at).toLocaleDateString()}
                            </span>
                            <span style={{ background: "#C8FF00", color: "#0A0A0A", border: "1px solid #0A0A0A", padding: "1px 7px", fontSize: "9px", fontWeight: 900, letterSpacing: "0.1em" }}>
                              INDEXED
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={!!deletingId}
                        title="Delete document"
                        style={{
                          flexShrink: 0, width: "30px", height: "30px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "transparent", border: "2px solid transparent",
                          cursor: deletingId ? "not-allowed" : "pointer", color: "#0A0A0A",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!deletingId) {
                            e.currentTarget.style.background = "#FF5500";
                            e.currentTarget.style.borderColor = "#0A0A0A";
                            e.currentTarget.style.color = "#FFFEF0";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.color = "#0A0A0A";
                        }}
                      >
                        {deletingId === doc.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          aside.sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}