"use client";

import Link from "next/link";
import { MessageCircle, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

// --- Component Props ---
// Expects 'id' representing the specific chat's ID
type ChatHistoryProps = {
  id: string;
};

// --- ChatHistory Component ---
// Displays a single chat entry in the sidebar with last message preview,
// highlights the active chat, and allows deletion of the chat.
const ChatHistory = ({ id }: ChatHistoryProps) => {
  // --- Router and Session Hooks ---
  const pathname = usePathname(); // current route for active state
  const router = useRouter(); // navigation control
  const { data: session } = useSession(); // current logged-in user session
  const [active, setActive] = useState(false); // tracks if this chat is currently active

  // --- Messages Collection Query ---
  // Fetch messages for this chat ordered by creation time ascending
  const [messages] = useCollection(
    session &&
      query(
        collection(
          db,
          "users",
          session?.user?.email as string,
          "chats",
          id,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
  );

  // --- Latest Message Text ---
  const chatData = messages?.docs[messages?.docs?.length - 1]?.data();
  const chatText = chatData?.text || "new chat"; // fallback if no messages exist

  // --- Active Chat Detection ---
  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id)); // highlight if current route matches chat ID
  }, [pathname, id]);

  // --- All Chats Snapshot ---
  // Used to navigate to next available chat after deletion
  const [chatSnapshot] = useCollection(
    query(
      collection(db, "users", session?.user?.email as string, "chats"),
      orderBy("createdAt", "desc")
    )
  );

  // --- Handle Chat Deletion ---
  const handleRemoveChat = async () => {
    if (!session?.user?.email) return;

    const userEmail = session.user.email;
    const chatRef = doc(db, "users", userEmail, "chats", id);
    const messagesRef = collection(chatRef, "messages");

    // Delete all messages within this chat
    const messageDocs = await getDocs(messagesRef);
    const deletions = messageDocs.docs.map((msg) => deleteDoc(msg.ref));
    await Promise.all(deletions);

    // Delete the chat itself
    await deleteDoc(chatRef);

    // If deleted chat was active, navigate to next available chat or homepage
    if (active) {
      const nextChat = chatSnapshot?.docs?.find((chat) => chat.id !== id);
      router.push(nextChat ? `/chat/${nextChat.id}` : "/");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* --- Single Chat Entry --- */}
      <div
        className={`w-full flex items-center justify-center gap-2
        text-sm md:text-base px-1 rounded-xl font-medium
        transition-all duration-200 active:scale-[0.98]
        ${
          active
            ? "bg-[hsl(var(--button-hover))] text-[hsl(var(--foreground))] border border-[hsl(var(--border-color))]"
            : "bg-transparent text-[hsl(var(--sidebar-foreground))]/70 border border-transparent hover:text-[hsl(var(--sidebar-foreground))] hover:border-[hsl(var(--border-color))] hover:bg-[hsl(var(--button-hover))]"
        }`}
      >
        {/* --- Chat Link and Preview --- */}
        <Link
          href={`/chat/${id}`}
          className="flex items-center gap-3 flex-1 overflow-hidden"
        >
          {/* Chat icon */}
          <MessageCircle
            className="text-[hsl(var(--foreground))] shrink-0"
            size={18}
          />
          {/* Latest message text */}
          <p className="truncate text-sm font-medium tracking-wide text-[hsl(var(--foreground))]">
            {chatText}
          </p>
        </Link>

        {/* --- Delete Chat Button --- */}
        <button
          onClick={handleRemoveChat}
          className="flex items-center justify-center p-1.5 rounded-lg
          text-[hsl(var(--foreground))]/60
          hover:text-[hsl(var(--foreground))]
          hover:bg-[hsl(var(--button-hover))]
          hover:cursor-pointer
          transition-colors duration-200"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;
