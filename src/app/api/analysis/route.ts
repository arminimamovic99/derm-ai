import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server"; // your server client with SERVICE_ROLE key

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Adjust column names to match your table (createdAt vs created_at)
  const { data, error } = await supabase
    .from("Analysis")
    .select("*")
    .eq("userId", userId) 
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ analysis: data });
}
