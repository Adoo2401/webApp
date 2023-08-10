import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(


  function middleware(request: NextRequestWithAuth) {
    
    if(request.nextUrl.pathname.startsWith("/dashboard") && !request.nextauth.token?.plan){
              return NextResponse.redirect( new URL("/",request.url))
    } 

    if(request.nextUrl.pathname.startsWith("/api/getSheet")){
  
       const requestHeaders = new Headers(request.headers);
       requestHeaders.set("Authorization",request?.nextauth?.token?.id as string);
       return NextResponse.next({headers:requestHeaders});

    }

  },

  {
    callbacks: {
      authorized:({token}) => !!token
    },

    pages: {
      signIn: "/",
    },
  }
);

export const config = { matcher: ["/dashboard","/admin","/api/getSheet"] };
