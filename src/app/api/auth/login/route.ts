import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { setSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = String(body.username || "").trim().toLowerCase()
    const password = String(body.password || "")

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })

    const ok = await bcrypt.compare(password, user.passHash)
    if (!ok) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })

    await setSession(user.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("login_error", e)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
