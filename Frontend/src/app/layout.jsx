import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <VoiceAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}