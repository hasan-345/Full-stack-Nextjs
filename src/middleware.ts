import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request})

    const path = request.nextUrl.pathname;

    const isPublic = path === "/sign-up" || path === "/sign-in" || path === "/"
    const verifyPath = path === "/verify"
    const verify = token?.isVerified

    if (isPublic && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (verifyPath && verify) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    

    if (path === "/" && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }


    if (path === "/" && !token) {
        return NextResponse.redirect(new URL('/sign-up', request.url))
    }

    
 
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
//matcher means all defined middleware when it runs
//when '/sign-in' runs then middleware will runs
//i will give example if you see when i am trying to redirect sign-up then it will not redirect me
export const config = {
  matcher: ['/sign-in', "/sign-up", "/dashboard/:path*","/"],
}