import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
 
type ResponseData = {
  message: string
}


export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
   return Response.json('Hello World')
}