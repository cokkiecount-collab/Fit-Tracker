import { useEffect, useState } from "react"
import OverblikSide from "./OverblikSide"
import ProgramSide from "./ProgramSide"
import LoginSide from "./LoginSide"
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
        setAktivBruger({
          brugernavn: user.email,
          kodeord: "",
          programmer: [],
        })
        setUserId(user.id)
      }
    }
    hentBruger()
  }, [])

  if (!aktivBruger) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
        <h1>Fit-Tracker 💪</h1>
        <LoginSide
          setAktivBruger={(bruger) => {
            setAktivBruger(bruger)
          }}
          setUserId={setUserId}
        />
      </div>
    )
  }

  if (db.loading) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
        <h1>Fit-Tracker 💪</h1>
        <p>Henter data...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>Fit-Tracker 💪</h1>

      <p>
        Logget ind som <strong>{aktivBruger.brugernavn}</strong>
      </p>

      <button
        onClick={async () => {
          await supabase.auth.signOut()
          setAktivBruger(null)
          setUserId(null)
        }}
      >
        Log ud
      </button>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
        <button onClick={() => setSide("overblik")}>Overblik</button>
        <button onClick={() => setSide("programmer")}>Programmer</button>
        <button onClick={() => setSide("statistik")}>Statistik</button>
        <button onClick={() => setSide("indstillinger")}>Indstillinger</button>
      </div>

      {side === "overblik" && <OverblikSide programmer={db.programmer} />}

      {side === "programmer" && (
        <ProgramSide
          programmer={db.programmer}
          userId={userId!}
          db={db}
        />
      )}

      {side === "statistik" && <StatistikSide programmer={db.programmer} />}

      {side === "indstillinger" && (
        <>
          <h2>Indstillinger</h2>
          <p>Kommer snart</p>
        </>
      )}
    </div>
  )
}

export default App
