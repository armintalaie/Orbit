

type ResponseData = {
  message: string;
};

export function GET(req: any) {
  return Response.json('Hello World');
}
