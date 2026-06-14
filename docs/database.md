Databasedesign

Brugere

Gemmer oplysninger om brugeren.

Felt| Type
id| UUID
email| Tekst
oprettet_dato| Tidsstempel

---

Øvelser

Gemmer alle tilgængelige øvelser.

Felt| Type
id| UUID
navn| Tekst
muskelgruppe| Tekst

Eksempler

- Bænkpres
- EZ Preacher Curl
- Benpres
- Chest Fly
- Lat Pulldown
- Skulderpres

---

Træningspas

Gemmer hvert enkelt træningspas.

Felt| Type
id| UUID
bruger_id| UUID
dato| Tidsstempel
noter| Tekst

---

Træningsøvelser

Forbinder et træningspas med en øvelse.

Felt| Type
id| UUID
træningspas_id| UUID
øvelse_id| UUID

---

Sæt

Gemmer alle udførte sæt.

Felt| Type
id| UUID
træningsøvelse_id| UUID
vægt| Decimal
reps| Heltal
sæt_nummer| Heltal

Eksempel

Bænkpres

Sæt| Vægt| Reps
1| 75 kg| 8
2| 75 kg| 8
3| 72,5 kg| 10

---

Personlige Rekorder (PR)

Kan beregnes automatisk ud fra træningsdata.

Eksempler:

- Højeste vægt
- Største volumen
- Bedste estimerede 1RM

---

Statistik

Kan beregnes ud fra træningshistorikken.

Statistikker

- Samlet tonnage
- Antal træningspas
- Mest trænede øvelser
- Ugentlig volumen
- Månedlig volumen

---

Vigtig Funktion

Når en bruger logger en øvelse, skal appen altid vise:

Seneste træning:

75 kg × 8 reps

Dette er en af de vigtigste funktioner i hele Fit-Tracker.
