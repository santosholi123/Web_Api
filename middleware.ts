import { NextRequest, NextResponse } from "next/server";

function getAuthToken(request: NextRequest): string | undefined {
	const cookieToken = request.cookies.get("token")?.value;
	if (cookieToken) return cookieToken;

	const headerToken =
		request.headers.get("authorization") ||
		request.headers.get("x-auth-token") ||
		request.headers.get("x-access-token");

	if (!headerToken) return undefined;

	if (headerToken.toLowerCase().startsWith("bearer ")) {
		return headerToken.slice(7).trim();
	}

	return headerToken.trim();
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/dashboard")) {
		const token = getAuthToken(request);

		if (!token) {
			const loginUrl = request.nextUrl.clone();
			loginUrl.pathname = "/login";
			return NextResponse.redirect(loginUrl);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
