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
  const [valgtProgramId, setValgtProgramId] = useState<number | null>(null)

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

  function gaaTilTraening(programId: number) {
    setValgtProgramId(programId)
    setSide("traening")
  }

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

  async function logUd() {
    await supabase.auth.signOut()
    setAktivBruger(null)
    setUserId(null)
    setSide("overblik")
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px", paddingBottom: "80px" }}>
      {side === "overblik" && <OverblikSide programmer={db.programmer} setSide={setSide} gaaTilTraening={gaaTilTraening} />}
      {side === "traening" && <TraeningSide programmer={db.programmer} userId={userId!} db={db} startProgramId={valgtProgramId} />}
      {side === "admin" && <AdminSide programmer={db.programmer} userId={userId!} db={db} />}
      {side === "statistik" && <StatistikSide programmer={db.programmer} alleSaet={db.alleSaet} />}
      {side === "konto" && (
        <div style={{ padding: "20px" }}>
          <h2>Konto</h2>
          <p style={{ color: "#888", marginBottom: "24px" }}>Logget ind som<br /><strong style={{ color: "white" }}>{aktivBruger.brugernavn}</strong></p>
          <button onClick={logUd} style={{
            backgroundColor: "#ef4444", color: "white", border: "none",
            borderRadius: "10px", padding: "14px 24px", fontSize: "16px",
            fontWeight: "bold", cursor: "pointer", width: "100%"
          }}>
            Log ud
          </button>
        </div>
      )}

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-around",
        backgroundColor: "#1a1a1a", padding: "12px 0", borderTop: "1px solid #333"
      }}>
        <button onClick={() => setSide("overblik")} style={navKnap(side === "overblik")}>🏠 Hjem</button>
        <button onClick={() => { setValgtProgramId(null); setSide("traening") }} style={navKnap(side === "traening")}>💪 Træn</button>
        <button onClick={() => setSide("statistik")} style={navKnap(side === "statistik")}>📈 Stats</button>
        <button onClick={() => setSide("admin")} style={navKnap(side === "admin")}>⚙️ Rediger</button>
        <button onClick={() => setSide("konto")} style={navKnap(side === "konto")}>👤 Konto</button>
      </div>
    </div>
  )
}

function navKnap(aktiv: boolean) {
  return {
    background: "none", border: "none",
    color: aktiv ? "#4ade80" : "#888",
    fontSize: "13px", fontWeight: aktiv ? "bold" : "normal",
    cursor: "pointer", display: "flex", flexDirection: "column" as const,
    alignItems: "center", gap: "2px"
  }
}

export default App
