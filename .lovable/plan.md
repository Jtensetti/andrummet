# Mindfullare övningar: riktiga instruktioner + bygg om animationerna

## Vad som är fel idag

1. **Texten säger nästan inget.** `cueFor()` i `src/routes/ovning.$id.tsx` klipper varje stegrubrik till **ett** ord. "En sak du ser" blir **"En"**. Den fulla rubriken finns under men i pytteliten stil. Användaren ser ett ord + en sten som faller och fattar inget.
2. **Stegen är för glesa.** Ett steg på 10–20 sek visar samma rubrik hela tiden — inget händer i texten, inget driver framåt.
3. **Animationerna är hoppiga och otydliga.** Du bekräftade att det gäller alla, inte bara tre. Genomgående problem jag ser i `src/components/animations/index.tsx`:
   - Många använder `animate={{...}}` med egen `transition` *ovanpå* sekundkontrollen — då glider de mot ett mål med eget tempo istället för att följa övningens klocka. Resultatet: rycker, hinner inte ifatt, eller fortsätter när stegtexten redan bytts.
   - Andra mappar `stepIndex % N` utan `phase`-fallback — vid steg som inte är "in/ut/håll/vila" hoppar de fel.
   - Flera kroppsanimationer (jaw, axlar, mage) visar en kroppsdel utan kontext eller etikett — "jaha, hakan?".
   - Steg-byten ger teleport-effekt eftersom inget element bär över state mellan steg.

## Lösning

### 1. Inför "subtitle script" per steg

Utvidga `ExerciseStep`:

```ts
interface ExerciseStep {
  label: string;         // kort rubrik, små bokstäver under
  seconds: number;
  script?: string[];     // 2–8 korta fraser, 1–3 ord, visas i tur och ordning
}
```

Spelaren visar `script[floor(stepProgress * script.length)]` — som undertexter till en lugn röst. Mjuk 200 ms fade mellan fraser. Saknas `script` används `label`.

Ta bort `cueFor()`. Den stora texten är nästa fras i scriptet. Rubriken visas litet under som "kapitelnamn".

### 2. Skriv om alla 50 övningar

Varje steg får ett script som verkligen guidar. Exempel:

**"Tre saker du ser" — innan:**
```
["En sak du ser", 12]
```
**Efter:**
```
{ label: "En sak du ser", seconds: 18, script: [
  "Titta upp.", "Låt blicken vila.",
  "Hitta en sak.", "Vad är det?",
  "Säg det tyst.", "Stanna där."
]}
```

**"Paus för käken":** scriptet förklarar *varför* vi tittar på käken — inte bara "Lägg märke till käken".

Längder justeras så scriptet ryms (≈2–4 sek per fras). Jag går igenom alla 50 övningar i `src/lib/exercises.ts`.

### 3. Bygg om animationerna från grunden — gemensamma principer

Skriv om hela `src/components/animations/index.tsx` runt tre regler:

- **Klockan styr, inte easing.** Allt visuellt drivs av `stepProgress` (0→1) och `stepIndex` direkt via `style={{ transform: ... }}` eller SVG-attribut. Inga `animate`-mål med egen `transition` som krockar med övningens tempo.
- **Inget hoppar mellan steg.** Element bär över sin slutposition från föregående steg och fortsätter mjukt. För cykler (andning, ruta) är slutet av steg N = början av steg N+1 i samma punkt.
- **Animationen *visar* instruktionen.** Det som händer i bilden ska matcha det undertexten säger just nu — andas in → något fylls/växer, andas ut → samma sak töms/minskar i samma tempo.

### 4. Konkret omarbetning per animationstyp

Jag grupperar de ~45 typerna i ~12 robusta primitiver och låter resten vara alias:

- **Andning (box-breath, breath-wave, breath-blob, belly-hand):** en enda mjuk pulserande cirkel/form vars radie = `stepProgress` på "in", `1-stepProgress` på "ut", konstant på "håll/vila". `BoxBreath` får en prick som glider *en* sida per andningsfas, härlett från `phase` med `stepIndex`-fallback.
- **Kroppsfokus (body-scan, jaw-release, shoulder-drop, footprints, warm-hand, opening-hand, stretch-up):** en stiliserad kroppssiluett där fokusområdet pulsar mjukt och **ordet** ("käke", "axlar", "mage") står bredvid pricken. Fokus glider mellan zoner kontinuerligt (inget teleporterande ljus).
- **Tankar passerar (passing-traffic, drifting-clouds, drifting-leaves, passing-thoughts):** en horisont där ett objekt per steg glider in från höger och ut till vänster, drivet linjärt av `stepProgress`. Inga staplade objekt med olika opacitet — bara ett i taget, mjukt.
- **Tid/förlopp (sand-clock, candle, ember, battery-fill, volume-slider, horizon, morning-sun):** en mätare/form som fylls/töms linjärt av `progress` (hela övningens), inte stegvis.
- **Val/handling (traffic-light, path-fork, steering-wheel, closing-laptop, closing-tabs, mailbox, inbox-priority, note-to-self, dropping-bags, release-balloon, deflate, measuring-tape, lifting-stone):** en metafor som genomför *en* handling per steg, synkad till `stepProgress`. T.ex. ballong släpps vid 0.5, stiger till toppen vid 1.
- **Övriga (spiral, orbit, pendulum, anchor-drop, focus-lens, sorting-shelf, constellation, unknotting, walking-path, pebbles, first-step, doorway, typing-cursor, inner-voice, warm-beam, compassion-heart):** samma mall — *en* tydlig rörelse som följer klockan.

Varje primitiv får en kort **etikett-rad** under bilden där det är pedagogiskt nödvändigt ("käke", "1 av 3", "in", "ut").

### 5. Spelaren

- Ta bort `cueFor` + den gigantiska enords-rubriken.
- Visa `script`-fras stort (max ~24 tecken/rad, två rader), `label` mindre under.
- Lägg till en liten "X av Y"-räknare så användaren ser sin progress mellan steg.
- I `intro`: kort hjälptext *"Följ texten — den byter med några sekunders mellanrum."*

## Filer som ändras

- `src/lib/exercises.ts` — utöka `ExerciseStep` med `script`, skriv om alla 50 övningars steg.
- `src/components/animations/index.tsx` — full omskrivning, ~12 primitiver + alias.
- `src/routes/ovning.$id.tsx` — ny subtitle-rendering, stegräknare, intro-hjälptext, bort med `cueFor`.

## Vad jag inte gör

- Ingen röst/ljudguide.
- Inga nya övningar — bara förbättring av de 50 som finns.
- Inga ändringar i kategorisidor, historik, auth eller datamodell utöver `script`-fältet.

## Leveransförslag

Det här är ganska mycket. Två rimliga vägar:

- **A. Allt i ett svep** — jag levererar spelare + alla animationer + alla 50 övningars script i en omgång. Stor diff, men du ser hela resultatet på en gång.
- **B. I etapper** — (1) spelare + subtitle-motor + 5 övningar att utvärdera, (2) alla animationer omskrivna, (3) resterande övningars script.

Säg vilket du föredrar så kör jag.