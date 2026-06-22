import type { Program } from "./types"

type Props = {
  programmer: Program[]
  setSide: (side: string) => void
  gaaTilTraening: (programId: number) => void
}

function OverblikSide({ programmer, setSide, gaaTilTraening }: Props) {
  const senesteDato = programmer
    .flatMap((p) => p.dage.flatMap((d) => d.oevelser.flatMap((o) => o.saet.map((s) => s.dato))))
    .sort()
    .reverse()[0] ?? null

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Fit-Tracker 💪</h1>

      <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Dine programmer</h2>

      {programmer.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p>Du har ingen programmer endnu</p>
          <button onClick={() => setSide("admin")} style={storKnap}>
            + Opret dit første program
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {programmer.map((program) => (
            <button
              key={program.id}
              onClick={() => gaaTilTraening(program.id!)}
              style={programKort}
            >
              <span style={{ fontSize: "20px" }}>💪</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>{program.navn}</div>
                <div style={{ color: "#aaa", fontSize: "14px" }}>
                  {program.dage.length} dag{program.dage.length !== 1 ? "e" : ""}
                </div>
              </div>
              <span style={{ marginLeft: "auto", color: "#4ade80", fontSize: "20px" }}>›</span>
            </button>
          ))}
        </div>
      )}

      {senesteDato && (
        <div style={{ marginTop: "24px", backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "#888" }}>Seneste træning</div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#4ade80", marginTop: "4px" }}>
            {new Date(senesteDato).toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>
      )}
    </>
  )
}

const storKnap: React.CSSProperties = {
  backgroundColor: "#4ade80", color: "#000", border: "none",
  borderRadius: "12px", padding: "16px 24px", fontSize: "16px",
  fontWeight: "bold", cursor: "pointer", width: "100%", marginTop: "12px"
}

const programKort: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "16px",
  backgroundColor: "#1e1e1e", border: "1px solid #333",
  borderRadius: "12px", padding: "20px", cursor: "pointer",
  width: "100%", color: "white"
}

export default OverblikSide
