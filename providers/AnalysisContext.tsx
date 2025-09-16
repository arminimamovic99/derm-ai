"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AnalysisContextState = {
  result: string | null;
  setAnalysisResult: (r: string | null) => void;
};

const AnalysisContext = createContext<AnalysisContextState | undefined>(undefined);

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within <AnalysisProvider />");
  return ctx;
};

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [result, setAnalysisResult] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ result, setAnalysisResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}
