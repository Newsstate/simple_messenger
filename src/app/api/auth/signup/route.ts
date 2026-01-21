import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { setSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = String(body.username || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (username.length < 3 || password.length < 6) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json({ ok: false, error: "Username taken" }, { status: 409 })
    }

    const passHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { username, passHash } })
    await setSession(user.id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("signup_error", e)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
