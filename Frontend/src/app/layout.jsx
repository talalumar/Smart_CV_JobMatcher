"use client";

import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import VoiceAssistant from "@/components/VoiceAssistant";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideVoiceAssistant = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          {!hideVoiceAssistant && <VoiceAssistant />}
        </AuthProvider>
      </body>
    </html>
  );
}