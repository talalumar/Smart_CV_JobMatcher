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
    vapi.on("error", (e) => {
      console.error(e);
      setStatus("idle");
    });

    return () => vapi.stop();
  }, []);

  const buildAssistantConfig = () => {
    // If no resume uploaded yet
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
    const matchedJobs = (resumeData.matchedJobs || [])
      .slice(0, 3)
      .map((j) => j.title)
      .join(", ");

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

1. RESUME IMPROVEMENT:
   - Give specific advice based on their actual skills and issues above
   - Tell them exactly what to fix in their resume
   - Explain how to improve their ATS score from ${resumeData.atsScore || "current"} to higher

2. INTERVIEW PREPARATION:
   - When user says a job title (e.g. "I want to prepare for Flutter developer"), immediately start asking interview questions for that role
   - Ask one question at a time
   - After user answers, give feedback and the ideal answer
   - Then ask the next question
   - Cover: technical, behavioral, and situational questions

3. ATS COACHING:
   - Explain what ATS is and how it works
   - Give specific keyword suggestions based on their skills
   - Tell them which of their current issues (${atsIssues}) to fix first

=== CONVERSATION RULES ===
- Keep responses under 3 sentences for voice
- Be encouraging and specific
- Always reference their actual data above
- If user asks about a specific job, tailor interview questions to that job
- Ask follow-up questions to personalize advice further
- Never give generic advice — always use their profile data`,
        },
      },
    };
  };

  const handleToggle = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    if (status !== "idle") {
      vapi.stop();
      return;
    }

    setStatus("connecting");

    const { assistantId, assistantOverrides } = buildAssistantConfig();
    vapi.start(assistantId, assistantOverrides);
  };

  const getButtonStyle = () => {
    const base = {
      position: "fixed",
      bottom: "28px",
      right: "28px",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      transition: "all 0.3s ease",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    };

    if (status === "idle")       return { ...base, background: "#111" };
    if (status === "connecting") return { ...base, background: "#6366f1" };
    if (status === "active")     return { ...base, background: "#22c55e" };
    if (status === "speaking")   return { ...base, background: "#f59e0b" };
  };

  const getIcon = () => {
    if (status === "connecting") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeDasharray="32" strokeDashoffset="32">
            <animate attributeName="stroke-dashoffset" values="32;0" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      );
    }
    if (status === "active" || status === "speaking") {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="2" />
          <rect x="14" y="4" width="4" height="16" rx="2" />
        </svg>
      );
    }
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };

  const getLabel = () => {
    if (status === "idle")       return "Talk to AI Assistant";
    if (status === "connecting") return "Connecting...";
    if (status === "active")     return "Listening... (click to stop)";
    if (status === "speaking")   return "AI is speaking...";
  };

  return (
    <>
      {(status === "active" || status === "speaking") && (
        <div style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          zIndex: 9998,
          animation: "ripple 1.5s ease-out infinite",
        }} />
      )}

      {transcript && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "28px",
          maxWidth: "280px",
          background: "#111",
          color: "#f5f5f5",
          padding: "12px 16px",
          borderRadius: "16px 16px 4px 16px",
          fontSize: "13px",
          lineHeight: "1.5",
          zIndex: 9999,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {transcript}
        </div>
      )}

      {showTooltip && status === "idle" && (
        <div style={{
          position: "fixed",
          bottom: "100px",
          right: "28px",
          background: "#111",
          color: "#f5f5f5",
          padding: "10px 14px",
          borderRadius: "12px 12px 4px 12px",
          fontSize: "12px",
          zIndex: 9999,
          whiteSpace: "nowrap",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          {resumeData
            ? `Resume loaded · ATS ${resumeData.atsScore}/100 · Ask anything`
            : "Upload resume first for personalized advice"}
        </div>
      )}

      {status !== "idle" && (
        <div style={{
          position: "fixed",
          bottom: "98px",
          right: "28px",
          background: "#111",
          color: "#f5f5f5",
          padding: "6px 12px",
          borderRadius: "99px",
          fontSize: "11px",
          zIndex: 9999,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
          letterSpacing: "0.03em",
        }}>
          {getLabel()}
        </div>
      )}

      <button
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={getButtonStyle()}
        title={getLabel()}
      >
        {getIcon()}
      </button>

      <style>{`
        @keyframes ripple {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          100% { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
        }
      `}</style>
    </>
  );
}