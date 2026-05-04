"use client";

import useInterviewStore from "@/store/interviewStore";

export default function EvaluationCard() {
  const { evaluation } = useInterviewStore();

  if (!evaluation) return null;

  const {
    overallScore = 0,
    feedback = "",
    improvementAreas = [],
    strongAreas = [],
    evaluatedAnswers = [],
  } = evaluation;

  const getScoreColor = (score, max = 100) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
    if (pct >= 60) return { color: "#92400e", bg: "#fefce8", border: "#fde68a" };
    return { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" };
  };

  const overall = getScoreColor(overallScore);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div style={{
      background: "#fff", borderRadius: "20px",
      border: "1px solid #ebebeb", padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>Evaluation Report</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>AI-powered interview feedback</p>
        </div>
      </div>

      <div style={{ height: "1px", background: "#ebebeb", marginBottom: "24px" }} />

      {/* Score Panel */}
      <div style={{
        background: "#f8f7f4", borderRadius: "16px",
        padding: "24px", border: "1px solid #ebebeb",
        display: "flex", alignItems: "center", gap: "24px",
        marginBottom: "24px",
      }}>
        {/* Ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke={overall.color} strokeWidth="8"
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
            <span style={{ fontSize: "22px", fontWeight: "800", color: "#0f0f0f", lineHeight: 1 }}>{overallScore}</span>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>/100</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Overall Score
          </p>
          <p style={{ fontSize: "18px", fontWeight: "800", color: "#0f0f0f", margin: "0 0 10px" }}>
            {overallScore >= 80 ? "Excellent Performance" : overallScore >= 60 ? "Good Performance" : "Needs Improvement"}
          </p>
          <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.6" }}>
            {feedback || "No feedback available"}
          </p>
        </div>
      </div>

      {/* Strong + Improvement Areas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        {/* Strong Areas */}
        <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "16px", border: "1px solid #bbf7d0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Strong Areas
            </p>
          </div>
          {strongAreas.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>None found</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {strongAreas.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#15803d", lineHeight: "1.5" }}>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Improvement Areas */}
        <div style={{ background: "#fef2f2", borderRadius: "12px", padding: "16px", border: "1px solid #fecaca" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }} />
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#991b1b", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
              Improvement Areas
            </p>
          </div>
          {improvementAreas.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>None found</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {improvementAreas.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <path d="M12 9v4M12 17h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: "12px", color: "#991b1b", lineHeight: "1.5" }}>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Question-wise */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "16px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }} />
          <p style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            Question-wise Evaluation
          </p>
        </div>

        {evaluatedAnswers.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>No evaluated answers found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {evaluatedAnswers.map((item, index) => {
              const sc = getScoreColor(item.score || 0, 10);
              return (
                <div key={index} style={{
                  border: "1px solid #ebebeb", borderRadius: "14px",
                  padding: "18px", background: "#fff",
                  transition: "box-shadow 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  {/* Q header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                      <span style={{
                        fontSize: "11px", fontWeight: "800", color: "#6366f1",
                        background: "#eff6ff", width: "22px", height: "22px",
                        borderRadius: "6px", display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                      }}>
                        {index + 1}
                      </span>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f0f0f", margin: 0, lineHeight: "1.6" }}>
                        {item.question}
                      </p>
                    </div>
                    <div style={{
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      borderRadius: "8px", padding: "4px 10px",
                      fontSize: "12px", fontWeight: "800", flexShrink: 0,
                    }}>
                      {item.score || 0}/10
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {/* Your Answer */}
                    <div style={{ background: "#f8f7f4", borderRadius: "10px", padding: "12px 14px", border: "1px solid #ebebeb" }}>
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Answer</p>
                      <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{item.userAnswer || "No answer provided"}</p>
                    </div>

                    {/* Correct Answer */}
                    <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "12px 14px", border: "1px solid #bbf7d0" }}>
                      <p style={{ fontSize: "11px", color: "#15803d", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Correct Answer</p>
                      <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{item.correctAnswer || "No correct answer available"}</p>
                    </div>

                    {/* Feedback */}
                    <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "12px 14px", border: "1px solid #bfdbfe" }}>
                      <p style={{ fontSize: "11px", color: "#1e40af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>AI Feedback</p>
                      <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{item.feedback || "No feedback available"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}