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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: kodeord,
      })

      if (error) {
        setFejl(error.message)
        return
      }

      if (data.user) {
        setAktivBruger({
          brugernavn: data.user.email ?? "",
          kodeord: "",
          programmer: [],
        })
        setUserId(data.user.id)
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: kodeord,
      })

      if (error) {
        setFejl(error.message)
        return
      }

      if (data.user) {
        setAktivBruger({
          brugernavn: data.user.email ?? "",
          kodeord: "",
          programmer: [],
        })
        setUserId(data.user.id)
      }
    }
  }

  return (
    <div>
      <h2>{erLogin ? "Log ind" : "Opret konto"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Kodeord"
        value={kodeord}
        onChange={(e) => setKodeord(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button onClick={haandterIndsend} style={{ marginLeft: "10px" }}>
        {erLogin ? "Log ind" : "Opret"}
      </button>

      {fejl && <p style={{ color: "red" }}>{fejl}</p>}

      <p>
        {erLogin ? "Ingen konto?" : "Har du allerede en konto?"}{" "}
        <button onClick={() => setErLogin(!erLogin)}>
          {erLogin ? "Opret konto" : "Log ind"}
        </button>
      </p>
    </div>
  )
}

export default LoginSide
