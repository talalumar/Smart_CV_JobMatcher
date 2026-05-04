"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import useResumeStore from "@/store/resumeStore";

export default function VoiceAssistant() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const vapiRef = useRef(null);
  const { resumeData } = useResumeStore();

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setStatus("active"));
    vapi.on("call-end", () => { setStatus("idle"); setTranscript(""); });
    vapi.on("speech-start", () => setStatus("speaking"));
    vapi.on("speech-end", () => setStatus("active"));
    vapi.on("message", (msg) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscript(msg.transcript);
      }
    });
    vapi.on("error", (e) => { console.error(e); setStatus("idle"); });
    return () => vapi.stop();
  }, []);

  const buildAssistantConfig = () => {
    if (!resumeData) {
      return {
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
        assistantOverrides: {
          firstMessage: "Hi! I'm your Smart CV Assistant. Please upload your resume first so I can give you personalized advice. How can I help you today?",
        },
      };
    }

    const skills = (resumeData.skills || []).join(", ");
    const atsIssues = (resumeData.atsIssues || []).join(", ");
    const atsSuggestions = (resumeData.atsSuggestions || []).join(", ");
    const atsStrengths = (resumeData.atsStrengths || []).join(", ");
    const matchedJobs = (resumeData.matchedJobs || []).slice(0, 3).map((j) => j.title).join(", ");

    return {
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      assistantOverrides: {
        firstMessage: `Hi! I've analyzed your resume. You're a ${resumeData.primaryRole || "developer"} with an ATS score of ${resumeData.atsScore || "N/A"}/100. I can help you improve your resume, boost your ATS score, or prepare you for interviews. What would you like to work on?`,
        model: {
          provider: "google",
          model: "gemini-2.0-flash",
          systemPrompt: `You are an expert AI career coach and interview preparation assistant for Smart CV Job Matcher.

You have already analyzed the candidate's resume. Here is their complete profile:

=== CANDIDATE PROFILE ===
Name: ${resumeData.originalName || "Candidate"}
Primary Role: ${resumeData.primaryRole || "Not specified"}
Experience Level: ${resumeData.experienceLevel || "Not specified"}
Skills: ${skills || "Not specified"}

=== ATS ANALYSIS ===
ATS Score: ${resumeData.atsScore || "N/A"}/100
ATS Strengths: ${atsStrengths || "None listed"}
ATS Issues: ${atsIssues || "None listed"}
ATS Suggestions: ${atsSuggestions || "None listed"}

=== JOB MATCHES ===
Top Matched Jobs: ${matchedJobs || "None yet"}

=== RESUME SUMMARY ===
${resumeData.summary || "No summary available"}

=== YOUR RESPONSIBILITIES ===
1. RESUME IMPROVEMENT: Give specific advice based on their actual skills and issues above
2. INTERVIEW PREPARATION: When user says a job title, immediately start asking interview questions one at a time
3. ATS COACHING: Explain ATS and give specific keyword suggestions

=== CONVERSATION RULES ===
- Keep responses under 3 sentences for voice
- Be encouraging and specific
- Always reference their actual data above
- Never give generic advice`,
        },
      },
    };
  };

  const handleToggle = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    if (status !== "idle") { vapi.stop(); return; }
    setStatus("connecting");
    const { assistantId, assistantOverrides } = buildAssistantConfig();
    vapi.start(assistantId, assistantOverrides);
  };

  const statusConfig = {
    idle:       { bg: "#0f0f0f", ring: "rgba(15,15,15,0.2)",   label: "AI Assistant", sub: resumeData ? `ATS ${resumeData.atsScore}/100 · Ready` : "Upload resume first" },
    connecting: { bg: "#6366f1", ring: "rgba(99,102,241,0.3)",  label: "Connecting...", sub: "Setting up voice call" },
    active:     { bg: "#22c55e", ring: "rgba(34,197,94,0.3)",   label: "Listening",     sub: "Click to stop" },
    speaking:   { bg: "#f59e0b", ring: "rgba(245,158,11,0.3)",  label: "AI Speaking",   sub: "Processing your request" },
  };

  const cfg = statusConfig[status] || statusConfig.idle;

  return (
    <>
      {/* Transcript bubble */}
      {transcript && (
        <div style={{
          position: "fixed", bottom: "140px", right: "24px",
          maxWidth: "260px", zIndex: 9999,
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}>
          <div style={{
            background: "#0f0f0f", color: "#f5f5f5",
            padding: "12px 16px", borderRadius: "14px 14px 4px 14px",
            fontSize: "12px", lineHeight: "1.6",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}>
            <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              You said
            </p>
            {transcript}
          </div>
          {/* Tail */}
          <div style={{
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderTop: "8px solid #0f0f0f",
            marginLeft: "auto", marginRight: "20px",
          }} />
        </div>
      )}

      {/* Tooltip on hover (idle only) */}
      {showTooltip && status === "idle" && !transcript && (
        <div style={{
          position: "fixed", bottom: "140px", right: "24px",
          zIndex: 9999, fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{
            background: "#0f0f0f", color: "#f5f5f5",
            padding: "10px 14px", borderRadius: "12px 12px 4px 12px",
            fontSize: "12px", lineHeight: "1.5", whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}>
            {resumeData
              ? <>Resume loaded · <span style={{ color: "#22c55e" }}>ATS {resumeData.atsScore}/100</span><br/><span style={{ color: "#555", fontSize: "11px" }}>Ask about resume, jobs or interview prep</span></>
              : <>Upload resume first<br/><span style={{ color: "#555", fontSize: "11px" }}>for personalized AI coaching</span></>
            }
          </div>
          <div style={{
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderTop: "8px solid #0f0f0f",
            marginLeft: "auto", marginRight: "20px",
          }} />
        </div>
      )}

      {/* Main floating widget */}
      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        zIndex: 9999, fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px",
      }}>

        {/* Status label pill — shown when active */}
        {status !== "idle" && (
          <div style={{
            background: "#fff", border: "1px solid #ebebeb",
            borderRadius: "99px", padding: "6px 14px",
            display: "flex", alignItems: "center", gap: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            animation: "fadeIn 0.2s ease",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: cfg.bg,
              animation: status === "active" ? "pulse 1.5s ease infinite" : "none",
            }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>{cfg.label}</span>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>· {cfg.sub}</span>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleToggle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          title={cfg.label}
          style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: cfg.bg, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 24px ${cfg.ring}, 0 2px 8px rgba(0,0,0,0.1)`,
            transition: "all 0.3s ease",
            transform: status === "speaking" ? "scale(1.05)" : "scale(1)",
          }}
        >
          {/* Mic icon — idle/connecting */}
          {(status === "idle" || status === "connecting") && (
            status === "connecting" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="32">
                  <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )
          )}

          {/* Pause icon — active/speaking */}
          {(status === "active" || status === "speaking") && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="2"/>
              <rect x="14" y="4" width="4" height="16" rx="2"/>
            </svg>
          )}
        </button>

        {/* Resume indicator dot */}
        {resumeData && status === "idle" && (
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "99px", padding: "3px 10px",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "10px", color: "#15803d", fontWeight: "600" }}>
              Resume ready
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}