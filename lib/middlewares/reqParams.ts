import { NextResponse, NextRequest } from 'next/server';

export default async function GetReqparams(
  setContext: (key: string, value: string) => void,
  req: NextRequest
): Promise<NextResponse> {
  const res = NextResponse.next();
  try {
    let searchParams = JSON.parse(req.nextUrl.searchParams.get('q') || '{}');
    setContext('query', JSON.stringify(searchParams));
  } catch (error) {
    console.log(error);
  }

  return res;
}
