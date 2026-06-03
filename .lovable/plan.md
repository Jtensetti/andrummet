# Lottie-animationer i andrummet (prototyp)

## Mål

Ersätta de hemmagjorda SVG-animationerna med riktiga, polerade Lottie-animationer från LottieFiles gratisbibliotek där det finns bra matchningar. Behålla vår egen SVG-primitiv för andningsövningar där vi måste styra tempot exakt.

## Förutsättningar (verifierade)

- `@lottiefiles/dotlottie-react` är MIT-licensierat, gratis, installeras via bun.
- LottieFiles har tusentals gratis filer under två licenser:
  - **Lottie Simple License** — fri, ingen attribution.
  - **Free License** — fri, kräver attribution.
- För denna prototyp använder vi gratisfiler och listar skaparna på en liten credits-sida.

## Plan

### 1. Installera och skapa en Lottie-wrapper

- `bun add @lottiefiles/dotlottie-react`
- Ny komponent `src/components/animations/LottiePlayer.tsx`:
  - Props: `src` (URL till .lottie-fil), `mode: "loop" | "once-per-step" | "clock-driven"`, `stepProgress`, `stepIndex`.
  - `loop`: bara autoplay loop (för ambient: ljus, sand, regn, moln som driver förbi).
  - `once-per-step`: spelar en gång per stegbyte (för metaforer: ballong släpps, sten faller, dörr öppnas).
  - `clock-driven`: `setFrame(stepProgress * totalFrames)` varje render — animationen drivs av övningens klocka (för andning där tempot måste matcha).

### 2. Hosting

- Ladda ner valda .lottie-filer och lägg upp via `lovable-assets create` så vi inte är beroende av LottieFiles CDN.
- Spara pointers i `src/assets/lottie/{namn}.lottie.asset.json`.

### 3. Mappa övningar till Lottie

Utöka `ExerciseStep` / Exercise i `src/lib/exercises.ts` med valfritt `lottie?: { src, mode }`. Om `lottie` finns används `LottiePlayer`, annars fallback till vår nuvarande `AnimationFor`. På så sätt kan vi byta gradvis — inget brott i en stor diff.

### 4. Vad vi ersätter och vad vi behåller

**Ersätter med Lottie (där fina gratisfiler finns):**
- Ljus som brinner, ljusslocknande, eld/glöd
- Moln som driver, löv som faller, regn
- Stjärnor/konstellation, sol som går upp/ner
- Ballong som släpps, sten som faller/sjunker
- Sand som rinner i timglas
- Trafikljus, dörröppning, post/inkorg
- Spiral, pendel, ankare

**Behåller vår egen SVG-primitiv (klock-styrt eller pedagogisk text):**
- Box-andning (vi styr exakt vilken sida pricken är på)
- Andnings-orb (radie = stepProgress)
- Kroppsfigur med fokuszoner (käke, axlar, mage) med text bredvid
- "Tre saker du ser/hör/känner"-räknare

### 5. Credits

Liten sida `src/routes/credits.tsx` som listar Lottie-skaparna vi använt under Free License, länkad från footer.

### 6. Leverans i etapper

Eftersom det här är jobb per övning föreslår jag:

- **Etapp 1:** Wrapper + `lottie`-fältet i exercises + 5 övningar konverterade (ljus, ballong, moln, sten, sand) — du utvärderar känslan.
- **Etapp 2:** Resten av övningarna där en bra fri Lottie finns.
- **Etapp 3:** Eventuell finputs (credits-sida, fallback-states).

## Filer som ändras

- `package.json` — ny dep `@lottiefiles/dotlottie-react`
- `src/components/animations/LottiePlayer.tsx` — ny
- `src/assets/lottie/*.lottie.asset.json` — nya pointers (5 st i etapp 1)
- `src/lib/exercises.ts` — `lottie`-fält på Exercise, fyll i för 5 övningar
- `src/routes/ovning.$id.tsx` — välj Lottie eller fallback

## Vad jag inte gör

- Inga premium-Lottie-filer.
- Ingen ändring av övningstexter / scripts — det jobbet är redan klart.
- Ingen total ersättning av andningsanimationerna — vår klock-styrning är bättre där.

## Säg till om

- du vill köra etapp 1 nu (jag väljer 5 filer och visar resultatet), eller
- du vill se mig välja Lottie-filer först och godkänna varje innan jag bygger in dem.
