import { NextResponse } from "next/server"
import { getUserIdFromSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const uid = await getUserIdFromSession()
  if (!uid) return NextResponse.json({ ok: false }, { status: 401 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, createdAt: true },
  })

  return NextResponse.json({ ok: true, users })
}
