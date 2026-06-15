import type { Program } from "./types"

type Props = {
  programmer: Program[]
}

function StatistikSide({
  programmer,
}: Props) {
  let tonnage = 0
  let antalDage = 0
  let antalOevelser = 0
  let antalSaet = 0

  let stoerstePR = 0
  let stoerstePROevelse = ""

  const prs: {
    oevelse: string
    vaegt: number
    reps: number
  }[] = []

  programmer.forEach((program) => {
    antalDage += program.dage.length

    program.dage.forEach((dag) => {
      antalOevelser += dag.oevelser.length

      dag.oevelser.forEach((oevelse) => {
        antalSaet += oevelse.saet.length

        oevelse.saet.forEach((saet) => {
          tonnage +=
            saet.vaegt * saet.reps

          if (
            saet.vaegt > stoerstePR
          ) {
            stoerstePR = saet.vaegt
            stoerstePROevelse =
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
      <h2>Statistik</h2>

      <p>
        Samlet tonnage:
        <strong>
          {" "}
          {tonnage} kg
        </strong>
      </p>

      <p>
        Antal programmer:
        <strong>
          {" "}
          {programmer.length}
        </strong>
      </p>

      <p>
        Antal træningsdage:
        <strong>
          {" "}
          {antalDage}
        </strong>
      </p>

      <p>
        Antal øvelser:
        <strong>
          {" "}
          {antalOevelser}
        </strong>
      </p>

      <p>
        Antal sæt:
        <strong>
          {" "}
          {antalSaet}
        </strong>
      </p>

      <h3>Top PR'er</h3>

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

      <h3>Største PR</h3>

      {stoerstePR === 0 ? (
        <p>Ingen PR endnu</p>
      ) : (
        <p>
          {stoerstePROevelse}:{" "}
          <strong>
            {stoerstePR} kg
          </strong>
        </p>
      )}
    </>
  )
}

export default StatistikSide