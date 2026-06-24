import type { Program } from "./types"

type Props = {
  programmer: Program[]
  setSide: (side: string) => void
  gaaTilTraening: (programId: number) => void
}

function OverblikSide({ programmer, setSide, gaaTilTraening }: Props) {

  // Find seneste træningsdag og dato per program
  function getSenesteTraening(program: Program): { dagNavn: string; dato: string } | null {
    let senesteInfo: { dagNavn: string; dato: string } | null = null

    program.dage.forEach((dag) => {
      dag.oevelser.forEach((oevelse) => {
        oevelse.saet.forEach((saet) => {
          if (!senesteInfo || saet.dato > senesteInfo.dato) {
            senesteInfo = { dagNavn: dag.navn, dato: saet.dato }
          }
        })
      })
    })

    return senesteInfo
  }

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
          {programmer.map((program) => {
            const seneste = getSenesteTraening(program)
            return (
              <button
                key={program.id}
                onClick={() => gaaTilTraening(program.id!)}
                style={programKort}
              >
                <span style={{ fontSize: "20px" }}>💪</span>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>{program.navn}</div>
                  {seneste ? (
                    <div style={{ color: "#aaa", fontSize: "13px", marginTop: "2px" }}>
                      Sidst: <span style={{ color: "#4ade80" }}>{seneste.dagNavn}</span>
                      {" – "}
                      {new Date(seneste.dato).toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}
                    </div>
                  ) : (
                    <div style={{ color: "#555", fontSize: "13px", marginTop: "2px" }}>Ikke trænet endnu</div>
                  )}
                </div>
                <span style={{ color: "#4ade80", fontSize: "20px" }}>›</span>
              </button>
            )
          })}
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
