import { NextResponse } from 'next/server';

export function GET(req: Request) {
  return NextResponse.json(
    { message: 'server is running fine' },
    { status: 200 }
  );
}
