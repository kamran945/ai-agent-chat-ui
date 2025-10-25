import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "./components/ClientLayout"; // new client-only layout
import SignInLink from "./components/SignInLink";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ModelProvider } from "@/app/context/ModelContext";

// --- Google Fonts Setup ---
// Load Geist Sans and Geist Mono with CSS variables for consistent font usage
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- Page Metadata ---
// Global metadata for SEO and browser tab display
export const metadata: Metadata = {
  title: "Agent Chat UI",
  description: "It is an Agent Chat user interface.",
};

// --- RootLayout Component ---
// Wraps the entire application with fonts, session provider, client layout, and toast notifications
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // --- Server-side Session Fetching ---
  // Retrieves the current session to provide authentication context
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* --- Authentication Context --- */}
        <SessionProvider session={session}>
          {/* --- Custom Model Provider Context --- */}
          <ModelProvider>
            {/* --- Client-side Layout Wrapper --- */}
            <ClientLayout>{children}</ClientLayout>
          </ModelProvider>
        </SessionProvider>

        {/* --- Toast Notifications --- */}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              backgroundColor: "hsl(var(--sidebar-background))",
              color: "hsl(var(--sidebar-foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
