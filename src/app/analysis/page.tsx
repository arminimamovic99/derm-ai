"use client";

import { useEffect, useState } from "react";
import OpenAI from "openai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarning } from "lucide-react";
import { useAnalysis } from "../../../providers/AnalysisContext";
import { useRouter } from "next/navigation";
import { BeamAnimation } from "@/components/AnimatedBeam";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true
});

const rapidapiKey = process.env.RAPIDAPI_KEY!;

export default function AnalysisPage() {

    const [images, setImages] = useState<(File | null)[]>([
        null
    ]);
    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([
        null
    ]);
    const [form, setForm] = useState({
        age: "",
        gender: "",
        skinType: "",
        conditions: "",
        lifestyle: "",
        routine: "",
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const {setAnalysisResult} = useAnalysis(); 
    const router = useRouter();

    const [storedUser, setStoredUser] = useState<any>(null);

    useEffect(() => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setStoredUser(JSON.parse(stored));
      }
    }, []);

    async function compressToBase64(file: File, maxSize = 400): Promise<string> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("no ctx");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.6); // base64
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      }

      const handleImageChange = async (index: number, file: File | null) => {
        const newImages = [...images];
        const newPreviews = [...previewUrls];
      
        if (!file) {
          newImages[index] = null;
          newPreviews[index] = null;
          setImages(newImages);
          setPreviewUrls(newPreviews);
          return;
        }
        newImages[index] = file;
        newPreviews[index] = URL.createObjectURL(file);
      
        setImages(newImages);
        setPreviewUrls(newPreviews);
      };
      
    
    const handleFormChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const canAnalyze =
        images.every(Boolean) && Object.values(form).every((v) => v !== "");

    async function fileToBase64(file: File) {
        const reader = new FileReader();
        return new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handleAnalyze = async () => {
        setLoading(true);
        setResult(null);
        const base64img = await compressToBase64(images[0]!, 400);
        const prompt = `
        Take into account the following disclaimers:
        - stepByStepPlan must contain 14 days. Each day must have tasks split into morning and afternoon. Return entries for all 14 days, no placeholders or fillers.
        - recommendedProducts must include "name", "manufacturer", "description", "imageQuery" (for searching the product online), and "imagePrompt" (a natural description of what the product looks like for potential AI image generation).
        - Do NOT recommend any products that the user currently uses or mentioned in their current routine. Always suggest alternative or complementary products that align with their skin needs.
        - The response MUST be a valid JSON object with no comments, markdown, or extra text.
        
        You are a dermatologist AI assistant. Analyze the user's skin based on the uploaded image and questionnaire.
        
        User profile:
        • Age: ${form.age}
        • Gender: ${form.gender}
        • Skin type: ${form.skinType}
        • Conditions: ${form.conditions}
        • Lifestyle: ${form.lifestyle}
        • Current routine: ${form.routine}
        
        Photo (base64, truncated for length):
        ${base64img.substring(0, 10000)}

        For each detected skin attribute (hydration, acne, redness, texture, wrinkles), return approximate coordinates on the face where the issue is visually detected. 

        Use normalized coordinates (x, y) with values between 0 and 1, representing the position on the photo (0 = left/top, 1 = right/bottom). Each coordinate should include a short description.

        Include this in a field called "regionMap" where each key is one of the subscore categories and the value is an array of coordinate objects:
        {
            "x": number,
            "y": number,
            "description": string
        }
        
        Scoring system:
        - Each subscore (hydration, acne, redness, texture, wrinkles) must be an integer between 0 and 100.
        - The overall "skinHealthScore" must be the average of all subscores, rounded to the nearest integer.
        - Use this interpretation for all scores:
          90–100: Excellent
          75–89: Good
          60–74: Fair
          40–59: Poor
          0–39: Critical
        
        Output requirements:
        - Be specific and realistic in your explanations.
        - For "scoreExplanation", describe in 1–2 sentences why the overall score is what it is.
        - For "subScoreExplanations", explain each subscore in 1 sentence focusing on the visual or detected issues.
        - "recommendedProducts" must only include products that would improve the user's current condition, NOT duplicates of their current routine, and must be products from known brands (e.g. CeraVe, Neutrogena, Balea etc.).
        - "thingsToAvoid" should list habits or ingredients that could worsen their issues.
        - "lifestyleHabitsToImplementOrChange" should list practical daily habits for better skin.
        
        You are an API that must return ONLY valid JSON.
        - The JSON must be syntactically valid.
        - Use double quotes for all keys and string values.
        - Do not include comments, trailing commas, or any extra characters.
        - Do not include explanations, markdown, or text outside of the JSON.
        - The top-level object must match *exactly* this structure:
        
        {
          "analysisSucceeded": boolean,
          "skinHealthScore": number,
          "subScores": {
            "hydration": number,
            "acne": number,
            "redness": number,
            "texture": number,
            "wrinkles": number
          },
          "scoreExplanation": string,
          "subScoreExplanations": {
            "hydration": string,
            "acne": string,
            "redness": string,
            "texture": string,
            "wrinkles": string
          },
          "explanation": string,
          "stepByStepPlan": [
            {
              "day": number,
              "morning": string,
              "afternoon": string
            }
          ],
          "recommendedProducts": string[],
          "thingsToAvoid": string,
          "lifestyleHabitsToImplementOrChange": string
        }
        `;          

        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
              });
            const response = await res.json();

            setResult(response.choices[0].message.content || "No response");
            setAnalysisResult(response.choices[0].message.content ?? "No response");

            const parsed = JSON.parse(response.choices[0].message.content!);
            const products = parsed.recommendedProducts;
            
            localStorage.setItem("result", response.choices[0].message.content ?? "");
            
            const productResponses = await Promise.all(
              products.slice(0, 2).map(async (product: any) => {
                try {
                  const query = encodeURIComponent(product.name || product);
                  const res = await fetch(
                    `/api/products?q=${query}`,
                    {
                      method: "GET",
                    //   headers: {
                    //     "x-rapidapi-key": rapidapiKey,
                    //     "x-rapidapi-host": "amazon-product-search-api1.p.rapidapi.com",
                    //   },
                    }
                  );
            
                  const data = await res.json();
                  const firstResult = data.results?.[0];
            
                  if (!firstResult) return null;
            
                  return {
                    name: firstResult.name,
                    image: firstResult.image,
                    price: firstResult.original_price?.price_string || firstResult.price || "N/A",
                    url: firstResult.url,
                  };
                } catch (error) {
                  console.error(`Error fetching product: ${product.name}`, error);
                  return null;
                }
              })
            );
            
            // Filter out failed/null results
            const productsToSave = productResponses.filter(Boolean);
            
            console.log("Fetched product data:", productsToSave);

            const jsonProducts = JSON.stringify(productsToSave);

            await fetch("/api/save-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: storedUser.id, result: response.choices[0].message.content, image_base64: base64img, recommendedProducts: jsonProducts }),
              });

            router.push('/dashboard');

        } catch (err) {
            console.error(err);
            setResult("Error calling OpenAI");
        } finally {
            setLoading(false);
        }
    };

    if (!loading) {
        return (
            <main className="p-8 max-w-3xl mx-auto space-y-10">
                <h1 className="text-3xl font-bold">Skin Analysis</h1>
    
   
                <Alert variant="default" className="mb-4">
                <AlertTitle>Heads up!</AlertTitle>
                <MessageCircleWarning/>
                <AlertDescription>
                    <p>
                        Please upload a <span className="font-semibold underline">well lit</span> photo showing your <span className="font-semibold underline">entire face</span> so we can give you the most accurate skin analysis.
                    </p>
                </AlertDescription>
                </Alert>
                {/* Upload */}
                <div className="flex justify-center">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className="w-full border border-dashed  rounded-lg-md p-4 flex flex-col items-center justify-center"
                        >
                            {previewUrls[i] ? (
                                <>
                                    <img
                                        src={previewUrls[i]!}
                                        alt=""
                                        className="min-w-full min-h-[160px] object-cover rounded"
                                        />
                                    <button
                                        onClick={() => handleImageChange(i, null)}
                                        className="mt-2 text-sm text-red-500"
                                    >
                                        Remove
                                    </button>
                                </>
                            ) : (
                                <>
                                    <label className="cursor-pointer text-sm text-gray-500">
                                        <span>Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleImageChange(i, e.target.files?.[0] || null)
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                    ))}
                </div>
    
                {/* Questionnaire */}
                <div className="space-y-4">
                    <input
                        type="number"
                        placeholder="Age"
                        name="age"
                        value={form.age}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                    />
    
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                    </select>
    
                    <select
                        name="skinType"
                        value={form.skinType}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                    >
                        <option value="">Skin Type</option>
                        <option value="dry">Dry</option>
                        <option value="oily">Oily</option>
                        <option value="combination">Combination</option>
                        <option value="sensitive">Sensitive</option>
                    </select>
    
                    <input
                        name="conditions"
                        placeholder="Existing conditions (comma separated)"
                        value={form.conditions}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                    />
    
                    <input
                        name="lifestyle"
                        placeholder="Lifestyle (smoker, sun exposure, etc)"
                        value={form.lifestyle}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                    />
    
                    <textarea
                        name="routine"
                        placeholder="Current skincare routine"
                        value={form.routine}
                        onChange={handleFormChange}
                        className="border  rounded-lg p-2 w-full"
                        rows={4}
                    />
                </div>
    
                <button
                    disabled={!canAnalyze || loading}
                    onClick={handleAnalyze}
                    className={`w-full p-3 bg-[#BEB7A4] rounded-lg font-semibold shadow-md ${canAnalyze
                            ? "bg-[#BEB7A4] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Analyzing..." : "Analyze my skin"}
                </button>
    
                {result && (
                    <div className="mt-8 border rounded-lg p-4 whitespace-pre-wrap">
                        {result}
                    </div>
                )}
            </main>
        );
    }
   if (loading) {
        return (
            // <LoadingScreen/>
            <div className="w-[vw100] h-[vh100] flex justify-center items-center">
                <BeamAnimation/>
            </div>
        )
    }

}
