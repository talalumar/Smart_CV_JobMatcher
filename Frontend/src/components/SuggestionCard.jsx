"use client";

import useResumeStore from "@/store/resumeStore";

const BulletIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "3px" }}>
    <circle cx="8" cy="8" r="5" fill={color} opacity="0.15" />
    <circle cx="8" cy="8" r="2.5" fill={color} />
  </svg>
);

const Section = ({ title, items, color, emptyMsg }) => (
  <div style={{
    background: "#f9fafb",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #f0f0f0",
    flex: 1,
  }}>
    <h3 style={{
      fontSize: "16px",
      fontWeight: "700",
      color: "#111",
      marginBottom: "18px",
      margin: "0 0 18px",
    }}>
      {title}
    </h3>

    {items.length === 0 ? (
      <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>{emptyMsg}</p>
    ) : (
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <BulletIcon color={color} />
            <span style={{ fontSize: "14px", color: "#444", lineHeight: "1.6" }}>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default function SuggestionCard() {
  const { resumeData } = useResumeStore();

  if (!resumeData) return null;

  const careerSuggestions = resumeData?.careerSuggestions || [];
  const improvementPlan   = resumeData?.improvementPlan   || [];
  const interviewTips     = resumeData?.interviewTips     || [];

  return (
    <div style={{
      background: "#fff",
      borderRadius: "24px",
      border: "1px solid #f0f0f0",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      padding: "36px",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      marginTop: "32px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "800", color: "#0f0f0f", margin: "0 0 8px" }}>
          AI Career Suggestions
        </h2>
        <p style={{ fontSize: "14px", color: "#888", margin: 0, lineHeight: "1.6" }}>
          Personalized recommendations powered by AI to improve your career growth and job success.
        </p>
      </div>

      {/* 3 columns */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Section
          title="Career Suggestions"
          items={careerSuggestions}
          color="#6366f1"
          emptyMsg="No career suggestions available."
        />
        <Section
          title="Improvement Plan"
          items={improvementPlan}
          color="#0ea5e9"
          emptyMsg="No improvement plan available."
        />
        <Section
          title="Interview Tips"
          items={interviewTips}
          color="#f43f5e"
          emptyMsg="No interview tips available."
        />
      </div>
    </div>
  );
}