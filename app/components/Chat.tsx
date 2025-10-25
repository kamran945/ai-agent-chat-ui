"use client";

import React, { useRef, useEffect } from "react";
import { ArrowDownCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";

import Message from "@/app/components/Message";

// --- Chat Component Props ---
// Expects a single prop 'id' representing the current chat's ID
interface ChatProps {
  id: string;
}

// --- Chat Component ---
// Displays all messages for a specific chat and automatically scrolls to the latest message.
// Shows a placeholder when no messages are present.
const Chat: React.FC<ChatProps> = ({ id }) => {
  // --- User Session ---
  const { data: session } = useSession();
  const userEmail = session?.user
    ? (session?.user?.email as string)
    : "unknown"; // fallback email if session not found

  // --- Firestore Query Setup ---
  // Fetches messages for the current chat, ordered by creation time ascending
  const messagesQuery =
    userEmail && id
      ? query(
          collection(db, "users", userEmail, "chats", id, "messages"),
          orderBy("createdAt", "asc")
        )
      : null;

  // --- Listen to Firestore Collection ---
  // useCollection hook subscribes to real-time updates of messages
  const [messages] = useCollection(messagesQuery);

  // --- Scroll Handling ---
  // Ref to keep track of the bottom of the chat for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages update
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--main-background))] text-[hsl(var(--foreground))]">
      {/* --- Chat Messages Area --- */}
      <nav className="main-scrollable flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-[hsl(var(--border-color))] scrollbar-track-[hsl(var(--main-background))]">
        {/* --- Placeholder for Empty Chat --- */}
        {messages?.docs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <p className="text-[hsl(var(--foreground))] text-sm opacity-80">
              Type a message below to get started!
            </p>
            <ArrowDownCircle className="w-6 h-6 text-[hsl(var(--primary))] animate-bounce" />
          </div>
        )}

        {/* --- Render Messages --- */}
        {messages?.docs.map((message) => (
          <div key={message.id}>
            <Message message={message?.data()} />
          </div>
        ))}

        {/* --- Bottom Spacer for Auto-Scroll --- */}
        <div ref={bottomRef} />
      </nav>
    </div>
  );
};

export default Chat;
