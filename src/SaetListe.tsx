import { useState } from "react"
import type { Saet } from "./types"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  saet: Saet[]
  oevelseId: number
  dagId: number
  programId: number
  db: ReturnType<typeof useSupabase>
}

function SaetListe({ saet, oevelseId, dagId, programId, db }: Props) {
  const [redigerIndex, setRedigerIndex] = useState<number | null>(null)
  const [vaegt, setVaegt] = useState("")
  const [reps, setReps] = useState("")

  return (
    <ul>
      {saet.map((s, index) => (
        <li key={s.id ?? index}>
          {redigerIndex === index ? (
            <>
              <input
                type="number"
                value={vaegt}
                onChange={(e) => setVaegt(e.target.value)}
                style={{ width: "80px" }}
              />
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                style={{ width: "80px", marginLeft: "5px" }}
              />
              <button
                onClick={async () => {
                  await db.opdaterSaet(
                    s.id!,
                    Number(vaegt),
                    Number(reps),
                    oevelseId,
                    dagId,
                    programId
                  )
                  setRedigerIndex(null)
                }}
              >
                Gem
              </button>
              <button onClick={() => setRedigerIndex(null)}>Annuller</button>
            </>
          ) : (
            <>
              Sæt {index + 1}: {s.vaegt} kg × {s.reps}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setRedigerIndex(index)
                  setVaegt(s.vaegt.toString())
                  setReps(s.reps.toString())
                }}
              >
                ✏️
              </button>
              <button
                style={{ marginLeft: "5px" }}
                onClick={async () => {
                  await db.sletSaet(s.id!, oevelseId, dagId, programId)
                }}
              >
                🗑️
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default SaetListe
