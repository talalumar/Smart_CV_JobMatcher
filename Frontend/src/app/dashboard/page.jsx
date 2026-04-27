"use client";

import ResumeUploader from "@/components/ResumeUploader";
import ATSCard from "@/components/ATSCard";
// import ResultCard from "@/components/ResultCard";
import SuggestionCard from "@/components/SuggestionCard";

export default function DashboardPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "30px" }}>
        Smart CV Job Matcher Dashboard
      </h1>

      <ResumeUploader />

      <div style={{ marginTop: "30px" }}>
        <ATSCard />
      </div>

      {/* <div style={{ marginTop: "30px" }}>
        <ResultCard />
      </div> */}

      <div style={{ marginTop: "30px" }}>
        <SuggestionCard />
      </div>
    </div>
  );
}