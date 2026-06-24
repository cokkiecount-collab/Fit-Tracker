import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import type { Program, Saet } from "../types"

export type Session = {
  id: number
  traeningsdag_id: number
  dato: string
  saet: (Saet & { oevelse_id: number, session_id: number })[]
}

export type StatistikSaet = {
  vaegt: number
  reps: number
  dato: string
  oevelse_navn: string
}

export function useSupabase(userId: string | null) {
  const [programmer, setProgrammer] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [aktivSession, setAktivSession] = useState<Session | null>(null)
  const [alleSaet, setAlleSaet] = useState<StatistikSaet[]>([])

  useEffect(() => {
    if (!userId) {
      setProgrammer([])
      setAlleSaet([])
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

    const oevelseIds = (oevelserData ?? []).map((o) => o.id)

    const { data: sessionerData } = dageIds.length > 0
      ? await supabase
          .from("sessioner")
          .select("*")
          .eq("user_id", uid)
          .in("traeningsdag_id", dageIds)
          .order("dato", { ascending: false })
      : { data: [] }

    const alleSessionIds = (sessionerData ?? []).map((s) => s.id)

    const { data: alleSaetMedSession } = alleSessionIds.length > 0
      ? await supabase.from("saet").select("*").in("session_id", alleSessionIds).order("dato")
      : { data: [] }

    const sessionerMedSaetPerDag: Record<number, number[]> = {}
    for (const session of (sessionerData ?? [])) {
      const harSaet = (alleSaetMedSession ?? []).some((s) => s.session_id === session.id)
      if (harSaet) {
        if (!sessionerMedSaetPerDag[session.traeningsdag_id]) {
          sessionerMedSaetPerDag[session.traeningsdag_id] = []
        }
        if (sessionerMedSaetPerDag[session.traeningsdag_id].length < 2) {
          sessionerMedSaetPerDag[session.traeningsdag_id].push(session.id)
        }
      }
    }

    const tonnagePerSession: Record<number, number> = {}
    for (const saet of (alleSaetMedSession ?? [])) {
      if (!tonnagePerSession[saet.session_id]) tonnagePerSession[saet.session_id] = 0
      tonnagePerSession[saet.session_id] += saet.vaegt * saet.reps
    }

    const senesteSessionDatoPerDag: Record<number, string> = {}
    for (const session of (sessionerData ?? [])) {
      const ids = sessionerMedSaetPerDag[session.traeningsdag_id] ?? []
      if (ids[0] === session.id) {
        senesteSessionDatoPerDag[session.traeningsdag_id] = session.dato
      }
    }

    const senesteSessionIds = Object.values(sessionerMedSaetPerDag).map((ids) => ids[0]).filter(Boolean)
    const reminderSaet = (alleSaetMedSession ?? []).filter((s) => senesteSessionIds.includes(s.session_id))

    const oevelseNavnMap: Record<number, string> = {}
    for (const o of (oevelserData ?? [])) oevelseNavnMap[o.id] = o.navn

    const statistikSaet: StatistikSaet[] = (alleSaetMedSession ?? []).map((s) => ({
      vaegt: s.vaegt, reps: s.reps, dato: s.dato,
      oevelse_navn: oevelseNavnMap[s.oevelse_id] ?? "Ukendt"
    }))
    setAlleSaet(statistikSaet)

    const { data: alleSaetPR } = oevelseIds.length > 0
      ? await supabase.from("saet").select("oevelse_id, vaegt").in("oevelse_id", oevelseIds)
      : { data: [] }

    const prPerOevelse: Record<number, number> = {}
    for (const s of (alleSaetPR ?? [])) {
      if (!prPerOevelse[s.oevelse_id] || s.vaegt > prPerOevelse[s.oevelse_id]) {
        prPerOevelse[s.oevelse_id] = s.vaegt
      }
    }

    const byggede: Program[] = (progData ?? []).map((p) => ({
      id: p.id,
      navn: p.navn,
      dage: (dageData ?? [])
        .filter((d) => d.program_id === p.id)
        .map((d) => {
          const sessionIds = sessionerMedSaetPerDag[d.id] ?? []
          const senesteSessionTonnage = sessionIds[0] ? tonnagePerSession[sessionIds[0]] ?? 0 : 0
          const forrigeSessionTonnage = sessionIds[1] ? tonnagePerSession[sessionIds[1]] ?? 0 : 0
          return {
            id: d.id,
            navn: d.navn,
            senesteSessionTonnage,
            forrigeSessionTonnage,
            senesteSessionDato: senesteSessionDatoPerDag[d.id],
            oevelser: (oevelserData ?? [])
              .filter((o) => o.traeningsdag_id === d.id)
              .map((o) => ({
                id: o.id,
                navn: o.navn,
                prVaegt: prPerOevelse[o.id] ?? 0,
                saet: reminderSaet
                  .filter((s) => s.oevelse_id === o.id)
                  .map((s) => ({ id: s.id, vaegt: s.vaegt, reps: s.reps, dato: s.dato })),
              })),
          }
        }),
    }))

    setProgrammer(byggede)
    setLoading(false)
  }

  async function startSession(dagId: number, uid: string): Promise<number | null> {
    const { data, error } = await supabase
      .from("sessioner")
      .insert({ traeningsdag_id: dagId, user_id: uid, dato: new Date().toISOString() })
      .select().single()
    if (error || !data) return null
    setAktivSession({ id: data.id, traeningsdag_id: dagId, dato: data.dato, saet: [] })
    return data.id
  }

  // Afslut session normalt - henter data igen
  async function afslutSession(sessionId: number, harSaet: boolean) {
    if (!harSaet) {
      // Slet tom session
      await supabase.from("sessioner").delete().eq("id", sessionId)
    }
    setAktivSession(null)
    if (userId) await hentAltData(userId)
  }

  async function opretProgram(navn: string, uid: string) {
    const { data, error } = await supabase.from("programmer").insert({ navn, user_id: uid }).select().single()
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

  async function opretDag(programId: number, navn: string) {
    const { data, error } = await supabase.from("traeningsdage").insert({ navn, program_id: programId }).select().single()
    if (error || !data) return
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: [...p.dage, { id: data.id, navn: data.navn, oevelser: [] }] } : p))
  }

  async function opdaterDag(id: number, navn: string, programId: number) {
    await supabase.from("traeningsdage").update({ navn }).eq("id", id)
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.map((d) => d.id === id ? { ...d, navn } : d) } : p))
  }

  async function sletDag(id: number, programId: number) {
    await supabase.from("traeningsdage").delete().eq("id", id)
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.filter((d) => d.id !== id) } : p))
  }

  async function opretOevelse(dagId: number, programId: number, navn: string) {
    const { data, error } = await supabase.from("oevelser").insert({ navn, traeningsdag_id: dagId }).select().single()
    if (error || !data) return
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: [...d.oevelser, { id: data.id, navn: data.navn, saet: [], prVaegt: 0 }] } : d) } : p))
  }

  async function opdaterOevelse(id: number, navn: string, dagId: number, programId: number) {
    await supabase.from("oevelser").update({ navn }).eq("id", id)
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: d.oevelser.map((o) => o.id === id ? { ...o, navn } : o) } : d) } : p))
  }

  async function sletOevelse(id: number, dagId: number, programId: number) {
    await supabase.from("oevelser").delete().eq("id", id)
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: d.oevelser.filter((o) => o.id !== id) } : d) } : p))
  }

  async function opretSaet(oevelseId: number, dagId: number, programId: number, vaegt: number, reps: number, sessionId: number) {
    const dato = new Date().toISOString()
    const { data, error } = await supabase.from("saet").insert({ oevelse_id: oevelseId, vaegt, reps, dato, session_id: sessionId }).select().single()
    if (error || !data) return
    setProgrammer((prev) => prev.map((p) => p.id === programId ? { ...p, dage: p.dage.map((d) => d.id === dagId ? { ...d, oevelser: d.oevelser.map((o) => o.id === oevelseId ? { ...o, prVaegt: Math.max(o.prVaegt ?? 0, vaegt) } : o) } : d) } : p))
  }

  async function sletSaet(id: number) {
    await supabase.from("saet").delete().eq("id", id)
  }

  return {
    programmer, loading, aktivSession, alleSaet,
    startSession, afslutSession,
    opretProgram, opdaterProgram, sletProgram,
    opretDag, opdaterDag, sletDag,
    opretOevelse, opdaterOevelse, sletOevelse,
    opretSaet, sletSaet,
  }
}
