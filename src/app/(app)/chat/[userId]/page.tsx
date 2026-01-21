"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

type Msg = { id: string; senderId: string; receiverId: string; content: string; createdAt: string }

export default function ChatPage({ params }: { params: { userId: string } }) {
  const otherId = params.userId
  const r = useRouter()
  const [me, setMe] = useState<{ id: string; username: string } | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  async function loadMe() {
    const meRes = await fetch("/api/me")
    if (!meRes.ok) {
      r.push("/login")
      return null
    }
    const meData = await meRes.json()
    setMe(meData.me)
    return meData.me as { id: string; username: string }
  }

  async function loadMessages() {
    try {
      const res = await fetch(`/api/messages/${otherId}`)
      const data = await res.json()
      if (!res.ok) {
        setErr(data?.error || "Failed to load messages")
        return
      }
      setMessages(data.messages || [])
    } catch (e) {
      console.error("chat_load_error", e)
      setErr("Network error")
    }
  }

  async function send() {
    const content = text.trim()
    if (!content) return
    setText("")
    setErr(null)
    try {
      const res = await fetch(`/api/messages/${otherId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data?.error || "Send failed")
        return
      }
      setMessages((m) => [...m, data.msg])
    } catch (e) {
      console.error("chat_send_error", e)
      setErr("Network error")
    }
  }

  useEffect(() => {
    ;(async () => {
      const m = await loadMe()
      if (!m) return
      await loadMessages()
    })()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  useEffect(() => {
    const t = setInterval(() => {
      loadMessages()
    }, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <main style={{ padding: 24, maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <button onClick={() => r.push("/users")}>Back</button>
        <div style={{ fontWeight: 700 }}>Chat</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{me ? `@${me.username}` : ""}</div>
      </div>

      {err ? <div style={{ color: "crimson", marginTop: 12 }}>{err}</div> : null}

      <div
        style={{
          height: "65vh",
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 12,
          marginTop: 12,
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          {messages.map((m) => {
            const mine = m.senderId === me?.id
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    background: mine ? "#f3f3f3" : "white",
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") send()
          }}
        />
        <button onClick={send}>Send</button>
      </div>
    </main>
  )
}
