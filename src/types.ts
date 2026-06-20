export type Saet = {
  id?: number
  vaegt: number
  reps: number
  dato: string
}

export type Oevelse = {
  id?: number
  navn: string
  saet: Saet[]       // seneste sessions saet (til reminder)
  prVaegt?: number   // historisk PR
}

export type Traeningsdag = {
  id?: number
  navn: string
  oevelser: Oevelse[]
}

export type Program = {
  id?: number
  navn: string
  dage: Traeningsdag[]
}

export type Bruger = {
  brugernavn: string
  kodeord: string
  programmer: Program[]
}
