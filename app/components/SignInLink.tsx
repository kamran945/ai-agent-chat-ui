"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// --- SignInLink Component ---
// Displays user session info and sign-out button if logged in.
// Otherwise, shows a sign-in link redirecting to the login page.
const SignInLink = () => {
  const { data: session, status } = useSession();

  // --- Loading State ---
  // Prevent layout shift while session data is being fetched
  if (status === "loading") return null;

  return (
    <div>
      {session?.user ? (
        // --- Logged-in User View ---
        <div className="flex items-center gap-2 py-4">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt="userImage"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })} // Redirect to home after sign-out
            className="button-text cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      ) : (
        // --- Guest View (Not Logged In) ---
        <Link
          href="/signin"
          className="topbar flex items-center gap-2 px-3 py-2 rounded-md
  bg-[hsl(var(--header-background))] text-[hsl(var(--header-foreground))]
  hover:bg-[hsl(var(--button-hover))] transition hover:cursor-pointer
  shadow-sm border border-[hsl(var(--border-color))]
  sticky top-0 right-0 z-30"
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default SignInLink;
