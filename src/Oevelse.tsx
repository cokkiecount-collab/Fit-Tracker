import { useState } from "react"
import type { Oevelse as OevelseType } from "./types"
import SaetListe from "./SaetListe"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  oevelse: OevelseType
  oevelseId: number
  dagId: number
  programId: number
  db: ReturnType<typeof useSupabase>
}

function OevelseKomponent({ oevelse, oevelseId, dagId, programId, db }: Props) {
  const [vaegt, setVaegt] = useState("")
  const [reps, setReps] = useState("")

  return (
    <>
      <h2>{oevelse.navn}</h2>

      <h3>📅 Sidste træning</h3>

      {oevelse.saet.length === 0 ? (
        <p>Ingen tidligere sæt</p>
      ) : (
        <ul>
          {[...oevelse.saet]
            .sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime())
            .slice(0, 3)
            .map((s, index) => (
              <li key={index}>
                {s.vaegt} kg × {s.reps}
                {" ("}{new Date(s.dato).toLocaleDateString("da-DK")}{")"}  
              </li>
            ))}
        </ul>
      )}

      <input
        type="number"
        placeholder="Vægt"
        value={vaegt}
        onChange={(e) => setVaegt(e.target.value)}
      />

      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        style={{ marginLeft: "10px" }}
      />

      <button
        onClick={async () => {
          if (vaegt.trim() === "" || reps.trim() === "") return

          const nyVaegt = Number(vaegt)
          const nuvaerendePR =
            oevelse.saet.length > 0
              ? Math.max(...oevelse.saet.map((s) => s.vaegt))
              : 0
          const erNyPR = nyVaegt > nuvaerendePR

          await db.opretSaet(oevelseId, dagId, programId, nyVaegt, Number(reps))

          setVaegt("")
          setReps("")

          if (erNyPR) {
            alert(`🏆 Ny PR i ${oevelse.navn}!\n\n${nyVaegt} kg`)
          }
        }}
      >
        + Tilføj sæt
      </button>

      <h3>📈 PR-historik</h3>

      <ul>
        {(() => {
          let bedsteVaegt = 0
          return [...oevelse.saet]
            .sort((a, b) => new Date(a.dato).getTime() - new Date(b.dato).getTime())
            .filter((s) => {
              if (s.vaegt > bedsteVaegt) {
                bedsteVaegt = s.vaegt
                return true
              }
              return false
            })
            .map((s, index) => (
              <li key={index}>
                🏆 {new Date(s.dato).toLocaleDateString("da-DK")} - {s.vaegt} kg
              </li>
            ))
        })()}
      </ul>

      <h3>Sæt</h3>

      <SaetListe
        saet={oevelse.saet}
        oevelseId={oevelseId}
        dagId={dagId}
        programId={programId}
        db={db}
      />
    </>
  )
}

export default OevelseKomponent
