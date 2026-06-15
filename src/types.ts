export type Saet = {
  vaegt: number
  reps: number
  dato: string
}

export type Oevelse = {
  navn: string
  saet: Saet[]
}

export type Traeningsdag = {
  navn: string
  oevelser: Oevelse[]
}

export type Program = {
  navn: string
  dage: Traeningsdag[]
}
export type Bruger = {
  brugernavn: string
  kodeord: string
  programmer: Program[]
}