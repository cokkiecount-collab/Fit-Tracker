import { useState } from "react"
import { supabase } from "./supabase"
import type { Bruger } from "./types"

type Props = {
  setAktivBruger: (bruger: Bruger) => void
  setUserId: (id: string) => void
}

function LoginSide({ setAktivBruger, setUserId }: Props) {
  const [email, setEmail] = useState("")
  const [kodeord, setKodeord] = useState("")
  const [erLogin, setErLogin] = useState(true)
  const [fejl, setFejl] = useState("")

  async function haandterIndsend() {
    setFejl("")

    if (erLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: kodeord })
      if (error) { setFejl(error.message); return }
      if (data.user) {
        setAktivBruger({ brugernavn: data.user.email ?? "", kodeord: "", programmer: [] })
        setUserId(data.user.id)
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password: kodeord })
      if (error) { setFejl(error.message); return }
      if (data.user) {
        setAktivBruger({ brugernavn: data.user.email ?? "", kodeord: "", programmer: [] })
        setUserId(data.user.id)
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "8px" }}>{erLogin ? "Log ind" : "Opret konto"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Kodeord"
        value={kodeord}
        onChange={(e) => setKodeord(e.target.value)}
        style={inputStyle}
      />

      <button onClick={haandterIndsend} style={loginKnap}>
        {erLogin ? "Log ind" : "Opret konto"}
      </button>

      {fejl && <p style={{ color: "#ef4444", textAlign: "center", fontSize: "14px" }}>{fejl}</p>}

      <p style={{ textAlign: "center", color: "#888", fontSize: "14px" }}>
        {erLogin ? "Ingen konto?" : "Har du allerede en konto?"}{" "}
        <button onClick={() => setErLogin(!erLogin)} style={{ background: "none", border: "none", color: "#4ade80", cursor: "pointer", fontSize: "14px" }}>
          {erLogin ? "Opret konto" : "Log ind"}
        </button>
      </p>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box"
}

const loginKnap: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  backgroundColor: "#4ade80",
  color: "#000",
  border: "none",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
}

export default LoginSide
