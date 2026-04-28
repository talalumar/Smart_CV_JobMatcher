"use client";

import { useState } from "react";
import useResumeStore from "@/store/resumeStore";

export default function SuggestionCard() {
  const { resumeData } = useResumeStore();
  const [done, setDone] = useState([]);
  const [hovered, setHovered] = useState(null);

  if (!resumeData) {
    return (
      <div style={{
        background: "#0f0f0f",
        borderRadius: "20px",
        padding: "32px",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        border: "1px solid #1f1f1f",
        textAlign: "center",
        color: "#444",
      }}>
        <p style={{ fontSize: "14px", margin: 0 }}>Upload a resume to see suggestions</p>
      </div>
    );
  }

  const suggestions = [
    ...(resumeData.atsSuggestions || []).map((s, i) => ({
      id: `suggestion-${i}`,
      category: "Suggestion",
      priority: "Medium",
      title: s,
      dot: "#f59e0b",
    })),
    ...(resumeData.atsIssues || []).map((s, i) => ({
      id: `issue-${i}`,
      category: "Issue",
      priority: "High",
      title: s,
      dot: "#ef4444",
    })),
    ...(resumeData.atsStrengths || []).map((s, i) => ({
      id: `strength-${i}`,
      category: "Strength",
      priority: "Low",
      title: s,
      dot: "#22c55e",
    })),
  ];

  const priorityConfig = {
    High:   { bg: "#fee2e2", text: "#991b1b" },
    Medium: { bg: "#fef3c7", text: "#92400e" },
    Low:    { bg: "#dcfce7", text: "#166534" },
  };

  const toggle = (id) =>
    setDone((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );

  const completed = done.length;
  const total = suggestions.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={{
      background: "#0f0f0f",
      borderRadius: "20px",
      padding: "32px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f5f5f5",
      border: "1px solid #1f1f1f",
    }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#555", textTransform: "uppercase", margin: "0 0 6px" }}>
            AI Analysis
          </p>
          <h2 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: "#f5f5f5" }}>
            Resume Suggestions
          </h2>
          <p style={{ fontSize: "12px", color: "#555", margin: "6px 0 0" }}>
            {resumeData.primaryRole} · {resumeData.experienceLevel}
          </p>
        </div>

        {/* Progress ring */}
        <div style={{ textAlign: "center" }}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="#1f1f1f" strokeWidth="4" />
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke={pct === 100 ? "#22c55e" : "#6366f1"}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text x="28" y="33" textAnchor="middle" fill="#f5f5f5" fontSize="13" fontWeight="700"
              fontFamily="'DM Sans', sans-serif">
              {pct}%
            </text>
          </svg>
          <p style={{ fontSize: "10px", color: "#555", margin: "4px 0 0", letterSpacing: "0.05em" }}>
            {completed}/{total} done
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#1a1a1a", borderRadius: "99px", height: "4px", marginBottom: "28px", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #6366f1, #8b5cf6)",
          borderRadius: "99px",
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Suggestion list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {suggestions.map((s) => {
          const isDone = done.includes(s.id);
          const isHovered = hovered === s.id;
          const pc = priorityConfig[s.priority];

          return (
            <div
              key={s.id}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => toggle(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 18px",
                borderRadius: "14px",
                background: isDone ? "#0a0a0a" : isHovered ? "#161616" : "#111",
                border: `1px solid ${isDone ? "#1a1a1a" : isHovered ? "#2a2a2a" : "#1a1a1a"}`,
                transition: "all 0.2s ease",
                cursor: "pointer",
                opacity: isDone ? 0.5 : 1,
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "6px",
                border: `1.5px solid ${isDone ? "#22c55e" : "#333"}`,
                background: isDone ? "#22c55e" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}>
                {isDone && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: isDone ? "#444" : "#e5e5e5",
                    textDecoration: isDone ? "line-through" : "none",
                    transition: "color 0.2s",
                  }}>
                    {s.title}
                  </span>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    background: pc.bg,
                    color: pc.text,
                    letterSpacing: "0.04em",
                  }}>
                    {s.priority}
                  </span>
                </div>
              </div>

              {/* Category tag */}
              <span style={{
                fontSize: "10px",
                color: "#444",
                background: "#1a1a1a",
                padding: "3px 9px",
                borderRadius: "99px",
                border: "1px solid #242424",
                flexShrink: 0,
                letterSpacing: "0.04em",
              }}>
                {s.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "24px",
        paddingTop: "20px",
        borderTop: "1px solid #1a1a1a",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{ fontSize: "12px", color: "#444", margin: 0 }}>
          Click any item to mark complete
        </p>
        {completed > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setDone([]); }}
            style={{
              fontSize: "11px",
              color: "#555",
              background: "none",
              border: "1px solid #222",
              borderRadius: "8px",
              padding: "5px 12px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}