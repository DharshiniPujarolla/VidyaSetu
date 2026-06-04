import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const allHeaders = await headers();

  return NextResponse.json({
    receivedCookies: cookieStore.getAll(),
    receivedHeaders: Object.fromEntries(allHeaders.entries()),
    reqHeaders: Object.fromEntries(req.headers.entries()),
  });
}
