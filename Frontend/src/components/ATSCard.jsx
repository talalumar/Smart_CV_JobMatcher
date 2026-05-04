"use client";

import useResumeStore from "@/store/resumeStore";

export default function ATSCard() {
  const { resumeData } = useResumeStore();

  const score = resumeData?.atsScore || 0;
  const strengths = resumeData?.atsStrengths || [];
  const issues = resumeData?.atsIssues || [];
  const suggestions = resumeData?.atsSuggestions || [];

  const getScoreColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getLabelBg = () => {
    if (score >= 80) return { bg: "#f0fdf4", text: "#15803d" };
    if (score >= 60) return { bg: "#fefce8", text: "#92400e" };
    return { bg: "#fef2f2", text: "#991b1b" };
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  const label = getLabelBg();

  if (!resumeData) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 20px", textAlign: "center", gap: "8px",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "4px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#d1d5db" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>No resume uploaded</p>
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Upload your resume to see ATS analysis</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Score Ring */}
      <div style={{
        background: "#f8f7f4", borderRadius: "16px",
        padding: "24px", display: "flex",
        alignItems: "center", gap: "20px", marginBottom: "20px",
      }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke={getScoreColor()} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "22px", fontWeight: "800", color: "#0f0f0f", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "10px", color: "#9ca3af", fontWeight: "500" }}>/100</span>
          </div>
        </div>

        <div>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Overall ATS Score
          </p>
          <p style={{ fontSize: "20px", fontWeight: "800", color: "#0f0f0f", margin: "0 0 8px" }}>
            {getScoreLabel()}
          </p>
          <span style={{
            fontSize: "11px", fontWeight: "600",
            padding: "3px 10px", borderRadius: "99px",
            background: label.bg, color: label.text,
          }}>
            {score >= 80 ? "ATS Ready" : score >= 60 ? "Nearly Ready" : "Needs Work"}
          </span>
        </div>
      </div>

      {/* Sections */}
      {[
        { title: "Strengths", items: strengths, color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
        { title: "Issues", items: issues, color: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
        { title: "Suggestions", items: suggestions, color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
      ].map(({ title, items, color, bg, border, text }) => {
        if (!items.length) return null;
        return (
          <div key={title} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
              <span style={{ fontSize: "12px", fontWeight: "700", color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {title}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {items.map((item, i) => (
                <div key={i} style={{
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: "10px", padding: "10px 14px",
                  fontSize: "13px", color: text, lineHeight: "1.5",
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}