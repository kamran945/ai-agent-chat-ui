"use client";

import React, { useState } from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import {
  addDoc,
  collection,
  CollectionReference,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useModel } from "@/app/context/ModelContext";

import AttachmentMenu from "@/app/components/AttachmentMenu";

// Define message structure
interface ChatMessage {
  text: string;
  createdAt: any; // serverTimestamp() type
  user: {
    _id: string;
    name: string;
    avatar: string | null;
  };
}

// --- Component Props ---
interface ChatInputProps {
  id: string;
}

export default function ChatInput({ id }: ChatInputProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user
    ? (session?.user?.email as string)
    : "unknown";
  const userName = session?.user ? (session?.user?.email as string) : "unknown";
  // const model = "openai/gpt-oss-20b";
  const { selectedModel } = useModel();
  const model = selectedModel;

  const handleSend = async () => {
    if (!message) return;
    const cleanMessage = message.trim();

    const messageForStore = {
      text: cleanMessage,
      createdAt: serverTimestamp(),
      user: {
        _id: userEmail,
        name: userName,
        avatar: (session?.user?.image as string) || null,
      },
    };

    try {
      setLoading(true);
      let chatDocumentId = id;

      // --- Build history string (newest first) ---
      let historyString = "Previous Chat History:\n";

      // --- Create messagesRef only if chatDocumentId exists ---
      let messagesRef: CollectionReference<ChatMessage> | undefined;
      if (chatDocumentId) {
        messagesRef = collection(
          db,
          "users",
          userEmail,
          "chats",
          chatDocumentId,
          "messages"
        ) as CollectionReference<ChatMessage>;
      }

      // Only build history if messagesRef exists
      if (messagesRef) {
        const messagesQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const messagesSnapshot = await getDocs(messagesQuery);

        if (!messagesSnapshot.empty) {
          const lastMessages = messagesSnapshot.docs.map((doc) => doc.data());
          lastMessages.forEach((msg) => {
            const sender = msg.user?._id === userEmail ? "User" : "AI";
            historyString += `${sender}: ${msg.text}\n`;
          });
        }
      }

      // --- Create Chat Document if it Doesn't Exist ---
      if (!id) {
        const docRef = await addDoc(
          collection(db, "users", userEmail, "chats"),
          {
            userId: userEmail,
            createdAt: serverTimestamp(),
          }
        );
        chatDocumentId = docRef.id;
        router.push(`/chat/${chatDocumentId}`);
      }

      // --- Store Message in Firestore ---
      await addDoc(
        collection(db, "users", userEmail, "chats", chatDocumentId, "messages"),
        messageForStore
      );
      setMessage("");

      const notification = toast.loading("Thinking...");

      // --- Send Message to AI Agent ---
      try {
        const res = await fetch("/api/askagent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageForStore.text,
            chathistory: historyString,
            id: chatDocumentId,
            model,
            session: userEmail,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Request failed: ${errorText}`);
        }

        const data = await res.json();
        if (data?.success) {
          toast.success(data?.message || "Response received!", {
            id: notification,
          });
        } else {
          toast.error(data?.message || "AI Agent failed to respond.", {
            id: notification,
          });
        }
      } catch (err: any) {
        console.error("AI Agent Error:", err);
        toast.error(`AI Agent was unable to find an answer for that.`);
      }
    } catch (error) {
      console.error("Error sending message", error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 shrink-0 px-6 py-2 bg-[hsl(var(--main-background))] border-t border-[hsl(var(--border-color))]">
      <form className="flex items-center w-full rounded-full bg-[hsl(var(--input-background))] border border-[hsl(var(--input-border))] overflow-visible px-2">
        <AttachmentMenu />

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-3 py-3 text-[hsl(var(--input-foreground))] placeholder-[hsl(var(--input-placeholder))] bg-transparent outline-none"
        />

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSend();
          }}
          disabled={!message.trim()}
          className={`flex items-center justify-center w-10 h-10 rounded-full text-[hsl(var(--foreground))] transition-colors ${
            message.trim()
              ? "hover:bg-[hsl(var(--button-hover))] hover:cursor-pointer"
              : "opacity-50"
          }`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </form>

      <p className="text-xs mt-2 font-medium text-[hsl(var(--foreground))] tracking-wide py-1 text-center justify-center">
        ---
      </p>
    </div>
  );
}
