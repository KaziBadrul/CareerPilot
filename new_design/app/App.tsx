import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { JobHunter } from "./components/JobHunter";
import { AIAssistant } from "./components/AIAssistant";
import { ProgressTracker } from "./components/ProgressTracker";
import { Settings } from "./components/Settings";
import type { Page } from "./types";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

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
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main style={{ flex: 1, overflow: "auto", background: "#FFFEF0" }}>
        {activePage === "dashboard" && (
          <Dashboard setActivePage={setActivePage} />
        )}
        {activePage === "job-hunter" && <JobHunter />}
        {activePage === "ai-assistant" && <AIAssistant />}
        {activePage === "progress-tracker" && <ProgressTracker />}
        {activePage === "settings" && <Settings />}
      </main>
    </div>
  );
}
