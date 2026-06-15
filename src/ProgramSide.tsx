import { useState } from "react"
import type { Program, Oevelse } from "./types"
import OevelseKomponent from "./Oevelse"

type Props = {
  programmer: Program[]
  setProgrammer: (programmer: Program[]) => void
}

function ProgramSide({
  programmer,
  setProgrammer,
}: Props) {
  const [programNavn, setProgramNavn] = useState("")
  const [dagNavn, setDagNavn] = useState("")
  const [oevelseNavn, setOevelseNavn] = useState("")

  const [redigerOevelse, setRedigerOevelse] =
    useState<number | null>(null)

  const [nytOevelseNavn, setNytOevelseNavn] =
    useState("")
  const [redigerDag, setRedigerDag] =
  useState<number | null>(null)

const [nytDagNavn, setNytDagNavn] =
  useState("")
const [redigerProgram, setRedigerProgram] =
  useState<number | null>(null)

const [nytProgramNavn, setNytProgramNavn] =
  useState("")

  const [valgtProgram, setValgtProgram] =
    useState<number | null>(null)

  const [valgtDag, setValgtDag] =
    useState<number | null>(null)

  const [valgtOevelse, setValgtOevelse] =
    useState<number | null>(null)

  if (valgtProgram === null) {
    return (
      <>
        <h2>Programmer</h2>

        <input
          type="text"
          placeholder="Programnavn"
          value={programNavn}
          onChange={(e) =>
            setProgramNavn(e.target.value)
          }
        />

        <button
          onClick={() => {
            if (programNavn.trim() === "")
              return

            setProgrammer([
              ...programmer,
              {
                navn: programNavn,
                dage: [],
              },
            ])

            setProgramNavn("")
          }}
        >
          + Opret program
        </button>

        <ul>
  {programmer.map(
    (program, index) => (
      <li key={index}>
        {redigerProgram === index ? (
          <>
            <input
              value={nytProgramNavn}
              onChange={(e) =>
                setNytProgramNavn(
                  e.target.value
                )
              }
            />

            <button
              onClick={() => {
                if (
                  nytProgramNavn.trim() === ""
                )
                  return

                const nyeProgrammer = [
                  ...programmer,
                ]

                nyeProgrammer[index].navn =
                  nytProgramNavn

                setProgrammer(
                  nyeProgrammer
                )

                setRedigerProgram(null)
                setNytProgramNavn("")
              }}
            >
              Gem
            </button>

            <button
              onClick={() => {
                setRedigerProgram(null)
                setNytProgramNavn("")
              }}
            >
              Annuller
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() =>
                setValgtProgram(index)
              }
            >
              {program.navn}
            </button>

            <button
              style={{
                marginLeft: "10px",
              }}
              onClick={() => {
                setRedigerProgram(index)
                setNytProgramNavn(
                  program.navn
                )
              }}
            >
              ✏️
            </button>

            <button
              style={{
                marginLeft: "5px",
              }}
              onClick={() => {
                if (
                  !window.confirm(
                    "Slet program?"
                  )
                )
                  return

                const nyeProgrammer = [
                  ...programmer,
                ]

                nyeProgrammer.splice(
                  index,
                  1
                )

                setProgrammer(
                  nyeProgrammer
                )
              }}
            >
              🗑️
            </button>
          </>
        )}
      </li>
    )
  )}
</ul>
      </>
    )
  }

  if (valgtDag === null) {
    return (
      <>
        <button
          onClick={() =>
            setValgtProgram(null)
          }
        >
          ← Tilbage
        </button>

        <h2>
          {programmer[valgtProgram].navn}
        </h2>

        <input
          type="text"
          placeholder="Navn på træningsdag"
          value={dagNavn}
          onChange={(e) =>
            setDagNavn(e.target.value)
          }
        />

        <button
          onClick={() => {
            if (dagNavn.trim() === "")
              return

            const nyeProgrammer = [
              ...programmer,
            ]

            nyeProgrammer[
              valgtProgram
            ].dage.push({
              navn: dagNavn,
              oevelser: [],
            })

            setProgrammer(
              nyeProgrammer
            )

            setDagNavn("")
          }}
        >
          + Opret træningsdag
        </button>

        <ul>
  {programmer[
    valgtProgram
  ].dage.map((dag, index) => (
    <li key={index}>
      {redigerDag === index ? (
        <>
          <input
            value={nytDagNavn}
            onChange={(e) =>
              setNytDagNavn(
                e.target.value
              )
            }
          />

          <button
            onClick={() => {
              if (
                nytDagNavn.trim() === ""
              )
                return

              const nyeProgrammer = [
                ...programmer,
              ]

              nyeProgrammer[
                valgtProgram
              ].dage[index].navn =
                nytDagNavn

              setProgrammer(
                nyeProgrammer
              )

              setRedigerDag(null)
              setNytDagNavn("")
            }}
          >
            Gem
          </button>

          <button
            onClick={() => {
              setRedigerDag(null)
              setNytDagNavn("")
            }}
          >
            Annuller
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() =>
              setValgtDag(index)
            }
          >
            {dag.navn}
          </button>

          <button
            style={{
              marginLeft: "10px",
            }}
            onClick={() => {
              setRedigerDag(index)
              setNytDagNavn(
                dag.navn
              )
            }}
          >
            ✏️
          </button>

          <button
            style={{
              marginLeft: "5px",
            }}
            onClick={() => {
              if (
                !window.confirm(
                  "Slet træningsdag?"
                )
              )
                return

              const nyeProgrammer = [
                ...programmer,
              ]

              nyeProgrammer[
                valgtProgram
              ].dage.splice(
                index,
                1
              )

              setProgrammer(
                nyeProgrammer
              )
            }}
          >
            🗑️
          </button>
        </>
      )}
    </li>
  ))}
</ul>
      </>
    )
  }

  if (valgtOevelse === null) {
    return (
      <>
        <button
          onClick={() =>
            setValgtDag(null)
          }
        >
          ← Tilbage
        </button>

        <h2>
          {
            programmer[valgtProgram]
              .dage[valgtDag].navn
          }
        </h2>

        <input
          type="text"
          placeholder="Øvelsesnavn"
          value={oevelseNavn}
          onChange={(e) =>
            setOevelseNavn(
              e.target.value
            )
          }
        />

        <button
          onClick={() => {
            if (
              oevelseNavn.trim() === ""
            )
              return

            const nyeProgrammer = [
              ...programmer,
            ]

            const nyOevelse: Oevelse = {
              navn: oevelseNavn,
              saet: [],
            }

            nyeProgrammer[
              valgtProgram
            ].dage[
              valgtDag
            ].oevelser.push(
              nyOevelse
            )

            setProgrammer(
              nyeProgrammer
            )

            setOevelseNavn("")
          }}
        >
          + Opret øvelse
        </button>

        <ul>
          {programmer[
            valgtProgram
          ].dage[
            valgtDag
          ].oevelser.map(
            (oevelse, index) => (
              <li key={index}>
                {redigerOevelse === index ? (
                  <>
                    <input
                      value={
                        nytOevelseNavn
                      }
                      onChange={(e) =>
                        setNytOevelseNavn(
                          e.target.value
                        )
                      }
                    />

                    <button
                      onClick={() => {
                        if (
                          nytOevelseNavn.trim() ===
                          ""
                        )
                          return

                        const nyeProgrammer =
                          [
                            ...programmer,
                          ]

                        nyeProgrammer[
                          valgtProgram
                        ].dage[
                          valgtDag
                        ].oevelser[
                          index
                        ].navn =
                          nytOevelseNavn

                        setProgrammer(
                          nyeProgrammer
                        )

                        setRedigerOevelse(
                          null
                        )

                        setNytOevelseNavn(
                          ""
                        )
                      }}
                    >
                      Gem
                    </button>

                    <button
                      onClick={() => {
                        setRedigerOevelse(
                          null
                        )

                        setNytOevelseNavn(
                          ""
                        )
                      }}
                    >
                      Annuller
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setValgtOevelse(
                          index
                        )
                      }
                    >
                      {oevelse.navn}
                    </button>

                    <button
                      style={{
                        marginLeft:
                          "10px",
                      }}
                      onClick={() => {
                        setRedigerOevelse(
                          index
                        )

                        setNytOevelseNavn(
                          oevelse.navn
                        )
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      style={{
                        marginLeft: "5px",
                      }}
                      onClick={() => {
                        if (
                          !window.confirm(
                            "Slet øvelse?"
                          )
                        )
                          return

                        const nyeProgrammer =
                          [
                            ...programmer,
                          ]

                        nyeProgrammer[
                          valgtProgram
                        ].dage[
                          valgtDag
                        ].oevelser.splice(
                          index,
                          1
                        )

                        setProgrammer(
                          nyeProgrammer
                        )
                      }}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </li>
            )
          )}
        </ul>
      </>
    )
  }

  const oevelse =
    programmer[valgtProgram]
      .dage[valgtDag]
      .oevelser[valgtOevelse]

  return (
    <>
      <button
        onClick={() =>
          setValgtOevelse(null)
        }
      >
        ← Tilbage
      </button>

      <OevelseKomponent
        oevelse={oevelse}
        gemOevelse={(nyOevelse) => {
          const nyeProgrammer = [
            ...programmer,
          ]

          nyeProgrammer[
            valgtProgram
          ].dage[
            valgtDag
          ].oevelser[
            valgtOevelse
          ] = nyOevelse

          setProgrammer(
            nyeProgrammer
          )
        }}
      />
    </>
  )
}

export default ProgramSide