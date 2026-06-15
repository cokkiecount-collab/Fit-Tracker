import { useState } from "react"
import type { Bruger } from "./types"

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
        onClick={() => {
          const bruger = brugere.find(
            (b) =>
              b.brugernavn === brugernavn &&
              b.kodeord === kodeord
          )

          if (!bruger) {
            alert(
              "Forkert brugernavn eller kodeord"
            )
            return
          }

          setAktivBruger(bruger)
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
      </button>
    </>
  )
}

export default LoginSide