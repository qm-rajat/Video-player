import { NextResponse } from 'next/server';
import { curatedLegalEpisodes } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: curatedLegalEpisodes.length,
    data: curatedLegalEpisodes
  });
}
