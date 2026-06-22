import { useState } from "react"
import type { Program } from "./types"

type Props = {
  programmer: Program[]
  alleSaet: { vaegt: number; reps: number; dato: string; oevelse_navn: string }[]
}

type Periode = "uge" | "maaned"

function StatistikSide({ programmer, alleSaet }: Props) {
  const [periode, setPeriode] = useState<Periode>("uge")
  const [valgtOevelse, setValgtOevelse] = useState<string>("alle")

  const oevelseNavne = Array.from(new Set(alleSaet.map((s) => s.oevelse_navn))).sort()

  const filtreredeSaet = valgtOevelse === "alle"
    ? alleSaet
    : alleSaet.filter((s) => s.oevelse_navn === valgtOevelse)

  function getPeriodeNoegle(dato: string): string {
    const d = new Date(dato)
    if (periode === "uge") {
      const startAfUge = new Date(d)
      startAfUge.setDate(d.getDate() - d.getDay() + 1)
      return startAfUge.toLocaleDateString("da-DK", { day: "numeric", month: "short" })
    } else {
      return d.toLocaleDateString("da-DK", { month: "long", year: "numeric" })
    }
  }

  const tonnagePerPeriode: Record<string, number> = {}
  const prPerPeriode: Record<string, number> = {}

  for (const saet of filtreredeSaet) {
    const noegle = getPeriodeNoegle(saet.dato)
    tonnagePerPeriode[noegle] = (tonnagePerPeriode[noegle] ?? 0) + saet.vaegt * saet.reps
    prPerPeriode[noegle] = Math.max(prPerPeriode[noegle] ?? 0, saet.vaegt)
  }

  const periodeLabels = Object.keys(tonnagePerPeriode).slice(-8)
  const tonnageVaerdier = periodeLabels.map((l) => tonnagePerPeriode[l])
  const prVaerdier = periodeLabels.map((l) => prPerPeriode[l])

  const maxTonnage = Math.max(...tonnageVaerdier, 1)
  const maxPR = Math.max(...prVaerdier, 1)

  let totalTonnage = 0
  let stoerstePR = 0
  let stoerstePROevelseNavn = ""
  const prs: { oevelse: string; vaegt: number }[] = []

  programmer.forEach((program) => {
    program.dage.forEach((dag) => {
      dag.oevelser.forEach((oevelse) => {
        const pr = oevelse.prVaegt ?? 0
        if (pr > 0) prs.push({ oevelse: oevelse.navn, vaegt: pr })
        if (pr > stoerstePR) { stoerstePR = pr; stoerstePROevelseNavn = oevelse.navn }
      })
    })
  })

  alleSaet.forEach((s) => { totalTonnage += s.vaegt * s.reps })
  prs.sort((a, b) => b.vaegt - a.vaegt)

  return (
    <>
      <h2 style={{ marginBottom: "16px" }}>Statistik 📈</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <div style={kortStyle}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#4ade80" }}>{Math.round(totalTonnage).toLocaleString()}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Kg løftet i alt</div>
        </div>
        <div style={kortStyle}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#facc15" }}>{stoerstePR > 0 ? stoerstePR + " kg" : "-"}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Største PR{stoerstePROevelseNavn ? ` (${stoerstePROevelseNavn})` : ""}</div>
        </div>
        <div style={kortStyle}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#60a5fa" }}>{prs.length}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>Øvelser tracket</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={() => setPeriode("uge")} style={periode === "uge" ? aktivKnap : inaktivKnap}>Uge</button>
        <button onClick={() => setPeriode("maaned")} style={periode === "maaned" ? aktivKnap : inaktivKnap}>Måned</button>
      </div>

      <select
        value={valgtOevelse}
        onChange={(e) => setValgtOevelse(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #444", backgroundColor: "#2a2a2a", color: "white", fontSize: "15px", marginBottom: "16px" }}
      >
        <option value="alle">Alle øvelser (samlet tonnage)</option>
        {oevelseNavne.map((navn) => (
          <option key={navn} value={navn}>{navn}</option>
        ))}
      </select>

      {periodeLabels.length > 0 ? (
        <>
          <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>
            {valgtOevelse === "alle" ? "Tonnage" : valgtOevelse + " - Tonnage"} per {periode}
          </h3>
          <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
              {periodeLabels.map((_lbl, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{
                    width: "100%",
                    height: `${Math.round((tonnageVaerdier[i] / maxTonnage) * 100)}px`,
                    backgroundColor: "#4ade80",
                    borderRadius: "4px 4px 0 0",
                    minHeight: "4px"
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
              {periodeLabels.map((lbl, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "9px", color: "#666", overflow: "hidden" }}>{lbl}</div>
              ))}
            </div>
          </div>

          {valgtOevelse !== "alle" && (
            <>
              <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>{valgtOevelse} - Bedste løft per {periode}</h3>
              <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "120px" }}>
                  {periodeLabels.map((_lbl, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ fontSize: "9px", color: "#facc15" }}>{prVaerdier[i]}kg</div>
                      <div style={{
                        width: "100%",
                        height: `${Math.round((prVaerdier[i] / maxPR) * 100)}px`,
                        backgroundColor: "#facc15",
                        borderRadius: "4px 4px 0 0",
                        minHeight: "4px"
                      }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  {periodeLabels.map((lbl, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", fontSize: "9px", color: "#666", overflow: "hidden" }}>{lbl}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p>Ingen data endnu – log din første træning!</p>
        </div>
      )}

      <h3 style={{ fontSize: "15px", marginBottom: "12px" }}>🏆 Top PR'er</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {prs.slice(0, 5).map((pr, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e1e1e", borderRadius: "10px", padding: "12px 16px" }}>
            <span style={{ color: i === 0 ? "#facc15" : "#aaa" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`} {pr.oevelse}</span>
            <span style={{ fontWeight: "bold", color: "#4ade80" }}>{pr.vaegt} kg</span>
          </div>
        ))}
      </div>
    </>
  )
}

const kortStyle: React.CSSProperties = {
  flex: 1, backgroundColor: "#1e1e1e", borderRadius: "10px",
  padding: "12px", textAlign: "center"
}

const aktivKnap: React.CSSProperties = {
  backgroundColor: "#4ade80", color: "#000", border: "none",
  borderRadius: "8px", padding: "8px 16px", fontWeight: "bold", cursor: "pointer"
}

const inaktivKnap: React.CSSProperties = {
  backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444",
  borderRadius: "8px", padding: "8px 16px", cursor: "pointer"
}

export default StatistikSide
