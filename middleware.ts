
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
    function middleware(request: NextRequestWithAuth) {

    let parts: any = request.nextUrl.pathname.split("/");

    if (parts.length >= 3) {
       parts = parts.slice(2).join("/");
    }

    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      request.nextauth.token?.plan === "none"
    ) {
      return NextResponse.redirect(new URL("/pricing", request.url));
    }

    if (
      request.nextUrl.pathname.startsWith(`/admin/${parts}`) &&
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
