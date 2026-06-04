# Plan: Gör box-andningen perfekt — som mall för resten

Du har rätt. Vi skalar ner. En övning. Allt synkat. Sedan kopierar vi mönstret.

## Val

- **Övning:** Box-andning 4-4-4-4 (4 min, 15 cykler).
- **Animation:** Ren SVG, ingen Lottie, ingen Rive. Vi driver varje frame med övningens klocka, så animation och text *kan inte* glida isär. Lottie passar inte här — Lottie-filer har eget tempo och looper, och det är just det som har gjort att "andas in in in" känns konstigt.
- **Text:** Stort ord per fas (`Andas in` / `Håll` / `Andas ut` / `Håll`) + tydlig räknare `1 · 2 · 3 · 4` som tickar i takt med animationen.

## Vad animationen visar (och varför)

En kvadrat (boxen). En lysande punkt vandrar längs kvadratens fyra sidor — en sida per fas, 4 sekunder per sida.

- Topp vänster → topp höger: **Andas in** (punkten åker upp/höger, boxen "fylls" med en mjuk gradient nerifrån)
- Topp höger → botten höger: **Håll** (punkten åker ner, fyllningen står still, lätt puls)
- Botten höger → botten vänster: **Andas ut** (punkten åker vänster, fyllningen sjunker)
- Botten vänster → topp vänster: **Håll** (punkten åker upp, tomt, lätt puls)

Allt drivs av samma `stepProgress` som styr räknaren och textbytet → 0 % drift.

## Text-mönster

```text
[stort ord]        ← byts vid fasbyte
Andas in

[räknare]          ← uppdateras varje sekund, synkat med punkten
1 · 2 · 3 · 4

[liten hjälptext]  ← står stilla genom hela övningen
Följ punkten runt boxen. Näsan in, munnen ut.
```

Inga undertext-listor som hoppar mitt i en fas. Ordet byts bara när fasen byts.

## Vad jag bygger

1. Ny komponent `src/components/animations/BoxBreath.tsx`
   - Props: `phaseIndex` (0–3), `phaseProgress` (0–1), `secondsPerSide` (default 4).
   - Renderar SVG: kvadrat med rundade hörn, mjuk fyllning som följer in/ut, punkt på rätt sida vid `phaseProgress`.
   - Inga loopar inuti komponenten — den är "dum", drivs utifrån.

2. Ändring i `src/routes/ovning.$id.tsx`
   - För box-andnings-övningen: rendera `BoxBreath` direkt med exercise-klockan, *inte* `LottiePlayer` eller den generella `AnimationFor`-fallbacken.
   - Visa ord + räknare + hjälptext enligt mönstret ovan, *inte* `subtitleFor`-listan.

3. Datatouch i `src/lib/exercises.ts`
   - Hitta box-andnings-övningen, sätt `lottie = undefined` och se till att stegen är exakt 4 sekunder var × 15 cykler.
   - Inga andra övningar rörs.

## Vad jag *inte* gör nu

- Rör inte de andra övningarna eller deras Lottie-mappning.
- Inga nya bibliotek.
- Ingen credits-sida, ingen Rive, ingen video.
- Inga ändringar av historik/skattning.

## Efter det här

När du tycker box-andningen sitter perfekt använder vi exakt samma recept (egen liten SVG-komponent + ord + räknare, driven av övningens klocka) på en övning till. En i taget.
