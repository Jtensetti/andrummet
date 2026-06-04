# Plan: Gör "Lång utandning" perfekt

Samma mönster som box-andningen — egen SVG-komponent driven av övningens klocka, ord per fas + räknare. Inget Lottie.

## Övningen

- ID: `lang-utandning` (kategori "Andas").
- Tempo: **4 sek in / 7 sek ut**, 6 cykler ≈ 66 sek ~ 1 min. (Det är klassiska "4-7-8-light" utan håll-fasen, som passar appens stillsamma ton.)

## Vad animationen visar

En **horisontal våg** som rullar in och ut längs en bottenlinje.

- **Andas in (4 s):** vågen reser sig långsamt — amplituden växer från 0 till full, en lysande punkt åker uppåt på vågens framkant.
- **Andas ut (7 s):** vågen sjunker tillbaka mot linjen — långsammare än den steg, så det syns och känns att utandningen är längre. Punkten åker ned och glider åt sidan.

Visuellt tydligt **att utandningen tar längre tid** — det är hela poängen med övningen, så animationen ska berätta det utan ord.

Allt drivs av `phaseIndex` (0=in, 1=ut) + `phaseProgress` (0→1) från samma frame-klocka som nu gör box-andningen mjuk.

## Text-mönster

```text
[stort ord]                ← byts vid fasbyte
Andas in   /   Andas ut

[räknare]                  ← lika många prickar/siffror som faslängden
1 · 2 · 3 · 4              (under in)
1 · 2 · 3 · 4 · 5 · 6 · 7  (under ut)

[liten hjälptext]          ← står still hela övningen
Näsan in. Munnen ut. Längre ut än in.
```

Räknaren är samma princip som box-andningen: prickar/siffror som tänds en per sekund och syns alla samtidigt — så man ser hur lång fasen är.

## Vad jag bygger

1. **Ny komponent** `src/components/animations/BreathWave.tsx`
   - Props: `phaseIndex` (0=in, 1=ut), `phaseProgress` (0→1).
   - Renderar en SVG-våg (sinus-path) längs en horisontal linje. Amplitud + en glödande punkt drivs av `phaseProgress`.
   - "Dum" komponent — inga egna transitions, exakt rätt varje frame.

2. **Ändring i `src/routes/ovning.$id.tsx`**
   - Lägg till `ex.id === "lang-utandning"` som en andra special-case bredvid box-andningen.
   - Visar `BreathWave` + ord + räknare (samma layout som box).

3. **Datatouch i `src/lib/exercises.ts`**
   - Sätt `WAVE(6)` (redan 5 idag — bara liten justering).
   - `minutes: 1` så etiketten matchar 6 × 11 s.
   - Övriga övningar lämnas orörda.

## Vad jag *inte* gör

- Rör inte de andra övningarna eller deras Lottie-mappning.
- Inga nya bibliotek.
- Ingen 4-7-8 med håll-fas (vi kan lägga till den som egen övning senare om du vill).

När den känns rätt kör vi nästa med samma recept.
