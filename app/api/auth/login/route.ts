import { NextResponse } from 'next/server';
import { mockUser } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      token: 'jwt-auth-token-anime-stream-2026',
      user: {
        ...mockUser,
        email: body.email || mockUser.email
      }
    });
  } catch {
    return NextResponse.json({
      success: true,
      token: 'jwt-auth-token-anime-stream-2026',
      user: mockUser
    });
  }
}
