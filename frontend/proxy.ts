import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    const backendUrl = process.env.BACKEND_API_URL;
    console.log("backendUrl", backendUrl);
    if (!backendUrl) {
      throw Error("No server url found");
    }

    const url = new URL(pathname, backendUrl);
    url.search = request.nextUrl.search;
    console.log("url", url);

    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: "/api/:path*",
};
