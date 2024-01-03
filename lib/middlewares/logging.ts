import { NextResponse, NextRequest } from 'next/server';

export default async function Logging(
  setContext,
  req: NextRequest
): Promise<NextResponse> {
  console.log(`Received ${req.method} request to ${req.url} at ${new Date()}`);
  return NextResponse.next();
}
