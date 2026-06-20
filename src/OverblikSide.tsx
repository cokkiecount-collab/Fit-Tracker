import type { Program } from "./types"

type Props = {
  programmer: Program[]
  setSide: (side: string) => void
  gaaTilTraening: (programId: number) => void
}

function OverblikSide({ programmer, setSide, gaaTilTraening }: Props) {
  let tonnage = 0
  let senesteDato = ""

  programmer.forEach((program) => {
    program.dage.forEach((dag) => {
      dag.oevelser.forEach((oevelse) => {
        oevelse.saet.forEach((saet) => {
          tonnage += saet.vaegt * saet.reps
          if (saet.dato > senesteDato) {
            senesteDato = saet.dato
          }
        })
      })
    })
  })

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

      <div style={{ marginTop: "32px", backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: "16px" }}>📈 Overblik</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4ade80" }}>{programmer.length}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Programmer</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4ade80" }}>{tonnage.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Kg løftet</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4ade80" }}>
              {senesteDato ? new Date(senesteDato).toLocaleDateString("da-DK", { day: "numeric", month: "short" }) : "-"}
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>Seneste træning</div>
          </div>
        </div>
      </div>
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
