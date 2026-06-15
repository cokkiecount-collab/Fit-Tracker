import { useState } from "react"
import type { Bruger } from "./types"
import { supabase } from "./supabase"
type Props = {
  brugere: Bruger[]
  setBrugere: React.Dispatch<
    React.SetStateAction<Bruger[]>
  >
  setAktivBruger: (bruger: Bruger) => void
}

function LoginSide({
  brugere,
  setBrugere,
  setAktivBruger,
}: Props) {
  const [brugernavn, setBrugernavn] =
    useState("")

  const [kodeord, setKodeord] =
    useState("")

  return (
    <>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Brugernavn"
        value={brugernavn}
        onChange={(e) =>
          setBrugernavn(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Kodeord"
        value={kodeord}
        onChange={(e) =>
          setKodeord(e.target.value)
        }
      />

      <br />
      <br />

      <button
  onClick={async () => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: brugernavn,
        password: kodeord,
      })

    console.log(data)
    console.log(error)

    if (error) {
  alert(error.message)
  return
}

setAktivBruger({
  brugernavn,
  kodeord: "",
  programmer: [],
})

alert("Logget ind!")
  }}
>
  Log ind
</button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={() => {
          if (
            brugernavn.trim() === "" ||
            kodeord.trim() === ""
          )
            return

          const findes = brugere.some(
            (b) =>
              b.brugernavn === brugernavn
          )

          if (findes) {
            alert(
              "Brugernavn findes allerede"
            )
            return
          }

          const nyBruger: Bruger = {
            brugernavn,
            kodeord,
            programmer: [],
          }

          alert("Bruger oprettes")

          setBrugere([
            ...brugere,
            nyBruger,
          ])

          console.log("Ny bruger:", nyBruger)
          
          setAktivBruger(nyBruger)
        }}
      >
        Opret bruger
        <button
  style={{
    marginLeft: "10px",
  }}
  onClick={async () => {
    const { data, error } =
      await supabase.auth.signUp({
        email: brugernavn,
        password: kodeord,
      })

    console.log(data)
    console.log(error)

    if (error) {
      alert(error.message)
      return
    }

    alert(
      "Bruger oprettet i Supabase!"
    )
  }}
>
  Test Supabase
</button>
      </button>
    </>
  )
}

export default LoginSide