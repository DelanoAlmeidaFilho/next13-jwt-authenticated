import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("nextauth.token");
  const url = request.url;

  if (!token && url.includes("/private")) {
    return NextResponse.redirect(
      "http://localhost:3000/public/account/sign-in"
    );
  }

  if (token && url.includes("/public")) {
    return NextResponse.redirect(
      "http://localhost:3000/private/client/dashboard"
    );
  }
}
