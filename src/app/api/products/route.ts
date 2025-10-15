import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const res = await fetch(`https://amazon-product-search-api1.p.rapidapi.com/search?q=${q}&country=us`, {
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": "amazon-product-search-api1.p.rapidapi.com",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}