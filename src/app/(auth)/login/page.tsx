"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const r = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data?.error || "Login failed")
        setLoading(false)
        return
      }
      r.push("/users")
    } catch (e) {
      console.error("login_ui_error", e)
      setErr("Network error")
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>
        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
      </form>
    </main>
  )
}
