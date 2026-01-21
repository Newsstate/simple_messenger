import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/signup", "/"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api")) return NextResponse.next()
  if (pathname.startsWith("/_next")) return NextResponse.next()
  if (pathname.startsWith("/favicon.ico")) return NextResponse.next()
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next()

  const token = req.cookies.get("sm_session")?.value
  if (!token) return NextResponse.redirect(new URL("/login", req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!favicon.ico).*)"],
}
