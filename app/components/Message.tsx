"use client";

import React from "react";
import { Bot, User } from "lucide-react";
import { DocumentData } from "firebase/firestore";

// --- Component Props ---
// Expects a Firestore message object containing text and user information
interface MessageProps {
  message: DocumentData;
}

// --- Message Component ---
// Renders a single chat message with proper alignment and avatar
// Differentiates between AI messages and user messages.
const Message: React.FC<MessageProps> = ({ message }) => {
  const isAi = message.user._id === "AI"; // Determine if the message is from AI

  return (
    <div
      key={message.id}
      className={`flex items-start gap-3 ${
        isAi ? "justify-start" : "justify-end" // Align left for AI, right for user
      }`}
    >
      {/* --- AI Avatar --- */}
      {isAi && (
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-[hsl(var(--border-color))] mt-1">
          <Bot size={18} className="text-[hsl(var(--foreground))] opacity-80" />
        </div>
      )}

      {/* --- Message Bubble --- */}
      <div className={!isAi ? "chat-user" : "chat-ai"}>
        <p>{message.text}</p>
      </div>

      {/* --- User Avatar --- */}
      {!isAi && (
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-[hsl(var(--border-color))] mt-1">
          <User
            size={18}
            className="text-[hsl(var(--foreground))] opacity-80"
          />
        </div>
      )}
    </div>
  );
};

export default Message;
