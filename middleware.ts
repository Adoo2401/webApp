
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(request: NextRequestWithAuth) {

    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      request.nextauth.token?.plan === "none"
    ) {
      return NextResponse.redirect(new URL("/pricing", request.url));
    }

    if (
      request.nextUrl.pathname.startsWith(`/admin`) &&
      request.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  },

  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },

    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/admin",
    "/api/getSheet",
    "/api/stripe",
    "/",
    "/admin/:path*",
  ],
};
