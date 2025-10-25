"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { groqModels } from "@/config/model";
import { useModel } from "@/app/context/ModelContext";

// --- ModelSelector Component ---
// Renders a button to select the AI model.
// Currently displays a static model name ("GPT-5") with a dropdown icon.
// Styled with hover effects, padding, border, and shadow.
const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useModel();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md
        bg-[hsl(var(--button-background))] text-[hsl(var(--button-foreground))]
        hover:bg-[hsl(var(--button-hover))] transition hover:cursor-pointer
        shadow-sm border border-[hsl(var(--border-color))]"
      >
        <span className="font-medium">
          {groqModels.find((m) => m.id === selectedModel)?.name || "Model"}
        </span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 bg-[hsl(var(--button-background))]
        border border-[hsl(var(--border-color))] rounded-md shadow-md w-48 z-50"
        >
          {groqModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModel(model.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 hover:bg-[hsl(var(--button-hover))] ${
                model.id === selectedModel ? "font-semibold" : ""
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
