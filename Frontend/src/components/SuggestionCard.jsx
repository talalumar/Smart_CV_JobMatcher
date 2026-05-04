"use client";

import useResumeStore from "@/store/resumeStore";

const BulletIcon = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "4px" }}>
    <circle cx="8" cy="8" r="5" fill={color} opacity="0.15" />
    <circle cx="8" cy="8" r="2.5" fill={color} />
  </svg>
);

const Section = ({ title, items, color, emptyMsg }) => (
  <div style={{
    background: "#f8f7f4",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #ebebeb",
    flex: 1,
    minWidth: "180px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      <p style={{
        fontSize: "11px", fontWeight: "700", color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.08em", margin: 0,
      }}>
        {title}
      </p>
    </div>

    {items.length === 0 ? (
      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{emptyMsg}</p>
    ) : (
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <BulletIcon color={color} />
            <span style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6" }}>{item}</span>
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
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Section label */}
      <p style={{
        fontSize: "11px", fontWeight: "700", color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px",
      }}>
        AI Career Suggestions
      </p>

      {/* 3 columns */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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