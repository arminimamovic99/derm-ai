"use client";

import "@/app/globals.css";
import { useEffect, useState } from "react";
import { AnalysisResult } from "@/type";


export default function DashboardPage() {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [storedUser, setStoredUser] = useState<any>(null);

    useEffect(() => {
      const stored = localStorage.getItem("user");
      const parsed = JSON.parse(stored!);
      if (stored) {
        setStoredUser(parsed);
      }

      const ac = new AbortController();
    
      (async () => {
        try {
          setLoading(true);
          setErr(null);
  
          const res = await fetch(`/api/analysis?userId=${parsed.id}`, {
            method: "GET",
            cache: "no-store",
            signal: ac.signal,
            headers: { "Accept": "application/json" },
          });

  
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error || `Request failed: ${res.status}`);
          }
  
          const data = (await res.json()) as { analysis: any | null };
          setAnalysis(data.analysis.result);
        } catch (e: any) {
          if (e.name !== "AbortError") setErr(e.message || "Failed to load");
        } finally {
          setLoading(false);
        }
      })();
  
      return () => ac.abort();
    }, []);

    return (
      <div className="w-[100wv]">
        <h2 className="font-semibold text-3xl mb-4">Dashboard</h2>
        <p className="text-muted-foreground">
          This is where your post-analysis dashboard will live.
        </p>

        <div className="mt-3 border rounded-lg p-5">
          { analysis?.explanation }
        </div>
      </div>
    );
  }
  