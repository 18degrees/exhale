import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export {default} from 'next-auth/middleware'

export const config = {
    matcher: '/:path?'
}

const protectedPaths = ['/admin']

type environment = "production" | "development"

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPathProtected = protectedPaths.includes(path)

    if (isPathProtected) {
        const session = await getToken({req: request, secret: process.env.NEXTAUTH_SECRET})
    
        if (!session) {
            const origin = request.nextUrl.origin

            return NextResponse.redirect(`${origin}/api/auth/signin?callbackUrl=${path}`, 308)
        }

    }
    const currentEnv = process.env.NODE_ENV as environment

    const isHttps = request.nextUrl.protocol === "https:"
    const isLocalhost = request.nextUrl.origin.includes("localhost")

    if (currentEnv === 'production' && !isLocalhost && !isHttps) {
        const newUrl = new URL(request.nextUrl.href)

        newUrl.protocol = "https:"

        return NextResponse.redirect(newUrl.href, 301)
    }
}