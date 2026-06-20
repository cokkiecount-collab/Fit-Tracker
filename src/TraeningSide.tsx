import { useState } from "react"
import type { Program, Traeningsdag, Oevelse } from "./types"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  programmer: Program[]
  db: ReturnType<typeof useSupabase>
}

function TraeningSide({ programmer, db }: Props) {
  const [valgtProgramId, setValgtProgramId] = useState<number | null>(null)
  const [valgtDagId, setValgtDagId] = useState<number | null>(null)

  const valgtProgram = programmer.find((p) => p.id === valgtProgramId) ?? null
  const valgtDag = valgtProgram?.dage.find((d) => d.id === valgtDagId) ?? null

  // Vælg program
  if (!valgtProgramId) {
    return (
      <>
        <h2 style={{ marginBottom: "16px" }}>Vælg program</h2>
        {programmer.length === 0 ? (
          <p style={{ color: "#888" }}>Ingen programmer endnu. Opret et under Rediger.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {programmer.map((program) => (
              <button
                key={program.id}
                onClick={() => setValgtProgramId(program.id!)}
                style={programKort}
              >
                <span style={{ fontSize: "24px" }}>💪</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>{program.navn}</div>
                  <div style={{ color: "#aaa", fontSize: "14px" }}>{program.dage.length} dage</div>
                </div>
                <span style={{ marginLeft: "auto", color: "#4ade80", fontSize: "20px" }}>›</span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  // Vælg dag
  if (!valgtDagId) {
    return (
      <>
        <button onClick={() => setValgtProgramId(null)} style={tilbageKnap}>← Tilbage</button>
        <h2 style={{ marginBottom: "16px" }}>{valgtProgram?.navn}</h2>
        <p style={{ color: "#888", marginBottom: "12px" }}>Vælg træningsdag:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {valgtProgram?.dage.map((dag) => (
            <button
              key={dag.id}
              onClick={() => setValgtDagId(dag.id!)}
              style={dagKort}
            >
              <span style={{ fontSize: "20px" }}>📅</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>{dag.navn}</div>
                <div style={{ color: "#aaa", fontSize: "13px" }}>{dag.oevelser.length} øvelser</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#4ade80", fontSize: "20px" }}>›</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  // Træn - vis alle øvelser på én side
  return (
    <>
      <button onClick={() => setValgtDagId(null)} style={tilbageKnap}>← Tilbage</button>
      <h2 style={{ marginBottom: "4px" }}>{valgtDag?.navn}</h2>
      <p style={{ color: "#888", marginBottom: "16px", fontSize: "14px" }}>{valgtProgram?.navn}</p>

      {valgtDag?.oevelser.length === 0 ? (
        <p style={{ color: "#888" }}>Ingen øvelser på denne dag endnu.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {valgtDag?.oevelser.map((oevelse) => (
            <OevelseKort
              key={oevelse.id}
              oevelse={oevelse}
              dagId={valgtDagId}
              programId={valgtProgramId}
              db={db}
            />
          ))}
        </div>
      )}
    </>
  )
}

function OevelseKort({
  oevelse,
  dagId,
  programId,
  db
}: {
  oevelse: Oevelse
  dagId: number
  programId: number
  db: ReturnType<typeof useSupabase>
}) {
  const [vaegt, setVaegt] = useState("")
  const [reps, setReps] = useState("")

  const sidsteSaet = [...oevelse.saet]
    .sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime())
    .slice(0, 1)[0]

  const pr = oevelse.saet.length > 0
    ? Math.max(...oevelse.saet.map((s) => s.vaegt))
    : 0

  return (
    <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "18px" }}>{oevelse.navn}</h3>
        {pr > 0 && <span style={{ color: "#facc15", fontSize: "13px" }}>🏆 PR: {pr} kg</span>}
      </div>

      {sidsteSaet && (
        <p style={{ color: "#888", fontSize: "13px", margin: "0 0 12px" }}>
          Sidst: {sidsteSaet.vaegt} kg × {sidsteSaet.reps} reps
        </p>
      )}

      {/* Tidligere sæt i dag */}
      {oevelse.saet.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {[...oevelse.saet]
            .sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime())
            .slice(0, 5)
            .map((s, i) => (
              <div key={s.id ?? i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #333", fontSize: "14px" }}>
                <span style={{ color: "#aaa" }}>Sæt {oevelse.saet.length - i}</span>
                <span>{s.vaegt} kg × {s.reps}</span>
              </div>
            ))}
        </div>
      )}

      {/* Log sæt */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="number"
          placeholder="Kg"
          value={vaegt}
          onChange={(e) => setVaegt(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={async () => {
            if (!vaegt || !reps) return
            const nyVaegt = Number(vaegt)
            const erNyPR = nyVaegt > pr
            await db.opretSaet(oevelse.id!, dagId, programId, nyVaegt, Number(reps))
            setVaegt("")
            setReps("")
            if (erNyPR) alert(`🏆 Ny PR i ${oevelse.navn}!\n${nyVaegt} kg`)
          }}
          style={logKnap}
        >
          + Log
        </button>
      </div>
    </div>
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

const programKort: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  backgroundColor: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: "12px",
  padding: "20px",
  cursor: "pointer",
  width: "100%",
  color: "white"
}

const dagKort: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  backgroundColor: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: "12px",
  padding: "16px",
  cursor: "pointer",
  width: "100%",
  color: "white"
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2a",
  color: "white",
  fontSize: "16px"
}

const logKnap: React.CSSProperties = {
  backgroundColor: "#4ade80",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  padding: "12px 16px",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer"
}

export default TraeningSide
