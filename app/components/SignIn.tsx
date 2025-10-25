import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc";

// --- SignIn Component ---
// Renders a login page allowing users to sign in via Google.
// If a user session exists, redirects to the homepage.
const SignIn = async () => {
  // --- Check existing session ---
  const session = await auth();
  if (session?.user) {
    redirect("/"); // Redirect logged-in users to homepage
  }

  return (
    <div className="card flex flex-col items-center space-y-6 w-96 py-10">
      {/* --- Header Section --- */}
      <div className="text-center px-6">
        <p className="text-3xl font-bold">Welcome!</p>
        <p className="mt-2 text-base font-medium">
          Login or Signup to get smarter responses, upload files, images and
          more...
        </p>
      </div>

      {/* --- Sign-In Buttons --- */}
      <div className="flex flex-col gap-3 mt-3 w-full px-6">
        <form
          action={async () => {
            "use server";
            await signIn(); // Trigger Google sign-in via server action
          }}
        >
          <button
            type="submit"
            className="button cursor-pointer flex items-center justify-center gap-2 w-full font-semibold"
          >
            {/* Google Icon */}
            <FcGoogle />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
