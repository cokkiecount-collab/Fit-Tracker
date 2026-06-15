import { useState } from "react"
import type { Oevelse as OevelseType } from "./types"
import SaetListe from "./SaetListe"

type Props = {
  oevelse: OevelseType
    gemOevelse: (
        oevelse: OevelseType
          ) => void
          }

          function OevelseKomponent({
            oevelse,
              gemOevelse,
              }: Props) {
                const [vaegt, setVaegt] = useState("")
                  const [reps, setReps] = useState("")

                    return (
                        <>
                              <h2>{oevelse.navn}</h2>

                                    <input
                                            type="number"
                                                    placeholder="Vægt"
                                                            value={vaegt}
                                                                    onChange={(e) =>
                                                                              setVaegt(e.target.value)
                                                                                      }
                                                                                            />

                                                                                                  <input
                                                                                                          type="number"
                                                                                                                  placeholder="Reps"
                                                                                                                          value={reps}
                                                                                                                                  onChange={(e) =>
                                                                                                                                            setReps(e.target.value)
                                                                                                                                                    }
                                                                                                                                                            style={{ marginLeft: "10px" }}
                                                                                                                                                                  />

                                                                                                                                                                        <button
                                                                                                                                                                                onClick={() => {
                                                                                                                                                                                          if (
                                                                                                                                                                                                      vaegt.trim() === "" ||
                                                                                                                                                                                                                  reps.trim() === ""
                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                        return

                                                                                                                                                                                                                                                  gemOevelse({
                                                                                                                                                                                                                                                              ...oevelse,
                                                                                                                                                                                                                                                                          saet: [
                                                                                                                                                                                                                                                                                        ...oevelse.saet,
                                                                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                                                                                      vaegt: Number(vaegt),
                                                                                                                                                                                                                                                                                                                                      reps: Number(reps),
                                                                                                                                                                                                                                                                                                                                      dato: new Date().toISOString(),
                                                                                                                                                                                                                                                                                                                                                    },
                                                                                                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                                                                                                                          })

                                                                                                                                                                                                                                                                                                                                                                                    setVaegt("")
                                                                                                                                                                                                                                                                                                                                                                                              setReps("")
                                                                                                                                                                                                                                                                                                                                                                                                      }}
                                                                                                                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                                                                                                                    + Tilføj sæt
                                                                                                                                                                                                                                                                                                                                                                                                                          </button>

                                                                                                                                                                                                                                                                                                                                                                                                                                <h3>Sæt</h3>
<h3>Progression</h3>

<ul>
  {(() => {
    let bedsteVaegt = 0

    return [...oevelse.saet]
      .sort(
        (a, b) =>
          new Date(a.dato).getTime() -
          new Date(b.dato).getTime()
      )
      .filter((s) => {
        if (
          s.vaegt > bedsteVaegt
        ) {
          bedsteVaegt =
            s.vaegt
          return true
        }

        return false
      })
      .map((s, index) => (
        <li key={index}>
          🏆{" "}
          {new Date(
            s.dato
          ).toLocaleDateString(
            "da-DK"
          )}
          {" - "}
          {s.vaegt} kg
        </li>
      ))
  })()}
</ul>
                                                                                                                                                                                                                                                                                                                                                                                                                                      <SaetListe
  saet={oevelse.saet}
  gemSaet={(nyeSaet) =>
    gemOevelse({
      ...oevelse,
      saet: nyeSaet,
    })
  }
/>
                                                                                                                                                                                                                                                                                                                                                                                                                                          </>
                                                                                                                                                                                                                                                                                                                                                                                                                                            )
                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                            export default OevelseKomponent