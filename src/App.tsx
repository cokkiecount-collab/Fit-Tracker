import { useEffect, useState } from "react"
import LoginSide from "./LoginSide"
import OverblikSide from "./OverblikSide"
import TraeningSide from "./TraeningSide"
import AdminSide from "./AdminSide"
import StatistikSide from "./StatistikSide"
import { supabase } from "./supabase"
import { useSupabase } from "./hooks/useSupabase"
import type { Bruger } from "./types"

function App() {
  const [side, setSide] = useState("overblik")
  const [aktivBruger, setAktivBruger] = useState<Bruger | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const db = useSupabase(userId)

  useEffect(() => {
    async function hentBruger() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setAktivBruger({ brugernavn: user.email, kodeord: "", programmer: [] })
        setUserId(user.id)
      }
    }
    hentBruger()
  }, [])

  if (!aktivBruger) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center" }}>Fit-Tracker 💪</h1>
        <LoginSide setAktivBruger={setAktivBruger} setUserId={setUserId} />
      </div>
    )
  }

  if (db.loading) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
        <h1>Fit-Tracker 💪</h1>
        <p>Henter data...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px", paddingBottom: "80px" }}>
      {side === "overblik" && <OverblikSide programmer={db.programmer} setSide={setSide} />}
      {side === "traening" && <TraeningSide programmer={db.programmer} db={db} />}
      {side === "admin" && <AdminSide programmer={db.programmer} userId={userId!} db={db} />}
      {side === "statistik" && <StatistikSide programmer={db.programmer} />}

      {/* Bundmenu */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        backgroundColor: "#1a1a1a",
        padding: "12px 0",
        borderTop: "1px solid #333"
      }}>
        <button onClick={() => setSide("overblik")} style={navKnap(side === "overblik")}>
          🏠 Hjem
        </button>
        <button onClick={() => setSide("traening")} style={navKnap(side === "traening")}>
          💪 Træn
        </button>
        <button onClick={() => setSide("statistik")} style={navKnap(side === "statistik")}>
          📈 Stats
        </button>
        <button onClick={() => setSide("admin")} style={navKnap(side === "admin")}>
          ⚙️ Rediger
        </button>
      </div>
    </div>
  )
}

function navKnap(aktiv: boolean) {
  return {
    background: "none",
    border: "none",
    color: aktiv ? "#4ade80" : "#888",
    fontSize: "13px",
    fontWeight: aktiv ? "bold" : "normal",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "2px"
  }
}

export default App
