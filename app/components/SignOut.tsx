"use client";

import React from "react";
import { signOut } from "next-auth/react";

// --- SignOutComp Component ---
// Renders a button to securely sign out the user and redirect to the homepage.
const SignOutComp = () => {
  // --- Sign Out Handler ---
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Sign out and redirect home
  };

  return (
    <button
      onClick={handleSignOut} // Trigger sign-out on click
      type="button"
      className="button-text cursor-pointer"
    >
      Sign Out
    </button>
  );
};

export default SignOutComp;
