import { useState, useRef, useEffect } from "react";
import {
  Zap,
  Send,
  Plus,
  FileText,
  Search,
  Target,
  ChevronRight,
  Sparkles,
  Copy,
  ThumbsUp,
  RotateCcw,
} from "lucide-react";

interface Message {
  role: "ai" | "user";
  text: string;
  timestamp: string;
}

const initialConversation: Message[] = [
  {
    role: "ai",
    text: "Hello Alex! I'm your CareerPilot AI agent. I've analyzed your profile, resume, and target roles. I'm ready to help you:\n\n• Draft personalized cover letters\n• Prep for upcoming interviews\n• Identify skill gaps and learning paths\n• Optimize your application strategy\n\nWhat would you like to work on today?",
    timestamp: "9:01 AM",
  },
  {
    role: "user",
    text: "Can you help me prep for my Apple interview tomorrow?",
    timestamp: "9:03 AM",
  },
  {
    role: "ai",
    text: "Absolutely! I've pulled Apple's HIG team interview patterns and your profile. Here's what I see:\n\n**Likely focus areas:**\n1. Design systems & component philosophy\n2. Human Interface Guidelines expertise\n3. Cross-functional collaboration with engineers\n4. Your work on [Project X] aligns strongly here\n\n**Recommended prep:**\n→ Review Apple's recent HIG updates (I've summarized the key changes)\n→ Prepare 3 case studies demonstrating systems thinking\n→ Practice articulating tradeoffs between user delight and engineering feasibility\n\nWant me to run a mock interview session now?",
    timestamp: "9:03 AM",
  },
  {
    role: "user",
    text: "Yes! Let's do the mock interview",
    timestamp: "9:05 AM",
  },
  {
    role: "ai",
    text: "Perfect. I'll play the role of Apple's lead interviewer. Let's begin.\n\n**Q1:** \"Tell me about a time you had to advocate for a simpler design solution when there was pressure to add more features. How did you handle stakeholder alignment?\"",
    timestamp: "9:05 AM",
  },
];

const quickPrompts = [
  { icon: FileText, label: "Draft cover letter", color: "#0047FF" },
  { icon: Search, label: "Find matching jobs", color: "#C8FF00" },
  { icon: Target, label: "Prep for interview", color: "#FF5500" },
  { icon: Sparkles, label: "Optimize resume", color: "#00CC88" },
];

const aiResponses = [
  "Great answer! You clearly articulated the tradeoff. For Apple specifically, I'd suggest adding a metric — how did the simpler solution perform post-launch? Numbers resonate with their engineering-heavy culture.\n\n**Q2:** \"Walk me through your design process for a complex multi-platform feature. How do you ensure consistency across iOS, macOS, and watchOS?\"",
  "Excellent point about platform-specific conventions. Let me give you feedback:\n✓ Strong: mentioned platform adaptation\n✓ Good: referenced user research\n⚠️ Improve: could emphasize HIG adherence more explicitly\n\nWant to continue to the next question, or refine this answer?",
  "I've analyzed your response against top Apple interview candidates. You're scoring in the 85th percentile on systems thinking. One area to strengthen: quantifying design impact with engagement metrics or A/B test results.\n\nShall I run you through 2 more questions focused on collaboration and ambiguity handling?",
  "Based on our session, here are your key takeaways:\n\n1. **Lead with impact metrics** — add numbers to 3 of your 5 case studies\n2. **Emphasize HIG mastery** — mention specific guidelines by name\n3. **Show collaboration breadth** — include more examples of eng/PM alignment\n\nI've generated a prep summary doc. Want me to schedule a follow-up 30 min before your interview tomorrow?",
];

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getTime = () =>
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input, timestamp: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        role: "ai",
        text: aiResponses[responseIdx % aiResponses.length],
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setResponseIdx((i) => i + 1);
      setIsTyping(false);
    }, 1200);
  };

  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <div key={i} style={{ fontWeight: 800, marginBottom: "4px", color: "#C8FF00" }}>
            {line.replace(/\*\*/g, "")}
          </div>
        );
      }
      if (line.startsWith("→") || line.startsWith("•") || /^\d+\./.test(line) || line.startsWith("✓") || line.startsWith("⚠️")) {
        return (
          <div key={i} style={{ paddingLeft: "4px", marginBottom: "3px" }}>
            {line}
          </div>
        );
      }
      if (line === "") return <div key={i} style={{ height: "8px" }} />;
      return <div key={i}>{line}</div>;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Space Grotesk', sans-serif",
        background: "#FFFEF0",
      }}
    >
      {/* Left: Sidebar with context */}
      <div
        style={{
          width: "280px",
          borderRight: "3px solid #0A0A0A",
          background: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "3px solid #C8FF00",
            background: "#C8FF00",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Zap size={20} color="#0A0A0A" strokeWidth={3} />
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#0A0A0A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                AI ASSISTANT
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#333", letterSpacing: "0.06em" }}>
                CAREERPILOT AGENT v2.4
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#0A0A0A",
              padding: "6px 10px",
              fontSize: "11px",
              fontWeight: 700,
              color: "#C8FF00",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                background: "#C8FF00",
                borderRadius: "50%",
                boxShadow: "0 0 4px #C8FF00",
              }}
            />
            AGENT ACTIVE · CONTEXT LOADED
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#444",
              letterSpacing: "0.12em",
              marginBottom: "10px",
            }}
          >
            QUICK ACTIONS
          </div>
          {quickPrompts.map((p, i) => {
            const Icon = p.icon;
            return (
              <button
                key={i}
                onClick={() => setInput(p.label)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "transparent",
                  border: "2px solid #222",
                  marginBottom: "6px",
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: "all 0.08s ease",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "#111";
                  btn.style.borderColor = p.color;
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "transparent";
                  btn.style.borderColor = "#222";
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: p.color,
                    border: `2px solid ${p.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={13} color={p.color === "#C8FF00" ? "#0A0A0A" : "#FFFEF0"} strokeWidth={3} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#AAAAAA" }}>
                  {p.label}
                </span>
                <ChevronRight size={12} color="#555" style={{ marginLeft: "auto" }} />
              </button>
            );
          })}
        </div>

        <div style={{ margin: "0 16px", borderTop: "1px solid #222" }} />

        {/* Context loaded */}
        <div style={{ padding: "16px", flex: 1 }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#444",
              letterSpacing: "0.12em",
              marginBottom: "10px",
            }}
          >
            CONTEXT LOADED
          </div>
          {[
            { label: "Resume (v4)", size: "Updated Jun 7" },
            { label: "21 Active Apps", size: "Synced now" },
            { label: "Apple JD Analysis", size: "3 pages" },
            { label: "Interview History", size: "12 sessions" },
            { label: "Skills Profile", size: "34 skills" },
          ].map((ctx, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                background: "#111",
                border: "1px solid #1E1E1E",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#777" }}>
                {ctx.label}
              </span>
              <span style={{ fontSize: "10px", fontWeight: 500, color: "#444" }}>
                {ctx.size}
              </span>
            </div>
          ))}
        </div>

        {/* New chat */}
        <div style={{ padding: "16px", borderTop: "3px solid #222" }}>
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              background: "transparent",
              border: "2px solid #333",
              color: "#777",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "all 0.08s ease",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = "#C8FF00";
              btn.style.color = "#C8FF00";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = "#333";
              btn.style.color = "#777";
            }}
          >
            <Plus size={14} strokeWidth={3} />
            NEW SESSION
          </button>
        </div>
      </div>

      {/* Right: Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFEF0" }}>
        {/* Chat header */}
        <div
          style={{
            padding: "16px 32px",
            borderBottom: "3px solid #0A0A0A",
            background: "#FFFEF0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "#0A0A0A",
                letterSpacing: "-0.02em",
              }}
            >
              Apple HIG Interview Prep
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#888" }}>
              Session started at 9:01 AM · {messages.length} messages
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["SAVE SESSION", "EXPORT"].map((label) => (
              <button
                key={label}
                style={{
                  padding: "8px 16px",
                  background: "#FFFEF0",
                  border: "2px solid #0A0A0A",
                  boxShadow: "3px 3px 0px #0A0A0A",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  color: "#0A0A0A",
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: "all 0.08s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px #0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px, 2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0px #0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translate(0, 0)";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "ai" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "#C8FF00",
                      border: "2px solid #0A0A0A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={12} color="#0A0A0A" strokeWidth={3} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#888",
                      letterSpacing: "0.06em",
                    }}
                  >
                    PILOT AI
                  </span>
                  <span style={{ fontSize: "10px", color: "#CCC" }}>{msg.timestamp}</span>
                </div>
              )}

              <div
                style={{
                  padding: "16px 20px",
                  border:
                    msg.role === "ai"
                      ? "3px solid #0A0A0A"
                      : "3px solid #0047FF",
                  background: msg.role === "ai" ? "#FFFEF0" : "#0047FF",
                  boxShadow:
                    msg.role === "ai"
                      ? "4px 4px 0px #0A0A0A"
                      : "4px 4px 0px #0A0A0A",
                }}
              >
                <div
                  style={{
                    color: msg.role === "ai" ? "#0A0A0A" : "#FFFEF0",
                    fontSize: "14px",
                    fontWeight: msg.role === "ai" ? 400 : 600,
                    lineHeight: 1.7,
                    fontFamily: "'Space Grotesk', sans-serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.role === "ai" ? formatText(msg.text) : msg.text}
                </div>
              </div>

              {msg.role === "ai" && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  {[
                    { icon: ThumbsUp, label: "Good" },
                    { icon: Copy, label: "Copy" },
                    { icon: RotateCcw, label: "Retry" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        background: "transparent",
                        border: "1px solid #DDD",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#888",
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                        transition: "all 0.08s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#0A0A0A";
                        (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#DDD";
                        (e.currentTarget as HTMLButtonElement).style.color = "#888";
                      }}
                    >
                      <Icon size={10} strokeWidth={2} />
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {msg.role === "user" && (
                <div
                  style={{ fontSize: "10px", color: "#CCC", marginTop: "6px", textAlign: "right" }}
                >
                  {msg.timestamp}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                alignSelf: "flex-start",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#C8FF00",
                  border: "2px solid #0A0A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={12} color="#0A0A0A" strokeWidth={3} />
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  border: "3px solid #0A0A0A",
                  background: "#FFFEF0",
                  boxShadow: "4px 4px 0px #0A0A0A",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "#0A0A0A",
                      borderRadius: "50%",
                      animation: `bounce 1.2s ${j * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "20px 32px",
            borderTop: "3px solid #0A0A0A",
            background: "#FFFEF0",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "3px solid #0A0A0A",
              boxShadow: "4px 4px 0px #0A0A0A",
              background: "#FFFEF0",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message or use a quick action... (Enter to send, Shift+Enter for newline)"
              rows={2}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "16px 20px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#0A0A0A",
                fontFamily: "'Space Grotesk', sans-serif",
                resize: "none",
                lineHeight: 1.6,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                borderLeft: "3px solid #0A0A0A",
              }}
            >
              <button
                onClick={handleSend}
                style={{
                  flex: 1,
                  background: "#C8FF00",
                  border: "none",
                  padding: "0 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  color: "#0A0A0A",
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: "all 0.08s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#0A0A0A";
                  (e.currentTarget as HTMLButtonElement).style.color = "#C8FF00";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#C8FF00";
                  (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
                }}
              >
                <Send size={16} strokeWidth={3} />
                SEND
              </button>
            </div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "11px", fontWeight: 500, color: "#AAA" }}>
            CareerPilot AI has context of your resume, applications, and goals · Session saved automatically
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
