"use client";

import { useEffect, useState } from "react";
import OpenAI from "openai";
import LoadingScreen from "@/components/LoadingScreen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleWarning } from "lucide-react";
import { useAnalysis } from "../../../providers/AnalysisContext";
import { useRouter } from "next/navigation";
import { auth0 } from "../../../lib/auth0";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    dangerouslyAllowBrowser: true
});

export default function AnalysisPage() {
  //  const session = await auth0.getSession();

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
      // This runs only in the browser
      const stored = localStorage.getItem("user");
      console.log({stored});
      if (stored) {
        setStoredUser(JSON.parse(stored));
      }
    }, []);

    // const userId = storedUser.id;
    // console.log({userId});
    

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
            You are a dermatologist. Analyze the user's skin based on the image and questionnaire.
            User profile:
            • Age: ${form.age}
            • Gender: ${form.gender}
            • Skin type: ${form.skinType}
            • Conditions: ${form.conditions}
            • Lifestyle: ${form.lifestyle}
            • Routine: ${form.routine}

            Photo (base64):
            ${base64img.substring(0, 10000)}  --truncated--

            Return the response in JSON please, like this:
            {
                'explanation': string,
                'stepByStepPlan': {'day1': string, 'day2': string etc},
                'recommendedProducts': string[],
                'thingsToAvoid': string,
                'lifestyleHabitsToImplementOrChange': string,
                'analysisSucceeded': boolean
            }

            disclaimer - stepByStepPlan needs to contain 14 days. Each day needs to have tasks split into morning and afternoon. Return entries for each of the 14 days please, without any fillers.
            disclaimer - Recommended should be specific (with manufacturer names and model names so I can later search for those products via amazon api)
            disclaimer - The response MUST be a valid JSON object, and not include any comments such as '//'
            `;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });

            setResult(response.choices[0].message.content || "No response");
            setAnalysisResult(response.choices[0].message.content ?? "No response");
            await fetch("/api/save-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: storedUser.id, result: response.choices[0].message.content }),
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
            <LoadingScreen/>
        )
    }

}
