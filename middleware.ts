// middleware.ts
import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",   // protege todo lo que cuelga de /dashboard
  ],
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lee cookies ligeras puestas por el cliente
  const role = req.cookies.get("role")?.value;         // "admin" | "user"
  const hasToken = Boolean(req.cookies.get("auth_token")?.value);

  // Si no hay sesión, manda a login
  if (!hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Intento de entrar a /dashboard/admin sin ser admin → fuera
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboadrd";
    return NextResponse.redirect(url);
  }

  // Admin entrando a /dashboard (usuario) → reenvía a su panel
  if (pathname === "/dashboard" && role === "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
