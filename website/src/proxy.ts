import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * i18n routing: Italian lives at the root (no prefix), English under /en.
 * Internally every site page is under the [locale] segment, so root paths
 * are rewritten to /it/... — and direct hits on /it/... are redirected back
 * to the canonical unprefixed URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/it' || pathname.startsWith('/it/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/it/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/it${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Skip the admin panel, API, Next internals, uploaded media and any file with an extension.
  matcher: ['/((?!admin|api|_next|media|.*\\..*).*)'],
}
