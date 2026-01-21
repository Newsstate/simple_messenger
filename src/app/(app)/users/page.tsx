"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type UserRow = { id: string; username: string; createdAt: string }

export default function UsersPage() {
  const r = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [me, setMe] = useState<{ id: string; username: string } | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const others = useMemo(() => users.filter((u) => u.id !== me?.id), [users, me?.id])

  async function load() {
    setErr(null)
    try {
      const meRes = await fetch("/api/me")
      if (!meRes.ok) {
        r.push("/login")
        return
      }
      const meData = await meRes.json()
      setMe(meData.me)

      const res = await fetch("/api/users")
      const data = await res.json()
      if (!res.ok) {
        setErr(data?.error || "Failed to load users")
        return
      }
      setUsers(data.users || [])
    } catch (e) {
      console.error("users_ui_error", e)
      setErr("Network error")
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      r.push("/login")
    } catch (e) {
      console.error("logout_ui_error", e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1>Users</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>{me ? `@${me.username}` : ""}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {err ? <div style={{ color: "crimson", marginTop: 12 }}>{err}</div> : null}

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {others.map((u) => (
          <Link
            key={u.id}
            href={`/chat/${u.id}`}
            style={{ padding: 12, border: "1px solid #ddd", borderRadius: 10, textDecoration: "none" }}
          >
            <div style={{ fontWeight: 600 }}>{u.username}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{new Date(u.createdAt).toLocaleString()}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
