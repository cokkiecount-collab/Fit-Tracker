import { useEffect, useState } from "react"
import OverblikSide from "./OverblikSide"
import ProgramSide from "./ProgramSide"
import LoginSide from "./LoginSide"
import StatistikSide from "./StatistikSide"


import type {
  Program,
  Bruger,
} from "./types"

function App() {
  const [side, setSide] = useState("overblik")

  const [brugere, setBrugere] =
    useState<Bruger[]>(() => {
      const gemteData =
        localStorage.getItem("fittracker_brugere")

      if (gemteData) {
        return JSON.parse(gemteData)
      }

      return []
    })

  const [aktivBruger, setAktivBruger] =
    useState<Bruger | null>(null)

  useEffect(() => {
    localStorage.setItem(
      "fittracker_brugere",
      JSON.stringify(brugere)
    )
  }, [brugere])

  const programmer: Program[] =
    aktivBruger?.programmer ?? []

  const setProgrammer = (
    nyeProgrammer: Program[]
  ) => {
    if (!aktivBruger) return

    const nyeBrugere = [...brugere]

    const index = nyeBrugere.findIndex(
      (b) =>
        b.brugernavn ===
        aktivBruger.brugernavn
    )

    if (index === -1) return

    nyeBrugere[index] = {
      ...nyeBrugere[index],
      programmer: nyeProgrammer,
    }

    setBrugere(nyeBrugere)

    setAktivBruger({
      ...nyeBrugere[index],
    })
  }

  console.log("Aktiv bruger:", aktivBruger)

  if (!aktivBruger) {
    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>Fit-Tracker 💪</h1>

        <LoginSide
          brugere={brugere}
          setBrugere={setBrugere}
          setAktivBruger={setAktivBruger}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Fit-Tracker 💪</h1>

      <p>
        Logget ind som:{" "}
        <strong>
          {aktivBruger.brugernavn}
        </strong>
      </p>

      <button
        onClick={() =>
          setAktivBruger(null)
        }
      >
        Log ud
      </button>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() =>
            setSide("overblik")
          }
        >
          Overblik
        </button>

        <button
          onClick={() =>
            setSide("programmer")
          }
        >
          Programmer
        </button>

        <button
          onClick={() =>
            setSide("statistik")
          }
        >
          Statistik
        </button>

        <button
          onClick={() =>
            setSide("indstillinger")
          }
        >
          Indstillinger
        </button>
      </div>

      {side === "overblik" && (
        <OverblikSide
  programmer={programmer}
/>
      )}

      {side === "programmer" && (
        <ProgramSide
          programmer={programmer}
          setProgrammer={setProgrammer}
        />
      )}

      {side === "statistik" && (
  <StatistikSide
    programmer={programmer}
  />
)}

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