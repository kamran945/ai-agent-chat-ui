"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Image, Video } from "lucide-react";

export default function AttachmentMenu() {
  // State to toggle dropdown menu visibility
  const [open, setOpen] = useState(false);

  // Ref to the menu div for detecting outside clicks
  const menuRef = useRef<HTMLDivElement>(null);

  // Refs to hidden file inputs for triggering programmatically
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Effect to close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Best practice: separate handler for image input change
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpen(false);
    console.log("Selected image:", file);
    // TODO: implement preview + upload
  };

  // Best practice: separate handler for video input change
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOpen(false);
    console.log("Selected video:", file);
    // TODO: implement preview + upload
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Plus button toggles menu */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-[hsl(var(--foreground))] hover:bg-[hsl(var(--button-hover))] transition-colors hover:cursor-pointer"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute bottom-12 left-0 mb-2 w-44 bg-[hsl(var(--card-background))] border border-[hsl(var(--card-border))] rounded-xl shadow-lg overflow-hidden z-50">
          {/* Trigger hidden image input */}
          <button
            className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--button-hover))] transition-colors"
            onClick={(e) => {
              e.preventDefault(); // optional, safe to keep
              imageInputRef.current?.click();
            }}
          >
            <Image className="w-4 h-4" /> Upload Image
          </button>
          {/* Trigger hidden video input */}
          <button
            className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--button-hover))] transition-colors"
            onClick={(e) => {
              e.preventDefault();
              videoInputRef.current?.click();
            }}
          >
            <Video className="w-4 h-4" /> Upload Video
          </button>
        </div>
      )}

      {/* Hidden file inputs for controlled upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoUpload}
      />
    </div>
  );
}
