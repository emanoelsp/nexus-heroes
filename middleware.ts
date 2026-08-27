import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("__session")?.value;

  const rotasProtegidas = ["/dashboard", "/criar-personagem", "/personagem"];
  const estaNaRotaProtegida = rotasProtegidas.some((r) =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (estaNaRotaProtegida) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/criar-personagem/:path*",
    "/personagem/:path*",
  ],
};
