"use client";

import Link from "next/link";
import ResumeUploader from "@/components/ResumeUploader";
import ATSCard from "@/components/ATSCard";
import ResultCard from "@/components/ResultCard";
import SuggestionCard from "@/components/SuggestionCard";
import useResumeStore from "@/store/resumeStore";

export default function DashboardPage() {
  const { resumeData } = useResumeStore();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f7f4",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Top Nav */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #ebebeb",
        padding: "0 40px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#0f0f0f",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h7l3 3v9H3V2z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M10 2v3h3" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M5 7h6M5 9.5h4" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#0f0f0f", letterSpacing: "-0.01em" }}>
            SmartCV
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {resumeData && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "99px", padding: "4px 12px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "12px", color: "#15803d", fontWeight: "600" }}>
                Resume analyzed · ATS {resumeData.atsScore}/100
              </span>
            </div>
          )}
          <Link href="/interview">
            <button style={{
              background: "#0f0f0f", color: "#fff",
              border: "none", borderRadius: "10px",
              padding: "9px 20px", fontSize: "13px",
              fontWeight: "600", cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              AI Interview →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={{
        background: "#0f0f0f",
        padding: "56px 40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "99px", padding: "4px 14px", marginBottom: "20px",
          }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              AI-Powered Career Platform
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: "800",
            color: "#fff",
            margin: "0 0 14px",
            letterSpacing: "-0.03em",
            lineHeight: "1.15",
          }}>
            Land your dream job<br />
            <span style={{ color: "#a3a3a3" }}>with AI on your side.</span>
          </h1>

          <p style={{ fontSize: "15px", color: "#6b6b6b", margin: 0, maxWidth: "480px", lineHeight: "1.6" }}>
            Upload your resume and get instant ATS analysis, job matching, personalized improvement suggestions, and AI interview coaching.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "32px", marginTop: "36px", flexWrap: "wrap" }}>
            {[
              { label: "ATS Scoring", value: "Instant" },
              { label: "Job Matches", value: "Real-time" },
              { label: "Interview Prep", value: "AI-powered" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Upload + ATS Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Upload Card */}
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ebebeb",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>Upload Resume</h2>
                <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>PDF or DOCX, analyzed instantly</p>
              </div>
            </div>
            <ResumeUploader />
          </div>

          {/* ATS Card */}
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #ebebeb",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="1.8"/>
                  <path d="M8 12l3 3 5-5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>ATS Score</h2>
                <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Applicant tracking analysis</p>
              </div>
            </div>
            <ATSCard />
          </div>
        </div>

        {/* Suggestions — full width */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #ebebeb",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "#fefce8", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="#ca8a04" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>AI Suggestions</h2>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Personalized improvement plan</p>
            </div>
          </div>
          <SuggestionCard />
        </div>

        {/* Matched Jobs — full width */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid #ebebeb",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="#3b82f6" strokeWidth="1.8"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#3b82f6" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M12 12v4M10 14h4" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>Matched Jobs</h2>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Roles that fit your profile</p>
            </div>
          </div>
          <ResultCard />
        </div>

      </div>
    </div>
  );
}