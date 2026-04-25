import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'aihumanizer.life';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

  if (host === `www.${CANONICAL_HOST}` || proto === 'http') {
    url.hostname = CANONICAL_HOST;
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
