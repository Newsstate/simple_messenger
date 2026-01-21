import Link from "next/link"

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Simple Messenger</h1>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
        <Link href="/users">Users</Link>
      </div>
    </main>
  )
}
