"use client";

import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import useResumeStore from "@/store/resumeStore";

export default function VoiceAssistant() {
  const [status, setStatus] = useState("idle"); // idle | connecting | active | speaking
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

  const buildAssistantOverrides = () => {
    if (!resumeData) return {};

    return {
      variableValues: {
        userName: "there",
        skills: (resumeData.skills || []).join(", "),
        experienceLevel: resumeData.experienceLevel || "entry-level",
        primaryRole: resumeData.primaryRole || "software developer",
        atsScore: resumeData.atsScore || "unknown",
        atsIssues: (resumeData.atsIssues || []).join(", "),
        atsSuggestions: (resumeData.atsSuggestions || []).join(", "),
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

    const overrides = buildAssistantOverrides();

    vapi.start(
      process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
      overrides
    );
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

    if (status === "idle")        return { ...base, background: "#111" };
    if (status === "connecting")  return { ...base, background: "#6366f1" };
    if (status === "active")      return { ...base, background: "#22c55e" };
    if (status === "speaking")    return { ...base, background: "#f59e0b" };
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
      {/* Ripple animation when active */}
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

      {/* Transcript bubble */}
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

      {/* Tooltip */}
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
          🎙 Ask about resume, ATS score or interview prep
        </div>
      )}

      {/* Status label */}
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

      {/* Main button */}
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