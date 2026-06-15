import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Program, Oevelse } from "./types"
import OevelseKomponent from "./Oevelse"
import type {
  Program,
    Oevelse,
    } from "./types"

type Props = {
  programmer: Program[]
  setProgrammer: Dispatch<SetStateAction<Program[]>>
}

function ProgramSide({
  programmer,
  setProgrammer,
}: Props) {
  const [programNavn, setProgramNavn] = useState("")
  const [dagNavn, setDagNavn] = useState("")
  const [oevelseNavn, setOevelseNavn] = useState("")

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
                <button
                  onClick={() =>
                    setValgtProgram(index)
                  }
                >
                  {program.navn}
                </button>
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
              <button
                onClick={() =>
                  setValgtDag(index)
                }
              >
                {dag.navn}
              </button>
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
                <button
                  onClick={() =>
                    setValgtOevelse(
                      index
                    )
                  }
                >
                  {oevelse.navn}
                </button>
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