import { NextResponse, NextRequest } from 'next/server';

export default async function Logging(
  setContext: (ctx: any) => void,
  req: NextRequest
): Promise<NextResponse> {
  // console.log(`Received ${req.method} request to ${req.url} at ${new Date()}`);
  return NextResponse.next();
}
