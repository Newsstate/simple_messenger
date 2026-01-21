import { NextResponse } from "next/server"
import { getUserIdFromSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, ctx: { params: { userId: string } }) {
  const uid = await getUserIdFromSession()
  if (!uid) return NextResponse.json({ ok: false }, { status: 401 })

  const otherId = String(ctx.params.userId || "")
  if (!otherId) return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: uid, receiverId: otherId },
        { senderId: otherId, receiverId: uid },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: 300,
  })

  return NextResponse.json({ ok: true, messages })
}

export async function POST(req: Request, ctx: { params: { userId: string } }) {
  const uid = await getUserIdFromSession()
  if (!uid) return NextResponse.json({ ok: false }, { status: 401 })

  const otherId = String(ctx.params.userId || "")
  const body = await req.json()
  const content = String(body.content || "").trim()

  if (!otherId || content.length < 1 || content.length > 2000) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 })
  }

  const msg = await prisma.message.create({
    data: { senderId: uid, receiverId: otherId, content },
  })

  return NextResponse.json({ ok: true, msg })
}
