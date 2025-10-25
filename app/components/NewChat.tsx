"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";

// --- NewChat Component ---
// Renders a button that creates a new chat in Firestore and navigates to it.
const NewChat = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const userEmail = session?.user
    ? (session?.user?.email as string)
    : "unknown"; // Fallback for unknown user

  // --- Start a New Chat ---
  // Adds a new chat document in Firestore and navigates to its page
  const startNewChat = async () => {
    {
      /* Get a chat id from database */
    }
    const doc = await addDoc(collection(db, "users", userEmail, "chats"), {
      userId: userEmail,
      createdAt: serverTimestamp(), // Server timestamp for consistent creation time
    });

    // Navigate to the newly created chat page
    router.push(`/chat/${doc?.id}`);
  };

  return (
    <div className="w-full flex justify-center">
      {/* --- New Chat Button --- */}
      <button
        onClick={startNewChat}
        className="w-full flex items-center justify-center gap-2
          text-sm md:text-base p-3 rounded-xl font-medium
          bg-transparent text-[hsl(var(--sidebar-foreground))]/70
          border border-transparent
          hover:text-[hsl(var(--sidebar-foreground))] 
          hover:border-[hsl(var(--border-color))]
          hover:bg-[hsl(var(--button-hover))]
          hover:cursor-pointer
          transition-all duration-200 active:scale-[0.98]"
      >
        {/* Plus icon */}
        <Plus className="w-4 h-4" />
        New Chat
      </button>
    </div>
  );
};

export default NewChat;
