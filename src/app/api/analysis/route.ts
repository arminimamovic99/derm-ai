import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const all = searchParams.get("all") === "true";
    const asc = searchParams.get("asc") === "true";

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (all) {
      const { data, error } = await supabase
        .from("Analysis")
        .select("*")
        .eq("userId", userId)
        .order("created_at", { ascending: asc });

      if (error) throw error;

      return NextResponse.json({ analyses: data });
    }

    const { data, error } = await supabase
      .from("Analysis")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ analysis: data });
  } catch (err: any) {
    console.error("Supabase error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
