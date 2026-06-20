import { useState } from "react"
import type { Program } from "./types"
import OevelseKomponent from "./Oevelse"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  programmer: Program[]
  userId: string
  db: ReturnType<typeof useSupabase>
}

function ProgramSide({ programmer, userId, db }: Props) {
  const [programNavn, setProgramNavn] = useState("")
  const [dagNavn, setDagNavn] = useState("")
  const [oevelseNavn, setOevelseNavn] = useState("")

  const [redigerOevelse, setRedigerOevelse] = useState<number | null>(null)
  const [nytOevelseNavn, setNytOevelseNavn] = useState("")
  const [redigerDag, setRedigerDag] = useState<number | null>(null)
  const [nytDagNavn, setNytDagNavn] = useState("")
  const [redigerProgram, setRedigerProgram] = useState<number | null>(null)
  const [nytProgramNavn, setNytProgramNavn] = useState("")

  const [valgtProgramId, setValgtProgramId] = useState<number | null>(null)
  const [valgtDagId, setValgtDagId] = useState<number | null>(null)
  const [valgtOevelseId, setValgtOevelseId] = useState<number | null>(null)

  const valgtProgram = programmer.find((p) => p.id === valgtProgramId) ?? null
  const valgtDag = valgtProgram?.dage.find((d) => d.id === valgtDagId) ?? null
  const valgtOevelse = valgtDag?.oevelser.find((o) => o.id === valgtOevelseId) ?? null

  if (valgtProgramId === null) {
    return (
      <>
        <h2>Programmer</h2>

        <input
          type="text"
          placeholder="Programnavn"
          value={programNavn}
          onChange={(e) => setProgramNavn(e.target.value)}
        />

        <button
          onClick={async () => {
            if (programNavn.trim() === "") return
            await db.opretProgram(programNavn, userId)
            setProgramNavn("")
          }}
        >
          + Opret program
        </button>

        <ul>
          {programmer.map((program) => (
            <li key={program.id}>
              {redigerProgram === program.id ? (
                <>
                  <input
                    value={nytProgramNavn}
                    onChange={(e) => setNytProgramNavn(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (nytProgramNavn.trim() === "") return
                      await db.opdaterProgram(program.id!, nytProgramNavn)
                      setRedigerProgram(null)
                      setNytProgramNavn("")
                    }}
                  >
                    Gem
                  </button>
                  <button onClick={() => { setRedigerProgram(null); setNytProgramNavn("") }}>
                    Annuller
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setValgtProgramId(program.id!)}>
                    {program.navn}
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => { setRedigerProgram(program.id!); setNytProgramNavn(program.navn) }}
                  >
                    ✏️
                  </button>
                  <button
                    style={{ marginLeft: "5px" }}
                    onClick={async () => {
                      if (!window.confirm("Slet program?")) return
                      await db.sletProgram(program.id!)
                    }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </>
    )
  }

  if (valgtDagId === null || !valgtProgram) {
    return (
      <>
        <button onClick={() => setValgtProgramId(null)}>← Tilbage</button>
        <h2>{valgtProgram?.navn}</h2>

        <input
          type="text"
          placeholder="Navn på træningsdag"
          value={dagNavn}
          onChange={(e) => setDagNavn(e.target.value)}
        />

        <button
          onClick={async () => {
            if (dagNavn.trim() === "") return
            await db.opretDag(valgtProgramId, dagNavn)
            setDagNavn("")
          }}
        >
          + Opret træningsdag
        </button>

        <ul>
          {valgtProgram?.dage.map((dag) => (
            <li key={dag.id}>
              {redigerDag === dag.id ? (
                <>
                  <input
                    value={nytDagNavn}
                    onChange={(e) => setNytDagNavn(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (nytDagNavn.trim() === "") return
                      await db.opdaterDag(dag.id!, nytDagNavn, valgtProgramId)
                      setRedigerDag(null)
                      setNytDagNavn("")
                    }}
                  >
                    Gem
                  </button>
                  <button onClick={() => { setRedigerDag(null); setNytDagNavn("") }}>
                    Annuller
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setValgtDagId(dag.id!)}>{dag.navn}</button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => { setRedigerDag(dag.id!); setNytDagNavn(dag.navn) }}
                  >
                    ✏️
                  </button>
                  <button
                    style={{ marginLeft: "5px" }}
                    onClick={async () => {
                      if (!window.confirm("Slet træningsdag?")) return
                      await db.sletDag(dag.id!, valgtProgramId)
                    }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </>
    )
  }

  if (valgtOevelseId === null || !valgtDag) {
    return (
      <>
        <button onClick={() => setValgtDagId(null)}>← Tilbage</button>
        <h2>{valgtDag?.navn}</h2>

        <input
          type="text"
          placeholder="Øvelsesnavn"
          value={oevelseNavn}
          onChange={(e) => setOevelseNavn(e.target.value)}
        />

        <button
          onClick={async () => {
            if (oevelseNavn.trim() === "") return
            await db.opretOevelse(valgtDagId, valgtProgramId, oevelseNavn)
            setOevelseNavn("")
          }}
        >
          + Opret øvelse
        </button>

        <ul>
          {valgtDag?.oevelser.map((oevelse) => (
            <li key={oevelse.id}>
              {redigerOevelse === oevelse.id ? (
                <>
                  <input
                    value={nytOevelseNavn}
                    onChange={(e) => setNytOevelseNavn(e.target.value)}
                  />
                  <button
                    onClick={async () => {
                      if (nytOevelseNavn.trim() === "") return
                      await db.opdaterOevelse(oevelse.id!, nytOevelseNavn, valgtDagId, valgtProgramId)
                      setRedigerOevelse(null)
                      setNytOevelseNavn("")
                    }}
                  >
                    Gem
                  </button>
                  <button onClick={() => { setRedigerOevelse(null); setNytOevelseNavn("") }}>
                    Annuller
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setValgtOevelseId(oevelse.id!)}>{oevelse.navn}</button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => { setRedigerOevelse(oevelse.id!); setNytOevelseNavn(oevelse.navn) }}
                  >
                    ✏️
                  </button>
                  <button
                    style={{ marginLeft: "5px" }}
                    onClick={async () => {
                      if (!window.confirm("Slet øvelse?")) return
                      await db.sletOevelse(oevelse.id!, valgtDagId, valgtProgramId)
                    }}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </>
    )
  }

  if (!valgtOevelse) return null

  return (
    <>
      <button onClick={() => setValgtOevelseId(null)}>← Tilbage</button>
      <OevelseKomponent
        oevelse={valgtOevelse}
        oevelseId={valgtOevelseId}
        dagId={valgtDagId}
        programId={valgtProgramId}
        db={db}
      />
    </>
  )
}

export default ProgramSide
