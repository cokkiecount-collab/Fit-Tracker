import { useState } from "react"
import type { Program } from "./types"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  programmer: Program[]
  userId: string
  db: ReturnType<typeof useSupabase>
}

function AdminSide({ programmer, userId, db }: Props) {
  const [programNavn, setProgramNavn] = useState("")
  const [dagNavn, setDagNavn] = useState("")
  const [oevelseNavn, setOevelseNavn] = useState("")

  const [valgtProgramId, setValgtProgramId] = useState<number | null>(null)
  const [valgtDagId, setValgtDagId] = useState<number | null>(null)

  const [redigerProgramId, setRedigerProgramId] = useState<number | null>(null)
  const [nytProgramNavn, setNytProgramNavn] = useState("")
  const [redigerDagId, setRedigerDagId] = useState<number | null>(null)
  const [nytDagNavn, setNytDagNavn] = useState("")
  const [redigerOevelseId, setRedigerOevelseId] = useState<number | null>(null)
  const [nytOevelseNavn, setNytOevelseNavn] = useState("")

  const valgtProgram = programmer.find((p) => p.id === valgtProgramId) ?? null
  const valgtDag = valgtProgram?.dage.find((d) => d.id === valgtDagId) ?? null

  if (!valgtProgramId) {
    return (
      <>
        <h2>Rediger programmer</h2>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Nyt program..."
            value={programNavn}
            onChange={(e) => setProgramNavn(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={async () => {
              if (!programNavn.trim()) return
              await db.opretProgram(programNavn, userId)
              setProgramNavn("")
            }}
            style={grønKnap}
          >
            + Opret
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {programmer.map((program) => (
            <div key={program.id} style={kortStyle}>
              {redigerProgramId === program.id ? (
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <input
                    value={nytProgramNavn}
                    onChange={(e) => setNytProgramNavn(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={async () => {
                    await db.opdaterProgram(program.id!, nytProgramNavn)
                    setRedigerProgramId(null)
                  }} style={grønKnap}>Gem</button>
                  <button onClick={() => setRedigerProgramId(null)} style={gråKnap}>Annuller</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setValgtProgramId(program.id!)} style={tekstKnap}>
                    <strong>{program.navn}</strong>
                    <span style={{ color: "#aaa", fontSize: "13px" }}> {program.dage.length} dage ›</span>
                  </button>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setRedigerProgramId(program.id!); setNytProgramNavn(program.navn) }} style={ikonKnap}>✏️</button>
                    <button onClick={async () => {
                      if (!window.confirm("Slet program?")) return
                      await db.sletProgram(program.id!)
                    }} style={ikonKnap}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    )
  }

  if (!valgtDagId) {
    return (
      <>
        <button onClick={() => setValgtProgramId(null)} style={tilbageKnap}>← Tilbage</button>
        <h2>{valgtProgram?.navn}</h2>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Ny træningsdag..."
            value={dagNavn}
            onChange={(e) => setDagNavn(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={async () => {
              if (!dagNavn.trim()) return
              await db.opretDag(valgtProgramId, dagNavn)
              setDagNavn("")
            }}
            style={grønKnap}
          >
            + Opret
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {valgtProgram?.dage.map((dag) => (
            <div key={dag.id} style={kortStyle}>
              {redigerDagId === dag.id ? (
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <input
                    value={nytDagNavn}
                    onChange={(e) => setNytDagNavn(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={async () => {
                    await db.opdaterDag(dag.id!, nytDagNavn, valgtProgramId)
                    setRedigerDagId(null)
                  }} style={grønKnap}>Gem</button>
                  <button onClick={() => setRedigerDagId(null)} style={gråKnap}>Annuller</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setValgtDagId(dag.id!)} style={tekstKnap}>
                    <strong>{dag.navn}</strong>
                    <span style={{ color: "#aaa", fontSize: "13px" }}> {dag.oevelser.length} øvelser ›</span>
                  </button>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => { setRedigerDagId(dag.id!); setNytDagNavn(dag.navn) }} style={ikonKnap}>✏️</button>
                    <button onClick={async () => {
                      if (!window.confirm("Slet træningsdag?")) return
                      await db.sletDag(dag.id!, valgtProgramId)
                    }} style={ikonKnap}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <button onClick={() => setValgtDagId(null)} style={tilbageKnap}>← Tilbage</button>
      <h2>{valgtDag?.navn}</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Ny øvelse..."
          value={oevelseNavn}
          onChange={(e) => setOevelseNavn(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={async () => {
            if (!oevelseNavn.trim()) return
            await db.opretOevelse(valgtDagId, valgtProgramId, oevelseNavn)
            setOevelseNavn("")
          }}
          style={grønKnap}
        >
          + Opret
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {valgtDag?.oevelser.map((oevelse) => (
          <div key={oevelse.id} style={kortStyle}>
            {redigerOevelseId === oevelse.id ? (
              <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                <input
                  value={nytOevelseNavn}
                  onChange={(e) => setNytOevelseNavn(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={async () => {
                  await db.opdaterOevelse(oevelse.id!, nytOevelseNavn, valgtDagId, valgtProgramId)
                  setRedigerOevelseId(null)
                }} style={grønKnap}>Gem</button>
                <button onClick={() => setRedigerOevelseId(null)} style={gråKnap}>Annuller</button>
              </div>
            ) : (
              <>
                <span style={{ fontWeight: "bold" }}>{oevelse.navn}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => { setRedigerOevelseId(oevelse.id!); setNytOevelseNavn(oevelse.navn) }} style={ikonKnap}>✏️</button>
                  <button onClick={async () => {
                    if (!window.confirm("Slet øvelse?")) return
                    await db.sletOevelse(oevelse.id!, valgtDagId, valgtProgramId)
                  }} style={ikonKnap}>🗑️</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

const tilbageKnap: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#4ade80",
  fontSize: "16px",
  cursor: "pointer",
  padding: "0",
  marginBottom: "16px"
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "white",
  fontSize: "15px"
}

const grønKnap: React.CSSProperties = {
  backgroundColor: "#4ade80",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  fontWeight: "bold",
  cursor: "pointer"
}

const gråKnap: React.CSSProperties = {
  backgroundColor: "#444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  cursor: "pointer"
}

const kortStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "14px"
}

const tekstKnap: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
  flex: 1
}

const ikonKnap: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  padding: "4px 8px"
}

export default AdminSide
