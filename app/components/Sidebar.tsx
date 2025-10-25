"use client";

import React, { useEffect, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import NewChat from "@/app/components/NewChat";
import ChatHistory from "@/app/components/ChatHistory";
import HomeButton from "@/app/components/HomeButton";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSession } from "next-auth/react";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

// --- Component Props ---
// 'isOpen' controls sidebar visibility
// 'toggle' is a function to open/close the sidebar
interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

// --- Sidebar Component ---
// Renders the main sidebar including navigation, new chat button, and chat history
const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // --- Fetch User Chats from Firestore ---
  // Only fetch if the user is logged in
  const [chats, loading] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email as string, "chats"),
        orderBy("createdAt", "desc")
      )
  );

  // --- Redirect if no chats exist (fallback) ---
  useEffect(() => {
    if (!chats) {
      router?.push("/");
    }
  }, [chats, router]);

  // --- Dummy function to start a chat for demo purposes ---
  const startNewChat = () => {
    const dummyChatId: string = "demo-chat-001";
    router.push(`/chat/${dummyChatId}`);
  };

  return (
    <>
      {/* --- Hamburger Menu Toggle --- */}
      <button
        className={`fixed top-4 z-50 bg-[hsl(var(--sidebar-background))] 
        text-[hsl(var(--sidebar-foreground))] p-2 rounded-md shadow-md 
        transition-all duration-300 ${isOpen ? "left-52" : "left-4"}
        hover:cursor-pointer`}
        onClick={toggle}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* --- Sidebar Panel --- */}
      <aside
        className={`sidebar w-64 flex flex-col fixed top-0 left-0 h-full
          bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]
          border-r border-[hsl(var(--border-color))] shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} z-40`}
      >
        {/* --- Top Fixed Section --- */}
        <div className="flex flex-col px-4 pt-4 pb-2 bg-[hsl(var(--sidebar-background))] shrink-0 border-b border-[hsl(var(--border-color))]">
          {/* Logo/Home Button */}
          <div className="font-bold text-lg mb-3 select-none">
            <HomeButton />
          </div>

          {/* New Chat Button */}
          <NewChat />
        </div>

        {/* --- Scrollable Navigation Area --- */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-[hsl(var(--border-color))] scrollbar-track-[hsl(var(--sidebar-background))]">
          <div className="chat-history">
            {session?.user ? (
              <>
                {/* Chat History Title */}
                {chats?.docs.length ? (
                  <>
                    <p className="chat-history-title">Chat History</p>
                    <div className="chat-history-list">
                      {loading ? (
                        // --- Loading Placeholder Rows ---
                        <div className="chat-history-loading">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="chat-history-loading-row" />
                          ))}
                        </div>
                      ) : (
                        // --- Render User Chat History ---
                        chats.docs.map((chat) => (
                          <ChatHistory key={chat.id} id={chat.id} />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  !loading && (
                    <div className="chat-history-empty">
                      <p>No chat history</p>
                    </div>
                  )
                )}
              </>
            ) : (
              !loading && (
                <div className="chat-history-guest flex flex-col items-center text-center gap-3">
                  <p>Please sign in to view chat history.</p>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                    bg-[hsl(var(--header-background))] text-[hsl(var(--header-foreground))]
                    hover:bg-[hsl(var(--button-hover))] transition hover:cursor-pointer
                    shadow-sm border border-[hsl(var(--border-color))]"
                  >
                    Sign in
                  </Link>
                </div>
              )
            )}
          </div>
        </nav>
        {/* ✅ Theme Toggle fixed at bottom-right */}
        <div className="mt-auto p-4 border-t border-[hsl(var(--border-color))] flex justify-end">
          <ThemeToggle />
        </div>
      </aside>

      {/* --- Overlay for Small Screens --- */}
      {isOpen && typeof window !== "undefined" && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={toggle}></div>
      )}
    </>
  );
};

export default Sidebar;
