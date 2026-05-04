"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import useInterviewStore from "@/store/interviewStore";
import InterviewCard from "@/components/InterviewCard";
import EvaluationCard from "@/components/EvaluationCard";

export default function InterviewPage() {
  const router = useRouter();
  const { token } = useAuth();

  const { questions, evaluation, loading, setQuestions, setLoading, resetInterview } = useInterviewStore();

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [resumeLoading, setResumeLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        if (!authToken) { router.push("/login"); return; }
        setResumeLoading(true);
        const res = await API.get("/resume/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = res.data.data || [];
        setResumes(data);
        if (data.length > 0) setSelectedResume(data[0]._id);
      } catch (err) {
        console.log(err);
        setError("Failed to load resumes");
      } finally {
        setResumeLoading(false);
      }
    };
    fetchResumes();
    return () => resetInterview();
  }, []);

  const loadQuestions = async () => {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!selectedResume) { alert("Please select a resume"); return; }
      setLoading(true);
      const res = await API.post(
        "/interview/questions",
        { resumeId: selectedResume },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setQuestions(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load interview questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f7f4",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Nav */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #ebebeb",
        padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center",
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
          <span style={{ color: "#d1d5db", margin: "0 4px" }}>/</span>
          <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>AI Interview</span>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            background: "none", border: "1px solid #ebebeb",
            borderRadius: "10px", padding: "8px 16px",
            fontSize: "13px", fontWeight: "600", color: "#374151",
            cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f8f7f4"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Dashboard
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        background: "#0f0f0f", padding: "40px 40px 44px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "99px", padding: "4px 14px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              AI-Powered
            </span>
          </div>
          <h1 style={{
            fontSize: "36px", fontWeight: "800", color: "#fff",
            margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: "1.15",
          }}>
            AI Mock Interview
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6b6b", margin: 0, lineHeight: "1.6" }}>
            Select your resume and get personalized interview questions powered by AI.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 40px 80px" }}>

        {/* Resume Selector Card */}
        <div style={{
          background: "#fff", borderRadius: "20px",
          border: "1px solid #ebebeb", padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: "700", color: "#0f0f0f", margin: 0 }}>Select Resume</p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Choose which resume to base your interview on</p>
            </div>
          </div>

          {resumeLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 0" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
              </svg>
              <span style={{ fontSize: "13px", color: "#9ca3af" }}>Loading resumes...</span>
            </div>
          ) : error ? (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px",
            }}>
              <p style={{ fontSize: "13px", color: "#991b1b", margin: 0 }}>{error}</p>
            </div>
          ) : resumes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 16px" }}>No resumes found</p>
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  background: "#0f0f0f", color: "#fff", border: "none",
                  borderRadius: "10px", padding: "10px 20px",
                  fontSize: "13px", fontWeight: "700", cursor: "pointer",
                }}
              >
                Upload Resume →
              </button>
            </div>
          ) : (
            <>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                style={{
                  width: "100%", background: "#f8f7f4",
                  border: "1px solid #ebebeb", borderRadius: "10px",
                  padding: "11px 14px", fontSize: "13px", color: "#0f0f0f",
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                  marginBottom: "12px", cursor: "pointer",
                }}
              >
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.originalName}
                  </option>
                ))}
              </select>

              <button
                onClick={loadQuestions}
                disabled={!selectedResume || loading}
                style={{
                  width: "100%",
                  background: !selectedResume || loading ? "#d1d5db" : "#0f0f0f",
                  color: "#fff", border: "none", borderRadius: "12px",
                  padding: "13px", fontSize: "13px", fontWeight: "700",
                  cursor: !selectedResume || loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { if (selectedResume && !loading) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
                    </svg>
                    Generating questions...
                  </>
                ) : "Start Interview →"}
              </button>
            </>
          )}
        </div>

        {/* Questions / Placeholder */}
        {!loading && !questions && (
          <div style={{
            background: "#fff", borderRadius: "20px",
            border: "1px solid #ebebeb", padding: "48px",
            textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "#f5f5f5", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 14px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#d1d5db" strokeWidth="1.8"/>
                <path d="M9 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#d1d5db" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: "0 0 6px" }}>
              Ready when you are
            </p>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
              Select a resume above and click "Start Interview"
            </p>
          </div>
        )}

        {questions && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <InterviewCard />
            {evaluation && <EvaluationCard />}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}