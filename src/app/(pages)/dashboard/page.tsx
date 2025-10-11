"use client";

import "@/app/globals.css";
import { useEffect, useState } from "react";
import { RecommendedAmazonProduct, SkinAnalysisResponse, StepPlanEntry } from "@/type";
import React from "react";
import { SkinScore } from "@/components/SkinScore";
import { ProductsSection } from "@/components/ProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";


export default function DashboardPage() {
    const [analysis, setAnalysis] = useState<SkinAnalysisResponse | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [storedUser, setStoredUser] = useState<any>(null);
    const [products, setProducts] = useState<RecommendedAmazonProduct[]>();
    const [createdAt, setCreatedAt] = useState<string>();
    const [todaysTasks, setTodaysTasks] = useState<StepPlanEntry>();
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [isDayPastPlan, setIsDayPastPlan] = useState<boolean>(false);
    const [analysisChartData, setAnalysisChartData] = useState<{score: number, date: string}[]>();

    const getDayString = (date: Date): string =>
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
    
    const goToAnalysis = () => {
      window.location.href = '/analysis';
    }

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
          const products = JSON.parse(data.analysis.recommended_products);
          if (products?.length > 0) {
            setProducts(products);
          }
          setAnalysis(JSON.parse(data.analysis.result));
          setImage(data.analysis.image_base64);
          setCreatedAt(data.analysis.created_at);

        } catch (e: any) {
          if (e.name !== "AbortError") setErr(e.message || "Failed to load");
        } finally {
          setLoading(false);
        }
      })();
  
      return () => ac.abort();
    }, []);

    useEffect(() => {
      const today = new Date();
      const analysisDate = new Date(createdAt!);
      const daysSince = Math.floor(
        (today.getTime() - analysisDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const current = Math.min(daysSince + 1, 14);
      setCurrentDay(current);

      console.log(analysis?.stepByStepPlan);

      const dayAfterPlan = analysis?.stepByStepPlan.length! + 1;
      if (currentDay >= dayAfterPlan) {
        setIsDayPastPlan(true);
      }
      const todaysPlan = analysis?.stepByStepPlan.find(
        (p: StepPlanEntry) => p.day === current
      );

      console.log({todaysPlan});

      if (todaysPlan) {
        setTodaysTasks(todaysPlan);
      }
    }, [analysis]);

    useEffect(() => {
      const userId = JSON.parse(localStorage.getItem('user')!).id;
  
      const ac = new AbortController();
    
      (async () => {
        try {
          setLoading(true);
         // setError(null);
  
          const res = await fetch(`/api/analysis?userId=${userId}&all=true&asc=true`, {
            method: "GET",
            signal: ac.signal,
            headers: { "Accept": "application/json" },
          });
  
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error || `Request failed: ${res.status}`);
          }
  
          const data = (await res.json());
          if (data.analyses.length > 1) {
            const allAnalysisScores = data.analyses.map((a: any) => ({
              score: JSON.parse(a.result).skinHealthScore,
              date: getDayString(new Date(a.created_at))
            }))
  
            setAnalysisChartData(allAnalysisScores);
          }
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
  

    return (
      <div className="w-[100wv]">
        <div className="w-full">
          {
            analysis ? 
            <>
              <div className="flex">
                <h1 className="text-4xl font-semibold tracking-tight text-balance">Dashboard</h1>
              </div>
              <hr className="my-5" />
              {
                isDayPastPlan ? 
                <Alert className="bg-[#eeede6] mb-5 text-lg">
                  <AlertTitle className="font-semibold">
                    <div className="flex gap-3 items-center">
                    {/* <Info className="text-red"></Info> */}
                    ❗
                    Your skin’s ready for a new scan ✨
                    </div>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="flex items-center gap-4 text-lg">
                      A week has passed since your last analysis — let’s see how your skin is improving and update your personalized plan.
                      <Button className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" onClick={goToAnalysis}>Start analysis</Button>
                    </div>
                  </AlertDescription>
                </Alert>
                : ''
              }
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="self-start w-[70%]">
                  <SkinScore image={image!} score={analysis?.skinHealthScore!} subscores={analysis?.subScores!} scoreExplanation={analysis?.scoreExplanation!} subscoreExplanations={analysis?.subScoreExplanations!} /> 
                  <div className="flex flex-col md:flex-row gap-6 items-start mt-6">
                    <div className="w-full">
                      <h2 className='text-2xl mb-5 font-semibold'>Advice & tips</h2>
                      <div className="shadow-md rounded-xl p-6 gap-3 bg-[#f8f7f4]">
                          <div className="flex items-center gap-6">
                            <div>
                              <h2 className="text-xl mb-3 font-semibold"> 💡 Lifestyle habits to implement or change</h2>
                              <p className="font-medium"> {analysis?.lifestyleHabitsToImplementOrChange} </p>
                            </div>
                            <div>
                              <h2 className="text-xl mb-3 font-semibold"> ❌ Things to avoid</h2>
                              <p className="font-medium"> {analysis?.thingsToAvoid} </p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-start w-[30%]">
                  {
                    todaysTasks ?
                    <div>
                    <h2 className='text-2xl mb-5 font-semibold'>Tasks for day { currentDay } - <span className="text-lg font-medium"> { getDayString(new Date()) } </span> </h2>
                    <div className="m-2 shadow-md rounded-xl p-6 flex items-center gap-3 bg-[#f8f7f4]">
                      <div className="px-6">
                        <div className="flex justify-between items-center w-full">
                            <div>
                              <div className="flex items-center gap-5 my-2">
                                <p className="text-lg font-medium"> <span className="font-semibold">🌞   Morning: </span> {todaysTasks?.morning} </p>
                              </div>
                              <hr />
                              <div className="flex items-center gap-5 my-2">
                                <p className="text-lg font-medium"> <span className="font-semibold">🌙  Afternoon: </span> {todaysTasks?.afternoon} </p>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div> 
                    </div>
                    : 
                      ''

                  }
                  <div className="mt-3 w-full">
                    {
                      products ? 
                      <ProductsSection products={products!}/>
                      : ''
                    }
                  </div>
                </div>
              </div>
              <div className="grid flex-1 scroll-mt-20 items-stretch gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
                <div className="themes-wrapper group relative flex flex-col overflow-hidden rounded-xl transition-all duration-200 ease-in-out hover:z-30">
                  {
                    analysisChartData ?
                    <ProgressChart chartData={analysisChartData!} />
                    : ''
                  }
                </div>
              </div>
            </>
            : 
            <>
              <Skeleton className="h-[20rem] my-2 w-full rounded-lg" />
              <Skeleton className="h-[20rem] my-2 w-full rounded-lg" />
            </>
          }
        </div>
      </div>
    );
  }
  