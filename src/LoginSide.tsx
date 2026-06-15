import { useState } from "react"
import type { Bruger } from "./types"
import { supabase } from "./supabase"

type Props = {
  setAktivBruger: (
    bruger: Bruger
  ) => void
}

function LoginSide({
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
        type="email"
        placeholder="Email"
        value={brugernavn}
        onChange={(e) =>
          setBrugernavn(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Kodeord"
        value={kodeord}
        onChange={(e) =>
          setKodeord(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={async () => {
          const {
            error,
          } =
            await supabase.auth.signInWithPassword(
              {
                email:
                  brugernavn,
                password:
                  kodeord,
              }
            )

          if (error) {
            alert(
              error.message
            )
            return
          }

          setAktivBruger({
            brugernavn,
            kodeord: "",
            programmer: [],
          })
        }}
      >
        Log ind
      </button>

      <button
        style={{
          marginLeft: "10px",
        }}
        onClick={async () => {
          const {
            error,
          } =
            await supabase.auth.signUp(
              {
                email:
                  brugernavn,
                password:
                  kodeord,
              }
            )

          if (error) {
            alert(
              error.message
            )
            return
          }

          alert(
            "Bruger oprettet!"
          )
        }}
      >
        Opret bruger
      </button>
    </>
  )
}

export default LoginSide