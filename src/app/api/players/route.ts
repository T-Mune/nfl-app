import { NextResponse } from 'next/server';
import { getPlayers } from '@/lib/api/sportsdata';

export async function GET() {
  try {
    const players = await getPlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}
