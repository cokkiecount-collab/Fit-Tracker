import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import type { Program, Traeningsdag, Oevelse, Saet } from "../types"

export function useSupabase(userId: string | null) {
  const [programmer, setProgrammer] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setProgrammer([])
      setLoading(false)
      return
    }
    hentAltData(userId)
  }, [userId])

  async function hentAltData(uid: string) {
    setLoading(true)

    // Hent programmer
    const { data: progData } = await supabase
      .from("programmer")
      .select("*")
      .eq("user_id", uid)
      .order("created_at")

    if (!progData) {
      setLoading(false)
      return
    }

    // Hent traeningsdage
    const { data: dageData } = await supabase
      .from("traeningsdage")
      .select("*")
      .in("program_id", progData.map((p) => p.id))
      .order("created_at")

    // Hent oevelser
    const dageIds = (dageData ?? []).map((d) => d.id)
    const { data: oevelserData } = dageIds.length > 0
      ? await supabase
          .from("oevelser")
          .select("*")
          .in("traeningsdag_id", dageIds)
          .order("created_at")
      : { data: [] }

    // Hent saet
    const oevelseIds = (oevelserData ?? []).map((o) => o.id)
    const { data: saetData } = oevelseIds.length > 0
      ? await supabase
          .from("saet")
          .select("*")
          .in("oevelse_id", oevelseIds)
          .order("dato")
      : { data: [] }

    // Byg hierarkiet op
    const byggede: Program[] = (progData ?? []).map((p) => ({
      id: p.id,
      navn: p.navn,
      dage: (dageData ?? [])
        .filter((d) => d.program_id === p.id)
        .map((d) => ({
          id: d.id,
          navn: d.navn,
          oevelser: (oevelserData ?? [])
            .filter((o) => o.traeningsdag_id === d.id)
            .map((o) => ({
              id: o.id,
              navn: o.navn,
              saet: (saetData ?? [])
                .filter((s) => s.oevelse_id === o.id)
                .map((s) => ({
                  id: s.id,
                  vaegt: s.vaegt,
                  reps: s.reps,
                  dato: s.dato,
                })),
            })),
        })),
    }))

    setProgrammer(byggede)
    setLoading(false)
  }

  // --- PROGRAM ---
  async function opretProgram(navn: string, userId: string) {
    const { data, error } = await supabase
      .from("programmer")
      .insert({ navn, user_id: userId })
      .select()
      .single()

    if (error || !data) return

    setProgrammer((prev) => [
      ...prev,
      { id: data.id, navn: data.navn, dage: [] },
    ])
  }

  async function opdaterProgram(id: number, navn: string) {
    await supabase.from("programmer").update({ navn }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) => (p.id === id ? { ...p, navn } : p))
    )
  }

  async function sletProgram(id: number) {
    await supabase.from("programmer").delete().eq("id", id)
    setProgrammer((prev) => prev.filter((p) => p.id !== id))
  }

  // --- TRAENINGSDAG ---
  async function opretDag(programId: number, navn: string) {
    const { data, error } = await supabase
      .from("traeningsdage")
      .insert({ navn, program_id: programId })
      .select()
      .single()

    if (error || !data) return

    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: [
                ...p.dage,
                { id: data.id, navn: data.navn, oevelser: [] },
              ],
            }
          : p
      )
    )
  }

  async function opdaterDag(id: number, navn: string, programId: number) {
    await supabase.from("traeningsdage").update({ navn }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === id ? { ...d, navn } : d
              ),
            }
          : p
      )
    )
  }

  async function sletDag(id: number, programId: number) {
    await supabase.from("traeningsdage").delete().eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, dage: p.dage.filter((d) => d.id !== id) }
          : p
      )
    )
  }

  // --- OEVELSE ---
  async function opretOevelse(dagId: number, programId: number, navn: string) {
    const { data, error } = await supabase
      .from("oevelser")
      .insert({ navn, traeningsdag_id: dagId })
      .select()
      .single()

    if (error || !data) return

    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: [
                        ...d.oevelser,
                        { id: data.id, navn: data.navn, saet: [] },
                      ],
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  async function opdaterOevelse(id: number, navn: string, dagId: number, programId: number) {
    await supabase.from("oevelser").update({ navn }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: d.oevelser.map((o) =>
                        o.id === id ? { ...o, navn } : o
                      ),
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  async function sletOevelse(id: number, dagId: number, programId: number) {
    await supabase.from("oevelser").delete().eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: d.oevelser.filter((o) => o.id !== id),
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  // --- SAET ---
  async function opretSaet(oevelseId: number, dagId: number, programId: number, vaegt: number, reps: number) {
    const dato = new Date().toISOString()
    const { data, error } = await supabase
      .from("saet")
      .insert({ oevelse_id: oevelseId, vaegt, reps, dato })
      .select()
      .single()

    if (error || !data) return

    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: d.oevelser.map((o) =>
                        o.id === oevelseId
                          ? {
                              ...o,
                              saet: [
                                ...o.saet,
                                { id: data.id, vaegt: data.vaegt, reps: data.reps, dato: data.dato },
                              ],
                            }
                          : o
                      ),
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  async function opdaterSaet(id: number, vaegt: number, reps: number, oevelseId: number, dagId: number, programId: number) {
    await supabase.from("saet").update({ vaegt, reps }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: d.oevelser.map((o) =>
                        o.id === oevelseId
                          ? {
                              ...o,
                              saet: o.saet.map((s) =>
                                s.id === id ? { ...s, vaegt, reps } : s
                              ),
                            }
                          : o
                      ),
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  async function sletSaet(id: number, oevelseId: number, dagId: number, programId: number) {
    await supabase.from("saet").delete().eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? {
              ...p,
              dage: p.dage.map((d) =>
                d.id === dagId
                  ? {
                      ...d,
                      oevelser: d.oevelser.map((o) =>
                        o.id === oevelseId
                          ? {
                              ...o,
                              saet: o.saet.filter((s) => s.id !== id),
                            }
                          : o
                      ),
                    }
                  : d
              ),
            }
          : p
      )
    )
  }

  return {
    programmer,
    loading,
    opretProgram,
    opdaterProgram,
    sletProgram,
    opretDag,
    opdaterDag,
    sletDag,
    opretOevelse,
    opdaterOevelse,
    sletOevelse,
    opretSaet,
    opdaterSaet,
    sletSaet,
  }
}
