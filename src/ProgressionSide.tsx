import type { Oevelse } from "./types"

type Props = {
  oevelse: Oevelse
}

function ProgressionSide({
  oevelse,
}: Props) {
  const saet = [...oevelse.saet]

  saet.sort(
    (a, b) =>
      new Date(a.dato).getTime() -
      new Date(b.dato).getTime()
  )

  return (
    <>
      <h2>
        Progression - {oevelse.navn}
      </h2>

      {saet.length === 0 ? (
        <p>Ingen data endnu</p>
      ) : (
        <ul>
          {saet.map(
            (s, index) => (
              <li key={index}>
                {new Date(
                  s.dato
                ).toLocaleDateString(
                  "da-DK"
                )}
                {" - "}
                {s.vaegt} kg ×{" "}
                {s.reps}
              </li>
            )
          )}
        </ul>
      )}
    </>
  )
}

export default ProgressionSide