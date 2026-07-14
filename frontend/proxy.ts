import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken");

  const publicRoutes = ["/login", "/registration"];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (pathname.startsWith("/api")) {
    const backendUrl = process.env.BACKEND_API_URL!;

    const url = new URL(pathname, backendUrl);
    url.search = request.nextUrl.search;

    return NextResponse.rewrite(url);
  }

  if (!refreshToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (refreshToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/api/:path*",
  ],
};
