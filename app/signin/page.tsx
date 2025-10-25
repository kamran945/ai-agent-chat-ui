import { Metadata } from "next";
import React from "react";
import SignIn from "@/app/components/SignIn";

// --- Page Metadata ---
// Sets the page title for SEO and browser tab display
export const metadata: Metadata = {
  title: "Signin | Agent Chat UI",
};

// --- SignInPage Component ---
// Renders the full-screen SignIn component centered in the viewport
const SignInPage = () => {
  return (
    <div className="fullscreen-overlay flex-center">
      <SignIn /> {/* Sign-in form and buttons */}
    </div>
  );
};

export default SignInPage;
