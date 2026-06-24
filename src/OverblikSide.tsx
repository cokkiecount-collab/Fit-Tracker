import type { Program } from "./types"

type Props = {
  programmer: Program[]
  setSide: (side: string) => void
  gaaTilTraening: (programId: number) => void
}

type SenesteInfo = {
  dagNavn: string
  dato: string
  fremgang: { tekst: string; farve: string } | null
}

function OverblikSide({ programmer, setSide, gaaTilTraening }: Props) {

  function getFremgang(seneste: number, forrige: number): { tekst: string; farve: string } | null {
    if (!forrige || !seneste) return null
    const procent = Math.round(((seneste - forrige) / forrige) * 100)
    if (procent === 0) return { tekst: "= 0%", farve: "#888" }
    if (procent > 0) return { tekst: `↑ +${procent}%`, farve: "#4ade80" }
    return { tekst: `↓ ${procent}%`, farve: "#ef4444" }
  }

  function getSenesteTraening(program: Program): SenesteInfo | null {
    let senesteInfo: SenesteInfo | null = null

    program.dage.forEach((dag) => {
      if (dag.senesteSessionDato) {
        if (!senesteInfo || dag.senesteSessionDato > senesteInfo.dato) {
          const fremgang = getFremgang(dag.senesteSessionTonnage ?? 0, dag.forrigeSessionTonnage ?? 0)
          senesteInfo = { dagNavn: dag.navn, dato: dag.senesteSessionDato, fremgang }
        }
      }
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
            const seneste: SenesteInfo | null = getSenesteTraening(program)
            return (
              <button
                key={program.id}
                onClick={() => gaaTilTraening(program.id!)}
                style={programKort}
              >
                <span style={{ fontSize: "20px" }}>💪</span>
                <div style={{ textAlign: "left", flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>{program.navn}</div>
                  {seneste !== null ? (
                    <div style={{ fontSize: "13px", marginTop: "2px", display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ color: "#aaa" }}>
                        Sidst: <span style={{ color: "#4ade80" }}>{seneste.dagNavn}</span>
                        {" – "}{new Date(seneste.dato).toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                      {seneste.fremgang !== null && (
                        <span style={{ color: seneste.fremgang.farve, fontWeight: "bold", fontSize: "13px" }}>
                          {seneste.fremgang.tekst}
                        </span>
                      )}
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
