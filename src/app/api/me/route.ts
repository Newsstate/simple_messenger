import { NextResponse } from "next/server"
import { getUserIdFromSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const uid = await getUserIdFromSession()
  if (!uid) return NextResponse.json({ ok: false }, { status: 401 })

  const me = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, username: true, createdAt: true },
  })

  return NextResponse.json({ ok: true, me })
}
