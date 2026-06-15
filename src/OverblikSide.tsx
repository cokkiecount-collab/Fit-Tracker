import type { Program } from "./types"

type Props = {
  programmer: Program[]
}

function OverblikSide({
  programmer,
}: Props) {
  let tonnage = 0

  const prs: {
    oevelse: string
    vaegt: number
    reps: number
  }[] = []

  let senesteDato = ""
  let senesteOevelse = ""

  programmer.forEach((program) => {
    program.dage.forEach((dag) => {
      dag.oevelser.forEach((oevelse) => {
        oevelse.saet.forEach((saet) => {
          tonnage +=
            saet.vaegt * saet.reps

          if (
            saet.dato > senesteDato
          ) {
            senesteDato = saet.dato
            senesteOevelse =
              oevelse.navn
          }
        })

        if (
          oevelse.saet.length > 0
        ) {
          const bedsteSaet =
            oevelse.saet.reduce(
              (
                bedste,
                nuvaerende
              ) =>
                nuvaerende.vaegt >
                bedste.vaegt
                  ? nuvaerende
                  : bedste
            )

          prs.push({
            oevelse: oevelse.navn,
            vaegt:
              bedsteSaet.vaegt,
            reps:
              bedsteSaet.reps,
          })
        }
      })
    })
  })

  return (
    <>
      <h2>Overblik</h2>

      <h3>Seneste træning</h3>

      {senesteDato === "" ? (
        <p>
          Ingen træninger endnu
        </p>
      ) : (
        <>
          <p>
            {new Date(
              senesteDato
            ).toLocaleDateString(
              "da-DK"
            )}
          </p>

          <p>
            Seneste øvelse:
            <strong>
              {" "}
              {senesteOevelse}
            </strong>
          </p>
        </>
      )}

      <h3>Nye PR'er</h3>

      {prs.length === 0 ? (
        <p>Ingen PR'er endnu</p>
      ) : (
        <ul>
          {prs.map((pr, index) => (
            <li key={index}>
              {pr.oevelse}:{" "}
              {pr.vaegt} kg ×{" "}
              {pr.reps}
            </li>
          ))}
        </ul>
      )}

      <h3>Samlet tonnage</h3>

      <p>{tonnage} kg</p>
    </>
  )
}

export default OverblikSide