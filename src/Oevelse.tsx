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