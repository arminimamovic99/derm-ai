"use client";

import "@/app/globals.css";
import { useEffect, useState } from "react";
import { RecommendedAmazonProduct, SkinAnalysisResponse } from "@/type";
import React from "react";
import { SkinScore } from "@/components/SkinScore";
import { ProductsSection } from "@/components/ProductsSection";
import { Skeleton } from "@/components/ui/skeleton";


export default function DashboardPage() {
    const [analysis, setAnalysis] = useState<SkinAnalysisResponse | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [storedUser, setStoredUser] = useState<any>(null);
    const [products, setProducts] = useState<RecommendedAmazonProduct[]>();
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
          setProducts(products);
          setAnalysis(JSON.parse(data.analysis.result));
          setImage(data.analysis.image_base64);
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
        <div className="w-full">
          {
            analysis ? 
            <>
              <div className="flex">
                <h1 className="text-4xl">Dashboard</h1>
              </div>
              <hr className="my-5" />
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="self-start w-[70%]">
                  <SkinScore image={image!} score={analysis?.skinHealthScore!} subscores={analysis?.subScores!} scoreExplanation={analysis?.scoreExplanation!} subscoreExplanations={analysis?.subScoreExplanations!} /> 
                  <div className="flex flex-col md:flex-row gap-6 items-start mt-3">
                    <div className="w-full">
                      <h2 className='text-2xl mb-3 font-semibold'>Advice & tips</h2>
                      <div className="border border-2 rounded-lg p-6 gap-3 bg-[#f8f7f4]">
                          <div className="flex items-center gap-6">
                            <div>
                              <h2 className="text-xl mb-3 font-semibold"> 💡 Lifestyle habits to implement or change</h2>
                              <p className="font-light"> {analysis?.lifestyleHabitsToImplementOrChange} </p>
                            </div>
                            <div>
                              <h2 className="text-xl mb-3 font-semibold"> ❌ Things to avoid</h2>
                              <p className="font-light"> {analysis?.thingsToAvoid} </p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-start w-[30%]">
                  <h2 className='text-2xl mb-3 font-semibold'>Today's tasks - <span className="text-lg font-light"> {new Date().toDateString()} </span> </h2>
                  <div className="m-2 border rounded-lg p-6 flex items-center gap-3 bg-[#f8f7f4]">
                    <div className="px-6">
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="flex items-center gap-5 my-2">
                            <p className="text-lg font-light"> <span className="font-semibold">🌞   Morning: </span> {analysis?.stepByStepPlan[0].morning} </p>
                          </div>
                          <hr />
                          <div className="flex items-center gap-5 my-2">
                            <p className="text-lg font-light"> <span className="font-semibold">🌙  Afternoon: </span> {analysis?.stepByStepPlan[0].afternoon} </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                  <div className="mt-3 w-full">
                    <ProductsSection products={products!}/>
                  </div>
                </div>
                {/* <ProductsSection products={analysis?.recommendedProducts!} /> */}
              </div>
            </>
            : 
            <>
              <Skeleton className="h-[20rem] my-2 w-full rounded-lg" />
              <Skeleton className="h-[20rem] my-2 w-full rounded-lg" />
            </>
          }
        </div>
        {/* <div className="mt-3 border rounded-lg p-5">
          { analysis?.explanation }
        </div> */}
      </div>
    );
  }
  