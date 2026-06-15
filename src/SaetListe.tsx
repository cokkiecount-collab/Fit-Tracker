import { useState } from "react"

import type { Saet } from "./types"

type Props = {
  saet: Saet[]
  gemSaet: (nyeSaet: Saet[]) => void
}

function SaetListe({
  saet,
  gemSaet,
}: Props) {
  const [redigerIndex, setRedigerIndex] =
    useState<number | null>(null)

  const [vaegt, setVaegt] = useState("")
  const [reps, setReps] = useState("")

  return (
    <ul>
      {saet.map((s, index) => (
        <li key={index}>
          {redigerIndex === index ? (
            <>
              <input
                type="number"
                value={vaegt}
                onChange={(e) =>
                  setVaegt(e.target.value)
                }
                style={{ width: "80px" }}
              />

              <input
                type="number"
                value={reps}
                onChange={(e) =>
                  setReps(e.target.value)
                }
                style={{
                  width: "80px",
                  marginLeft: "5px",
                }}
              />

              <button
                onClick={() => {
                  const nyeSaet = [...saet]

                  nyeSaet[index] = {
  ...nyeSaet[index],
  vaegt: Number(vaegt),
  reps: Number(reps),
}

                  gemSaet(nyeSaet)

                  setRedigerIndex(null)
                }}
              >
                Gem
              </button>

              <button
                onClick={() =>
                  setRedigerIndex(null)
                }
              >
                Annuller
              </button>
            </>
          ) : (
            <>
              Sæt {index + 1}: {s.vaegt} kg ×{" "}
              {s.reps}

              <button
                style={{
                  marginLeft: "10px",
                }}
                onClick={() => {
                  setRedigerIndex(index)
                  setVaegt(
                    s.vaegt.toString()
                  )
                  setReps(
                    s.reps.toString()
                  )
                }}
              >
                ✏️
              </button>

              <button
                style={{
                  marginLeft: "5px",
                }}
                onClick={() => {
                  const nyeSaet = [
                    ...saet,
                  ]

                  nyeSaet.splice(
                    index,
                    1
                  )

                  gemSaet(nyeSaet)
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