import { NextResponse } from 'next/server';
import { mockUser } from '@/lib/data';

export async function GET() {
  return NextResponse.json({
    success: true,
    user: mockUser
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    token: 'jwt-token-anime-stream-2026',
    user: mockUser
  });
}
