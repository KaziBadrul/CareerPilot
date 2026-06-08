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

  // Auth state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Documents state
  const [documents, setDocuments] = useState<CVDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
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
        // Optimistically remove from UI, then refresh
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Drag and drop handlers
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
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
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
      // 10MB limit
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

      // Refresh documents list
      fetchDocuments(user.id);
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--cream)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2
            className="animate-spin"
            size={32}
            color="var(--blue-light)"
            style={{ margin: "0 auto 16px" }}
          />
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Initializing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        display: "flex",
        color: "var(--cream)",
        fontFamily: "var(--font-body)",
        position: "relative",
      }}
    >
      

      
      {/* Main Area */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {/* Background Radial Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                margin: "0 0 8px",
                color: "var(--white)",
              }}
            >
              Dashboard
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "15px", margin: 0 }}>
              Manage your uploaded CV documents and view AI indexing status.
            </p>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {[
              {
                label: "Indexed CVs",
                value: documents.length,
                desc: "Ready for AI Search",
              },
              {
                label: "Qdrant Vector Database",
                value: "Active",
                desc: "Running in Cloud",
              },
              {
                label: "Supabase Storage",
                value: "Connected",
                desc: "Secure document vault",
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "12px",
                    color: "var(--muted)",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {stat.label.toUpperCase()}
                </p>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "var(--white)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}
                >
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Access to Pillars — shown once a CV is indexed */}
          {documents.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "40px",
              }}
              className="content-grid"
            >
              <Link
                href="/dashboard/jobs"
                style={{
                  background: "rgba(37,99,235,0.06)",
                  border: "1px solid rgba(37,99,235,0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(37,99,235,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(37,99,235,0.06)")
                }
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(37,99,235,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={20} color="var(--blue-light)" />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--white)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Job Hunter
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "var(--muted)",
                    }}
                  >
                    Search jobs, get fit scores
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/assistant"
                style={{
                  background: "rgba(124,58,237,0.06)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(124,58,237,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(124,58,237,0.06)")
                }
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(124,58,237,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={20} color="#a78bfa" />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--white)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    AI Assistant
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "var(--muted)",
                    }}
                  >
                    Readiness, gaps, roadmaps, letters
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/kanban"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "16px",
                  padding: "24px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(16,185,129,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(16,185,129,0.06)")
                }
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: "rgba(16,185,129,0.15)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <KanbanSquare size={20} color="#34d399" />
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--white)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Kanban Tracker
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12.5px",
                      color: "var(--muted)",
                    }}
                  >
                    Drag & drop application pipeline
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
            }}
            className="content-grid"
          >
            {/* Column 1: Upload Box */}
            <div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: "0 0 16px",
                    color: "var(--white)",
                  }}
                >
                  Upload & Analyze CV
                </h2>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--muted)",
                    margin: "0 0 24px",
                  }}
                >
                  Upload your CV in PDF or DOCX format. CareerPilot will
                  automatically parse the text, generate vector embeddings, and
                  store them securely for search.
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
                      border: `2px dashed ${dragActive ? "var(--blue-light)" : selectedFile ? "rgba(37,99,235,0.4)" : "var(--border-2)"}`,
                      borderRadius: "12px",
                      background: dragActive
                        ? "rgba(37,99,235,0.05)"
                        : "var(--surface)",
                      padding: "40px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginBottom: "20px",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedFile)
                        e.currentTarget.style.borderColor = "var(--border-2)";
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedFile && !dragActive)
                        e.currentTarget.style.borderColor = "var(--border-2)";
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    <div
                      style={{
                        display: "inline-flex",
                        width: "48px",
                        height: "48px",
                        background: "var(--field)",
                        borderRadius: "12px",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "14px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <UploadCloud size={20} color="var(--blue-light)" />
                    </div>

                    {selectedFile ? (
                      <div>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "var(--cream)",
                          }}
                        >
                          {selectedFile.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "var(--muted)",
                          }}
                        >
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "var(--cream)",
                          }}
                        >
                          Drag & drop your file here, or{" "}
                          <span style={{ color: "var(--blue-light)" }}>
                            browse
                          </span>
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "var(--muted)",
                          }}
                        >
                          Supports PDF or DOCX up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Feedback Messages */}
                  {uploadError && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#f87171",
                        background: "rgba(248,113,113,0.06)",
                        border: "1px solid rgba(248,113,113,0.15)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "20px",
                      }}
                    >
                      <AlertCircle size={15} style={{ flexShrink: 0 }} />
                      {uploadError}
                    </div>
                  )}

                  {uploadSuccess && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#34d399",
                        background: "rgba(52,211,153,0.06)",
                        border: "1px solid rgba(52,211,153,0.15)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "20px",
                      }}
                    >
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
                      background: uploading
                        ? "rgba(37,99,235,0.6)"
                        : selectedFile
                          ? "var(--blue)"
                          : "var(--field)",
                      color: selectedFile ? "#fff" : "var(--muted)",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor:
                        !selectedFile || uploading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFile && !uploading)
                        e.currentTarget.style.background = "var(--blue-glow)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFile && !uploading)
                        e.currentTarget.style.background = "var(--blue)";
                    }}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="animate-spin" size={15} />
                        Uploading & parsing CV…
                      </>
                    ) : (
                      <>
                        <FileUp size={15} />
                        Start Indexing
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Document History */}
            <div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "28px",
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: "0 0 16px",
                    color: "var(--white)",
                  }}
                >
                  Indexed Documents
                </h2>

                {docsLoading ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Loader2
                        className="animate-spin"
                        size={24}
                        color="var(--blue-light)"
                        style={{ margin: "0 auto 12px" }}
                      />
                      <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                        Loading document history...
                      </p>
                    </div>
                  </div>
                ) : documents.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed var(--border-2)",
                      borderRadius: "12px",
                      padding: "40px 20px",
                      textAlign: "center",
                    }}
                  >
                    <FileText
                      size={32}
                      color="var(--muted)"
                      style={{ marginBottom: "12px" }}
                    />
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "14.5px",
                        fontWeight: 500,
                        color: "var(--cream)",
                      }}
                    >
                      No documents found
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12.5px",
                        color: "var(--muted)",
                      }}
                    >
                      Upload your first CV to start indexing.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      overflowY: "auto",
                      maxHeight: "380px",
                      paddingRight: "4px",
                    }}
                  >
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          padding: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          transition: "border-color 0.2s",
                          opacity: deletingId === doc.id ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--border-2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "var(--border)")
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              background: "rgba(37,99,235,0.08)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FileText size={16} color="var(--blue-light)" />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                margin: "0 0 3px",
                                fontSize: "13.5px",
                                fontWeight: 500,
                                color: "var(--cream)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={doc.filename}
                            >
                              {doc.filename}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                color: "var(--muted)",
                                fontSize: "11px",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                <Calendar size={11} />
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                              <span
                                style={{
                                  background: "rgba(52,211,153,0.08)",
                                  color: "#34d399",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                }}
                              >
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
                            flexShrink: 0,
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "transparent",
                            border: "1px solid transparent",
                            borderRadius: "7px",
                            cursor: deletingId ? "not-allowed" : "pointer",
                            color: "var(--muted)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!deletingId) {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.1)";
                              e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.25)";
                              e.currentTarget.style.color = "#f87171";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "transparent";
                            e.currentTarget.style.color = "var(--muted)";
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
