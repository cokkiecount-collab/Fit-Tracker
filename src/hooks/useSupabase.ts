import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import type { Program, Saet } from "../types"

export type Session = {
  id: number
  traeningsdag_id: number
  dato: string
  saet: (Saet & { oevelse_id: number, session_id: number })[]
}

export function useSupabase(userId: string | null) {
  const [programmer, setProgrammer] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [aktivSession, setAktivSession] = useState<Session | null>(null)

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

    const { data: progData } = await supabase
      .from("programmer")
      .select("*")
      .eq("user_id", uid)
      .order("created_at")

    if (!progData) { setLoading(false); return }

    const { data: dageData } = await supabase
      .from("traeningsdage")
      .select("*")
      .in("program_id", progData.map((p) => p.id))
      .order("created_at")

    const dageIds = (dageData ?? []).map((d) => d.id)

    const { data: oevelserData } = dageIds.length > 0
      ? await supabase.from("oevelser").select("*").in("traeningsdag_id", dageIds).order("created_at")
      : { data: [] }

    // Hent seneste session per dag - filtrer på user_id!
    const { data: sessionerData } = dageIds.length > 0
      ? await supabase
          .from("sessioner")
          .select("*")
          .eq("user_id", uid)
          .in("traeningsdag_id", dageIds)
          .order("dato", { ascending: false })
      : { data: [] }

    console.log("Sessioner fundet:", sessionerData)

    // Find seneste session per dag
    const senesteSessionPerDag: Record<number, number> = {}
    for (const s of (sessionerData ?? [])) {
      if (!senesteSessionPerDag[s.traeningsdag_id]) {
        senesteSessionPerDag[s.traeningsdag_id] = s.id
      }
    }

    const senesteSessionIds = Object.values(senesteSessionPerDag)
    console.log("Seneste session IDs:", senesteSessionIds)

    const { data: saetData } = senesteSessionIds.length > 0
      ? await supabase.from("saet").select("*").in("session_id", senesteSessionIds).order("dato")
      : { data: [] }

    console.log("Sæt fundet:", saetData)

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
                  session_id: s.session_id,
                })),
            })),
        })),
    }))

    setProgrammer(byggede)
    setLoading(false)
  }

  // --- SESSIONER ---
  async function startSession(dagId: number, uid: string): Promise<number | null> {
    const { data, error } = await supabase
      .from("sessioner")
      .insert({ traeningsdag_id: dagId, user_id: uid, dato: new Date().toISOString() })
      .select()
      .single()

    if (error || !data) {
      console.error("Fejl ved start session:", error)
      return null
    }

    console.log("Session startet med id:", data.id)
    setAktivSession({ id: data.id, traeningsdag_id: dagId, dato: data.dato, saet: [] })
    return data.id
  }

  async function afslutSession() {
    setAktivSession(null)
    if (userId) await hentAltData(userId)
  }

  // --- PROGRAM ---
  async function opretProgram(navn: string, uid: string) {
    const { data, error } = await supabase
      .from("programmer")
      .insert({ navn, user_id: uid })
      .select()
      .single()

    if (error || !data) return
    setProgrammer((prev) => [...prev, { id: data.id, navn: data.navn, dage: [] }])
  }

  async function opdaterProgram(id: number, navn: string) {
    await supabase.from("programmer").update({ navn }).eq("id", id)
    setProgrammer((prev) => prev.map((p) => (p.id === id ? { ...p, navn } : p)))
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
        p.id === programId ? { ...p, dage: [...p.dage, { id: data.id, navn: data.navn, oevelser: [] }] } : p
      )
    )
  }

  async function opdaterDag(id: number, navn: string, programId: number) {
    await supabase.from("traeningsdage").update({ navn }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId ? { ...p, dage: p.dage.map((d) => (d.id === id ? { ...d, navn } : d)) } : p
      )
    )
  }

  async function sletDag(id: number, programId: number) {
    await supabase.from("traeningsdage").delete().eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId ? { ...p, dage: p.dage.filter((d) => d.id !== id) } : p
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
          ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: [...d.oevelser, { id: data.id, navn: data.navn, saet: [] }] } : d) }
          : p
      )
    )
  }

  async function opdaterOevelse(id: number, navn: string, dagId: number, programId: number) {
    await supabase.from("oevelser").update({ navn }).eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: d.oevelser.map((o) => o.id === id ? { ...o, navn } : o) } : d) }
          : p
      )
    )
  }

  async function sletOevelse(id: number, dagId: number, programId: number) {
    await supabase.from("oevelser").delete().eq("id", id)
    setProgrammer((prev) =>
      prev.map((p) =>
        p.id === programId
          ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: d.oevelser.filter((o) => o.id !== id) } : d) }
          : p
      )
    )
  }

  // --- SAET ---
  async function opretSaet(oevelseId: number, dagId: number, programId: number, vaegt: number, reps: number, sessionId: number) {
    const dato = new Date().toISOString()
    console.log("Gemmer sæt med session_id:", sessionId)
    const { data, error } = await supabase
      .from("saet")
      .insert({ oevelse_id: oevelseId, vaegt, reps, dato, session_id: sessionId })
      .select()
      .single()

    if (error || !data) {
      console.error("Fejl ved opret sæt:", error)
      return
    }

    console.log("Sæt gemt:", data)
    setAktivSession((prev) => prev ? {
      ...prev,
      saet: [...prev.saet, { id: data.id, vaegt, reps, dato, oevelse_id: oevelseId, session_id: sessionId }]
    } : null)
  }

  async function sletSaet(id: number, oevelseId: number, dagId: number, programId: number) {
    await supabase.from("saet").delete().eq("id", id)
    setAktivSession((prev) => prev ? { ...prev, saet: prev.saet.filter((s) => s.id !== id) } : null)
  }

  return {
    programmer,
    loading,
    aktivSession,
    startSession,
    afslutSession,
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
    sletSaet,
  }
}
