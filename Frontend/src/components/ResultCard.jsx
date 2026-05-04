"use client";

import useResumeStore from "@/store/resumeStore";

export default function ResultCard() {
  const { resumeData } = useResumeStore();

  if (!resumeData) return null;

  const {
    skills = [],
    primaryRole = "",
    secondaryRoles = [],
    summary = "",
    matchedJobs = [],
  } = resumeData;

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
    if (score >= 60) return { bg: "#fefce8", text: "#92400e", border: "#fde68a" };
    return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" };
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Resume Analysis ── */}
      <p style={{
        fontSize: "11px", fontWeight: "700", color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px",
      }}>
        Resume Analysis
      </p>

      {/* Role grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
        {[
          { label: "Primary Role", value: primaryRole || "N/A" },
          { label: "Secondary Roles", value: secondaryRoles.length > 0 ? secondaryRoles.join(", ") : "N/A" },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: "#f8f7f4", borderRadius: "12px",
            padding: "16px", border: "1px solid #ebebeb",
          }}>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f0f0f", margin: 0, lineHeight: "1.4" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        background: "#f8f7f4", borderRadius: "12px",
        padding: "16px", border: "1px solid #ebebeb", marginBottom: "16px",
      }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Professional Summary</p>
        <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.6" }}>{summary || "N/A"}</p>
      </div>

      {/* Skills */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Skills</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {skills.map((skill, i) => (
            <span key={i} style={{
              background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe",
              borderRadius: "99px", padding: "4px 12px",
              fontSize: "12px", fontWeight: "600",
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#ebebeb", margin: "0 0 24px" }} />

      {/* ── Matched Jobs ── */}
      <p style={{
        fontSize: "11px", fontWeight: "700", color: "#9ca3af",
        textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px",
      }}>
        Matched Jobs ({matchedJobs.length})
      </p>

      {matchedJobs.length === 0 ? (
        <div style={{
          background: "#f8f7f4", borderRadius: "14px",
          padding: "32px", textAlign: "center", border: "1px solid #ebebeb",
        }}>
          <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>No matched jobs found yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {matchedJobs.map((job, index) => {
            const sc = getScoreColor(job.matchScore || 0);
            return (
              <div
                key={index}
                style={{
                  border: "1px solid #ebebeb", borderRadius: "16px",
                  padding: "20px", background: "#fff",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                {/* Job Header */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: "12px", marginBottom: "16px",
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0f0f0f", margin: "0 0 4px" }}>
                      {job.title}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                      {job.employer} · {job.location}
                      {job.employmentType && ` · ${job.employmentType}`}
                    </p>
                  </div>
                  <div style={{
                    background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                    borderRadius: "10px", padding: "6px 14px",
                    fontSize: "13px", fontWeight: "800", flexShrink: 0,
                  }}>
                    {job.matchScore}% match
                  </div>
                </div>

                {/* Matched + Missing Skills */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Matched Skills
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(job.matchedSkills || []).map((s, i) => (
                        <span key={i} style={{
                          background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
                          borderRadius: "99px", padding: "2px 10px", fontSize: "11px", fontWeight: "600",
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Missing Skills
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(job.missingSkills || []).map((s, i) => (
                        <span key={i} style={{
                          background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca",
                          borderRadius: "99px", padding: "2px 10px", fontSize: "11px", fontWeight: "600",
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {(job.recommendation) && (
                  <div style={{
                    background: "#f8f7f4", borderRadius: "10px",
                    padding: "12px 14px", border: "1px solid #ebebeb", marginBottom: "14px",
                  }}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      AI Recommendation
                    </p>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.6" }}>
                      {job.recommendation}
                    </p>
                  </div>
                )}

                {/* Apply */}
                {job.applyLink && (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "#0f0f0f", color: "#fff",
                      borderRadius: "10px", padding: "9px 18px",
                      fontSize: "12px", fontWeight: "700",
                      textDecoration: "none", letterSpacing: "0.01em",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    Apply Now
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
