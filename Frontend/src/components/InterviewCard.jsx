"use client";

import { useState } from "react";
import useInterviewStore from "@/store/interviewStore";
import API from "@/services/api";

export default function InterviewCard() {
  const { questions, setEvaluation } = useInterviewStore();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  if (!questions) return null;

  const handleChange = (q, value) => {
    setAnswers((prev) => ({ ...prev, [q]: value }));
  };

  const handleSubmit = async () => {
    const allQuestions = [
      ...(questions.technicalQuestions || []),
      ...(questions.projectQuestions || []),
      ...(questions.hrQuestions || []),
      ...(questions.weakAreaQuestions || []),
      ...(questions.roleSpecificQuestions || []),
    ];

    const unanswered = allQuestions.filter(
      (q) => !answers[q] || answers[q].trim() === ""
    );

    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/interview/evaluate-full", { answers });
      setEvaluation(res.data.data);
    } catch (error) {
      console.log("Error:", error.response?.data);
      alert("Evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sectionColors = {
    "Technical Questions":    { dot: "#6366f1", bg: "#eff6ff", label: "#1e40af" },
    "Project Questions":      { dot: "#0ea5e9", bg: "#f0f9ff", label: "#0369a1" },
    "HR Questions":           { dot: "#22c55e", bg: "#f0fdf4", label: "#15803d" },
    "Weak Area Questions":    { dot: "#f59e0b", bg: "#fefce8", label: "#92400e" },
    "Role-Specific Questions":{ dot: "#f43f5e", bg: "#fef2f2", label: "#991b1b" },
  };

  const renderSection = (title, list) => {
    if (!list || list.length === 0) return null;
    const c = sectionColors[title] || { dot: "#6b7280", bg: "#f8f7f4", label: "#374151" };

    return (
      <div key={title} style={{ marginBottom: "24px" }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
          <p style={{
            fontSize: "11px", fontWeight: "700", color: "#9ca3af",
            textTransform: "uppercase", letterSpacing: "0.08em", margin: 0,
          }}>
            {title}
          </p>
          <span style={{
            fontSize: "10px", fontWeight: "700",
            background: c.bg, color: c.label,
            padding: "2px 8px", borderRadius: "99px",
            border: `1px solid ${c.dot}22`,
          }}>
            {list.length} questions
          </span>
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((q, index) => {
            const isAnswered = answers[q] && answers[q].trim() !== "";
            const isFocused = focused === `${title}-${index}`;

            return (
              <div
                key={index}
                style={{
                  background: "#fff",
                  border: `1px solid ${isFocused ? "#0f0f0f" : isAnswered ? "#bbf7d0" : "#ebebeb"}`,
                  borderRadius: "14px",
                  padding: "18px",
                  transition: "border-color 0.2s ease",
                }}
              >
                {/* Question */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "800",
                    background: c.bg, color: c.label,
                    width: "22px", height: "22px", borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                  }}>
                    {index + 1}
                  </span>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#0f0f0f", margin: 0, lineHeight: "1.6" }}>
                    {q}
                  </p>
                </div>

                {/* Answer textarea */}
                <div style={{ position: "relative" }}>
                  <textarea
                    placeholder="Write your answer here..."
                    rows={3}
                    value={answers[q] || ""}
                    onChange={(e) => handleChange(q, e.target.value)}
                    onFocus={() => setFocused(`${title}-${index}`)}
                    onBlur={() => setFocused(null)}
                    style={{
                      width: "100%",
                      background: "#f8f7f4",
                      border: `1px solid ${isFocused ? "#0f0f0f" : "#ebebeb"}`,
                      borderRadius: "10px",
                      padding: "12px 14px",
                      fontSize: "13px",
                      color: "#374151",
                      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                      outline: "none",
                      resize: "vertical",
                      lineHeight: "1.6",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s ease",
                    }}
                  />
                  {isAnswered && (
                    <div style={{
                      position: "absolute", top: "10px", right: "10px",
                      width: "18px", height: "18px", borderRadius: "50%",
                      background: "#22c55e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const allQuestions = [
    ...(questions.technicalQuestions || []),
    ...(questions.projectQuestions || []),
    ...(questions.hrQuestions || []),
    ...(questions.weakAreaQuestions || []),
    ...(questions.roleSpecificQuestions || []),
  ];
  const answeredCount = allQuestions.filter((q) => answers[q] && answers[q].trim() !== "").length;
  const total = allQuestions.length;
  const pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div style={{
      background: "#fff", borderRadius: "20px",
      border: "1px solid #ebebeb", padding: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#0f0f0f" strokeWidth="1.8"/>
              <path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>Interview Questions</p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{answeredCount}/{total} answered</p>
          </div>
        </div>

        {/* Progress pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: pct === 100 ? "#f0fdf4" : "#f8f7f4",
          border: `1px solid ${pct === 100 ? "#bbf7d0" : "#ebebeb"}`,
          borderRadius: "99px", padding: "6px 14px",
        }}>
          <div style={{
            width: "32px", height: "4px", borderRadius: "99px",
            background: "#e5e7eb", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: pct === 100 ? "#22c55e" : "#0f0f0f",
              borderRadius: "99px", transition: "width 0.3s ease",
            }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: pct === 100 ? "#15803d" : "#374151" }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#ebebeb", margin: "20px 0" }} />

      {/* Sections */}
      {renderSection("Technical Questions", questions.technicalQuestions)}
      {renderSection("Project Questions", questions.projectQuestions)}
      {renderSection("HR Questions", questions.hrQuestions)}
      {renderSection("Weak Area Questions", questions.weakAreaQuestions)}
      {renderSection("Role-Specific Questions", questions.roleSpecificQuestions)}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#d1d5db" : "#0f0f0f",
          color: "#fff", border: "none", borderRadius: "12px",
          padding: "14px", fontSize: "13px", fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "opacity 0.2s", marginTop: "8px",
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
            </svg>
            Evaluating answers...
          </>
        ) : "Submit Answers & Get Feedback →"}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}