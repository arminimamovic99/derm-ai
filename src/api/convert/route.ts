import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs"; // ensure sharp runs in server runtime

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "no file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const jpegBuffer = await sharp(buffer)
      .jpeg({ quality: 90 })
      .toBuffer();

    return new NextResponse(jpegBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "unable to convert" }, { status: 500 });
  }
}
