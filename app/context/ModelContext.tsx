"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// --- Context Value Type ---
interface ModelContextType {
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
}

// --- Create Context (initialized as undefined to enforce provider use) ---
const ModelContext = createContext<ModelContextType | undefined>(undefined);

// --- Provider Component ---
export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  // ✅ Load initial model from localStorage if available
  const [selectedModel, setSelectedModel] = useState("openai/gpt-oss-20b");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("selectedModel");
      if (savedModel) setSelectedModel(savedModel);
    }
  }, []);

  // ✅ Save model changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedModel", selectedModel);
    }
  }, [selectedModel]);

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
};

// --- Custom Hook ---
export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used within a ModelProvider");
  }
  return context;
};
