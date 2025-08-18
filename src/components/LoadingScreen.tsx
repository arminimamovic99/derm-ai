"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Admiring your beautiful face…🤩",
  "Detecting your glow potential ✨",
  "Planning your glow-up routine…🌞",
  "Analyzing pores and texture…🔍",
  "Looking for ways to make you even hotter 😏",
  "Overthinking...🤔",
  "Haaa rockic..🤣"
];

export default function LoadingScreen() {
  const [subtitle, setSubtitle] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitle((prev) => {
        const nextIndex = (phrases.indexOf(prev) + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center space-y-5 custom-bg">
      <div className="w-36 h-36 border-4 bg-[#6a80c1] border-dashed rounded-full animate-custom-bounce animate-spin shadow-lg m-3"></div>
      <h1 className="text-4xl font-semibold mt-2">Analyzing…</h1>
      <p className="text-black-300">{subtitle}</p>
    </div>
  );
}
