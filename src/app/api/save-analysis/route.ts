import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const body = await req.json();  // { userId: string, result: string }

  const { data, error } = await supabase
    .from('Analysis')
    .insert({
      userId: body.userId,
      result: body.result,
    });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
