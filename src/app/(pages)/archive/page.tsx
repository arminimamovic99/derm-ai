'use client';
import { SkinScore } from "@/components/SkinScore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { FullAnalysisRecord, SkinAnalysisResponse } from "@/type";
import { CalendarClock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ArchivePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [allAnalyses, setAllAnalyses] = useState<FullAnalysisRecord[]>();
    const [selectedAnalysis, setSelectedAnalysis] = useState<FullAnalysisRecord>();
    const [selectedAnalysisResult, setSelectedAnalysisResult] = useState<SkinAnalysisResponse>();
  
    const getDayString = (date: Date): string =>
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user')!).id;
    
        const ac = new AbortController();
      
        (async () => {
          try {
            setLoading(true);
    
            const res = await fetch(`/api/analysis?userId=${userId}&all=true&asc=false`, {
              method: "GET",
              signal: ac.signal,
              headers: { "Accept": "application/json" },
            });
    
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              throw new Error(body?.error || `Request failed: ${res.status}`);
            }
    
            const data = (await res.json());
            setAllAnalyses(data.analyses);
          } catch (err: any) {
            if (err.name !== "AbortError") {
              console.error("Failed to fetch analyses:", err);
            }
          } finally {
            setLoading(false);
          }
        })();
    
        return () => ac.abort();
      }, []);

      useEffect(() => {
        if (selectedAnalysis) {
          const result = JSON.parse(selectedAnalysis?.result!);
          setSelectedAnalysisResult(result);
        }
      }, [selectedAnalysis]);

      return (
        <div className="w-[100wv]">
            <h1 className="text-4xl font-semibold tracking-tight text-balance">Archive</h1>
            <hr className="my-5" />
            <Alert className="my-4 bg-[#eeede6]">
              <AlertTitle>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarClock/>                  
                  <p className="font-semibold">Your skin journey, visualized.</p>
                </div>
              </AlertTitle>
              <AlertDescription>
                This archive shows all your past analyses — each one a snapshot of how your skin has evolved over time.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {
                allAnalyses ?
                  allAnalyses?.map((analysis, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={analysis.image_base64}
                        alt="Analysis snapshot"
                        className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black /90 via-black/60 to-black/0 text-white px-4 py-2">
                        <p className="text-sm font-semibold">
                          {getDayString(new Date(analysis.created_at))}
                        </p>
                      </div>
                    </div> 
                  )) :
                  <>
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                    <Skeleton className="h-[400px] w-full my-2 rounded-lg" />
                  </>
              }
            </div>
            <Dialog open={!!selectedAnalysis} onOpenChange={() => setSelectedAnalysis(undefined)}>
              <DialogContent className="max-w-5xl w-full rounded-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Analysis Snapshot - { getDayString(new Date(selectedAnalysis?.created_at!)) }
                    <hr className="my-2" />
                  </DialogTitle>
                </DialogHeader>
                <div className="p-3">
                  <SkinScore 
                    score={selectedAnalysisResult?.skinHealthScore!}
                    scoreExplanation={selectedAnalysisResult?.scoreExplanation!} 
                    subscores={selectedAnalysisResult?.subScores!} 
                    subscoreExplanations={selectedAnalysisResult?.subScoreExplanations!} 
                  />
                </div>
              </DialogContent>
            </Dialog>
        </div>
      )
}