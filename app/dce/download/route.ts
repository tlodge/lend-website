import { NextResponse } from "next/server"

export function GET(request: Request) {
  const target = new URL("/documents/WP1.5%20Participant%20Information%20Sheet%20v2.0.docx", request.url)

  return NextResponse.redirect(target, 302)
}