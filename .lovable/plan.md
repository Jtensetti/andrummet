
# Ny övning i "Var snäll mot dig själv": **Du blev hållen**

## Varför just den här övningen

Befintliga compassion-övningar:

| Övning | Vad den gör |
|---|---|
| **Tre vänliga meningar** | Lånar tonen man har mot vänner — *röst/språk* |
| **Du får vara mänsklig** | Generell tillåtelse att vara ofullkomlig — *kognitiv permission* |

**Lucka:** Det specifika ögonblicket *efter* ett misstag — när självkritiken är skarp ("jag sumpade det, jag är värdelös") och man behöver något *kroppsligt och hållande*, inte ord. Och: ingen av övningarna berör Kristin Neffs tredje pelare i självmedkänsla — **common humanity** ("andra människor faller också, jag är inte ensam i det här"). De två befintliga är inåtvända; den här lyfter blicken till att man hålls av något större.

**Kärnbudskap:** *Du föll inte. Du landade. Och det du landade i är inte ensamt — det hålls av något större.*

## Animation: bollen som finner sin vagga

Inspirerad direkt av bilden — två nästlade bågar med en liten ljus boll som vilar i fickan där den inre kröner sig.

```text
       ╱─────────────╲           yttre båge:
      ╱   ╱───────╲   ╲          "gemensam mänsklighet"
     ╱   ╱         ╲   ╲         (lila)
    ╱   ╱     ●     ╲   ╲        ← bollen vilar i vaggan
    │   │            │   │       där inre möter yttre
    │   │            │   │
    │   │            │   │       inre båge:
    │   │            │   │       "vänlighet mot dig själv"
    └───┴────────────┴───┘       (rosa)
```

**Visuellt:**
- **Yttre båge** i `--compassion` (varm rosa-lila) — *du hålls av andra som också faller*
- **Inre båge** i `--compassion-accent` (mättad rosa) — *du håller dig själv vänligt*
- **Boll** i `--compassion-on` (varmt ljus/cream) — *du, i det här ögonblicket*
- Bakgrund: nästan transparent / neutral så bågarna får andas
- Stilregler: platta SVG-former, inga gradienter, samma grammatik som övriga bespoke-animationer

**Animationsförlopp (en enda sammanhängande rörelse över hela övningen, ~3 min, samma `useTimeSec`-mönster som SnowGlobeSettle och RideTheWave):**

1. **Början (steg 1–2):** Bara bollen syns, något ovanför centrum, **vinglande** sidledes med dämpad sinussvängning (`sin(t*3) * 30 * (1-u)^2` — amplituden klingar av). Bågarna är osynliga / nästan opaka. → *"något brast"*
2. **Steg 2–3:** Den **inre rosa bågen tonas in** underifrån (`opacity` följer en mjuk easeOut över ~20 sek). Bollen börjar **falla långsamt** men i båge — inte rakt ner — mot vaggpunkten där bågens kant kommer att möta den yttre. → *"lägg ner det varsamt"*
3. **Steg 4:** Bollen **finner sin plats** i fickan (`x,y` interpoleras med easeOutCubic till resting position). Mikrostuds (en, mjuk) när den landar. → *"du hålls"*
4. **Steg 5:** Den **yttre lila bågen tonas in** runt — långsam expansion från inre bågens kontur. Bollen ligger stilla. → *"inte ensam"*
5. **Steg 6:** Allt vilar. Bollen får en knappt märkbar **`useBreathPulse`** (5200ms cykel) — den andas. Båda bågarna pulserar **synkront och svagt** med samma rytm. → *"andas där"*

**Pedagogisk synk:** Användaren ser bollen **vingla → landa → bli omsluten → andas** medan texten beskriver exakt det. Bildens kärnbudskap — *du behövde inte hålla dig själv ensam* — bevisas i realtid: bollen rör sig inte själv mot vaggan, vaggan kommer fram och möter den.

**Tekniska detaljer:**
- `useTimeSec()` driver allt (u = 0..1 över ~180s)
- Bågar ritas som SVG-`path` med kvadratiska bézier-kurvor (`M x,y Q cx,cy x2,y2`) — samma "fat arch"-form som referensbilden
- Inga `useState`-uppdateringar per frame
- Bollens position: piecewise envelope (wobble → fall → settle → rest) med `smoothstep`-överlappningar
- Båg-opacity: stegvis fade-in vid u≈0.25 (inre) och u≈0.7 (yttre)

## Steg och script (~3 min, kind: short)

1. **"Något brast"** (24s)
   - "något gick fel"
   - "eller bara fel nog"
   - "lägg märke till självkritiken"
   - "den hårda rösten"

2. **"Lägg ner pinnen"** (28s)
   - "du står med en pinne"
   - "och slår dig själv"
   - "lägg ner den"
   - "bara för nu"

3. **"Du behöver hållas"** (32s)
   - "just nu behöver du inte fixas"
   - "du behöver hållas"
   - "som du skulle hålla någon"
   - "som har det svårt"

4. **"Landa här"** (32s)
   - "lägg en hand på bröstet"
   - "eller magen"
   - "känn värmen"
   - "du är här"
   - "du är hållen"

5. **"Du är inte ensam"** (36s)
   - "andra människor"
   - "har också sumpat det"
   - "har också varit hårda mot sig själva"
   - "just nu, någonstans"
   - "är någon precis som du"

6. **"Andas där"** (28s)
   - "andas in värme"
   - "andas ut piskan"
   - "du behöver inte göra mer"
   - "bli hållen"

**Closing:** "Du föll inte. Du blev hållen."

**Microcopy (done-screen):** "Du la ner pinnen."

(Ingen `reflectionPrompt`, ingen `requiresRating` — `kind: "short"`.)

## Tekniska detaljer

- **ID:** `du-blev-hallen`
- **Kategori:** `compassion`
- **Kind:** `short`
- **Längd:** 3 min
- **Metric:** `stress`
- **animation-fält:** `"ring"` (fallback — bespoke matchar på id)

### Filer som ändras

1. **`src/lib/exercises.ts`**
   - Lägg till övningsobjektet direkt efter `du-far-vara-mansklig` (så hela compassion-blocket är samlat)
   - Lägg till `"du-blev-hallen"` i `POLISHED_IDS`-arrayen

2. **`src/components/animations/bespoke.tsx`**
   - Ny komponent `HeldInArch` som följer samma mönster som `SnowGlobeSettle` / `RideTheWave`:
     - `useTimeSec` driver hela förloppet (0..1 över exercise-längden)
     - Två SVG-`path`-bågar (inre + yttre) med opacity-envelope
     - Boll med piecewise position-envelope (wobble → fall → settle → rest)
     - `useBreathPulse` på bollen i sista fasen
     - Stilfärger: compassion / compassion-accent / compassion-on
   - Registrera `du-blev-hallen` → `HeldInArch` i `BESPOKE`-uppslaget

3. **`.lovable/plan.md`** — uppdatera så planen reflekterar att övningen är tillagd.

## Vad jag INTE rör

- Befintliga compassion-övningar eller deras animationer
- Kategorifärger, kortlayout, routing, startsidan
- `ovning.$id.tsx` — `BespokeFor` plockar upp animationen automatiskt via id
