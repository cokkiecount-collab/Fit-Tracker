import { useState } from "react"
import type { Program, Oevelse } from "./types"
import type { useSupabase } from "./hooks/useSupabase"

type Props = {
  programmer: Program[]
  userId: string
  db: ReturnType<typeof useSupabase>
}

function TraeningSide({ programmer, userId, db }: Props) {
  const [valgtProgramId, setValgtProgramId] = useState<number | null>(null)
  const [valgtDagId, setValgtDagId] = useState<number | null>(null)
  const [aktivSessionId, setAktivSessionId] = useState<number | null>(null)
  const [dagSaet, setDagSaet] = useState<any[]>([])

  const valgtProgram = programmer.find((p) => p.id === valgtProgramId) ?? null
  const valgtDag = valgtProgram?.dage.find((d) => d.id === valgtDagId) ?? null

  if (!valgtProgramId) {
    return (
      <>
        <h2 style={{ marginBottom: "16px" }}>Vælg program</h2>
        {programmer.length === 0 ? (
          <p style={{ color: "#888" }}>Ingen programmer endnu. Opret et under Rediger.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {programmer.map((program) => (
              <button key={program.id} onClick={() => setValgtProgramId(program.id!)} style={programKort}>
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

  if (!valgtDagId) {
    return (
      <>
        <button onClick={() => setValgtProgramId(null)} style={tilbageKnap}>← Tilbage</button>
        <h2 style={{ marginBottom: "16px" }}>{valgtProgram?.navn}</h2>
        <p style={{ color: "#888", marginBottom: "12px" }}>Vælg træningsdag:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {valgtProgram?.dage.map((dag) => (
            <button key={dag.id} onClick={() => {
              setValgtDagId(dag.id!)
              setAktivSessionId(null)
              setDagSaet([])
            }} style={dagKort}>
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

  return (
    <>
      <button onClick={() => {
        setValgtDagId(null)
        setAktivSessionId(null)
        setDagSaet([])
      }} style={tilbageKnap}>← Tilbage</button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ margin: 0 }}>{valgtDag?.navn}</h2>
          <p style={{ color: "#888", fontSize: "14px", margin: "4px 0 0" }}>{valgtProgram?.navn}</p>
        </div>
        {aktivSessionId ? (
          <button
            onClick={async () => {
              await db.afslutSession()
              setAktivSessionId(null)
              setDagSaet([])
              setValgtDagId(null)
            }}
            style={afslutKnap}
          >
            ✓ Afslut træning
          </button>
        ) : (
          <button
            onClick={async () => {
              const id = await db.startSession(valgtDagId, userId)
              if (id) setAktivSessionId(id)
            }}
            style={startKnap}
          >
            ▶ Start træning
          </button>
        )}
      </div>

      {!aktivSessionId ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p style={{ fontSize: "40px" }}>💪</p>
          <p>Tryk "Start træning" for at begynde</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {valgtDag?.oevelser.map((oevelse) => (
            <OevelseKort
              key={oevelse.id}
              oevelse={oevelse}
              dagId={valgtDagId}
              programId={valgtProgramId}
              sessionId={aktivSessionId}
              dagSaet={dagSaet.filter((s) => s.oevelse_id === oevelse.id!)}
              setDagSaet={setDagSaet}
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
  sessionId,
  dagSaet,
  setDagSaet,
  db
}: {
  oevelse: Oevelse
  dagId: number
  programId: number
  sessionId: number
  dagSaet: any[]
  setDagSaet: React.Dispatch<React.SetStateAction<any[]>>
  db: ReturnType<typeof useSupabase>
}) {
  const [vaegt, setVaegt] = useState("")
  const [reps, setReps] = useState("")

  // Reminder fra seneste session
  const sidsteSaet = oevelse.saet.length > 0
    ? [...oevelse.saet].sort((a, b) => new Date(b.dato).getTime() - new Date(a.dato).getTime())[0]
    : null

  // PR fra alle historiske saet
  const pr = oevelse.prVaegt ?? 0

  return (
    <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, fontSize: "18px" }}>{oevelse.navn}</h3>
        {pr > 0 && <span style={{ color: "#facc15", fontSize: "13px" }}>🏆 PR: {pr} kg</span>}
      </div>

      {sidsteSaet && (
        <p style={{ color: "#666", fontSize: "13px", margin: "0 0 12px", fontStyle: "italic" }}>
          Sidst: {sidsteSaet.vaegt} kg × {sidsteSaet.reps} reps
        </p>
      )}

      {dagSaet.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          {dagSaet.map((s, i) => (
            <div key={s.id ?? i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #2a2a2a", fontSize: "14px" }}>
              <span style={{ color: "#aaa" }}>Sæt {i + 1}</span>
              <span>{s.vaegt} kg × {s.reps}</span>
              <button
                onClick={async () => {
                  await db.sletSaet(s.id!, oevelse.id!, dagId, programId)
                  setDagSaet((prev) => prev.filter((x) => x.id !== s.id))
                }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: "14px" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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
            await db.opretSaet(oevelse.id!, dagId, programId, nyVaegt, Number(reps), sessionId)
            const nytSaet = {
              id: Date.now(),
              vaegt: nyVaegt,
              reps: Number(reps),
              dato: new Date().toISOString(),
              oevelse_id: oevelse.id!,
              session_id: sessionId
            }
            setDagSaet((prev) => [...prev, nytSaet])
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
  background: "none", border: "none", color: "#4ade80",
  fontSize: "16px", cursor: "pointer", padding: "0", marginBottom: "16px"
}

const programKort: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "16px",
  backgroundColor: "#1e1e1e", border: "1px solid #333",
  borderRadius: "12px", padding: "20px", cursor: "pointer", width: "100%", color: "white"
}

const dagKort: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "16px",
  backgroundColor: "#1e1e1e", border: "1px solid #333",
  borderRadius: "12px", padding: "16px", cursor: "pointer", width: "100%", color: "white"
}

const inputStyle: React.CSSProperties = {
  flex: 1, padding: "12px", borderRadius: "8px",
  border: "1px solid #444", backgroundColor: "#2a2a2a",
  color: "white", fontSize: "16px"
}

const logKnap: React.CSSProperties = {
  backgroundColor: "#4ade80", color: "#000", border: "none",
  borderRadius: "8px", padding: "12px 16px", fontSize: "15px",
  fontWeight: "bold", cursor: "pointer"
}

const startKnap: React.CSSProperties = {
  backgroundColor: "#4ade80", color: "#000", border: "none",
  borderRadius: "8px", padding: "10px 16px", fontSize: "14px",
  fontWeight: "bold", cursor: "pointer"
}

const afslutKnap: React.CSSProperties = {
  backgroundColor: "#ef4444", color: "white", border: "none",
  borderRadius: "8px", padding: "10px 16px", fontSize: "14px",
  fontWeight: "bold", cursor: "pointer"
}

export default TraeningSide
