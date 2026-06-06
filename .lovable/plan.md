
# Ny övning: "Låt det singla ner" (snöglob)

En övning i kategorin **stress / Släppa tankar** baserad på Jon Kabat-Zinns klassiska snöglob-metafor. Den fyller ett tomrum bland de tre befintliga övningarna och bär en pedagogisk insikt som ingen annan övning har: *du behöver inte tänka tankarna bort — du behöver bara sluta skaka.*

## Varför den passar in (och inte dubblar något)

| Befintlig övning | Vad den gör |
|---|---|
| **Reset** | Lugnar via kroppen (axlar, käke, andning) |
| **Lägg undan till sen** | Externaliserar — flyttar tanken till en "sen"-låda |
| **Löv på en flod** | Passiv observation — låter tankar driva förbi |
| **Låt det singla ner** *(ny)* | **Sluta interagera helt — låt sedimentet falla av sig själv** |

Skillnaden mot "Löv på en flod" är subtil men verklig: där är man en aktiv åskådare som lägger varje tanke på ett löv. Här gör man *ingenting*. Tankarna är redan i globen. Man ställer bara ner den.

## Pedagogisk metafor (klassisk men outnyttjad i appen)

Hjärnan vid stress är en omskakad snöglob: tankar, oro, planer, minnen virvlar samtidigt och man ser ingenting klart. Reflexen är att försöka *fixa* — analysera, lösa, undertrycka. Det är att skaka mer.

Den enda interventionen som faktiskt fungerar: **ställ ner globen**. Sedimentet sjunker av sig själv. Vattnet blir klart. Tankarna finns kvar — men de stormar inte.

## Animation (bespoke)

En cirkel/glob centralt. Inuti: ~50 små partiklar. Varje partikel har en *vilo-position* i en hög längs botten av globen. När en "skakning" sker (deterministisk händelse var ~14 sek) får alla partiklar en impuls som lyfter dem och sätter dem i kaotisk rörelse — sedan dämpas rörelsen exponentiellt och de singlar tillbaka mot botten.

**Cykeln (oberoende av stegen — samma princip som Löv i bäcken):**

```text
t=0.0s   ████  shake!  partiklar virvlar i hela globen
t=2–8s   ░░    settling — exponentiell dämpning, partiklar singlar nedåt
t=8–13s  .     stilla — tunt lager i botten, vattnet klart
t=14s    ████  ny shake — nästa "tanke kom emellan"
```

**Pedagogisk synk:** animationen demonstrerar texten utan att vänta på den. När användaren läser "låt det singla ner" *ser* hen partiklarna singla. När texten säger "en ny skakning kommer" händer det också — fast i sin egen takt, inte på kommando. Det förstärker budskapet att du inte styr stormen, du bara ställer ner globen.

**Stilregler (samma som övriga bespoke):**
- Platt SVG, inga gradienter eller skuggor
- `SOFT` för globens kontur och vattnet
- `ACCENT` för partiklarna
- `useBreathPulse` ger globen en knappt märkbar andning (visar att den *står still* — den skakas inte)
- `useTimeSec` driver shake-cykeln och partiklarnas exponentiella settling

**Teknisk realisering:** Varje partikel är en deterministisk funktion av `t`:
- `restX, restY` = vilo-position i hög-formationen (pre-beräknad en gång)
- Vid varje skakning `tShake` får partikeln en seedad impuls (vinkel, amplitud)
- `offset(t) = exp(-(t - tShake) / tau) * impulse + brownianWobble`
- `position = rest + offset`, clampat innanför globens cirkel

Inga useState-uppdateringar per partikel — bara `useTimeSec` driver hela bilden, samma mönster som alla andra bespoke-komponenter.

## Steg och script

Texterna är skrivna för exakt den här metaforen. Inget kroppsfokus, ingen "andas in / andas ut" — bara observation av att skaka eller stå still.

1. **"Hjärnan är en snöglob"** (20s)
   - "den har skakats om hela dagen"
   - "tankarna virvlar"
   - "du ser ingenting klart"

2. **"Sluta skaka"** (35s)
   - "du behöver inte tänka dem bort"
   - "du behöver bara sluta röra om"
   - "ställ ner globen"

3. **"Låt det singla ner"** (40s)
   - "partiklarna sjunker av sig själva"
   - "långsamt, en i taget"
   - "ingen ansträngning"

4. **"En ny skakning kommer"** (35s)
   - "en oro dyker upp och virvlar runt allt igen"
   - "det är okej, det händer"
   - "ställ ner globen igen"

5. **"Vattnet blir klart"** (35s)
   - "samma tankar finns kvar"
   - "men du ser igenom dem"
   - "de är inte stormen längre"

6. **"Ta med dig stillheten"** (15s)
   - "globen finns kvar i handen"
   - "ställ ner den när du behöver"

**Closing:** "Du tänkte dem inte bort. Du slutade skaka."
**Microcopy (done):** "Du satte ner globen. Det räcker."

(Övningen är `kind: "short"`, så ingen `reflectionPrompt` — kort övning, ingen rating.)

## Tekniska detaljer

- **ID:** `lat-det-singla-ner`
- **Kategori:** `stress`
- **Kind:** `short`
- **Längd:** 3 min
- **Metric:** `stress`
- **animation-fält:** `"drift"` (fallback — bespoke matchar på id)

### Filer som ändras

1. **`src/lib/exercises.ts`**
   - Lägg till övningsobjektet direkt efter `lov-pa-en-flod` (så stress-blocket är samlat)
   - Lägg till `"lat-det-singla-ner"` i `POLISHED_IDS`-arrayen

2. **`src/components/animations/bespoke.tsx`**
   - Ny komponent `SnowGlobeSettle` som följer samma mönster som `LeavesOnStream` och `NameTheThought`:
     - `useTimeSec` driver shake-cykeln (~14s) och exponentiell settling
     - Partiklarnas vilo-positioner pre-beräknas en gång (deterministiska seedade slumpvärden)
     - `useBreathPulse` ger globen subtil andning
   - Registrera `lat-det-singla-ner` → `SnowGlobeSettle` i `BESPOKE`-uppslaget

3. **`.lovable/plan.md`** — uppdatera så planen reflekterar de tre nya övningarna.

## Vad jag INTE rör

- Befintliga övningar, deras texter, animationer eller hastigheter
- Kategorifärger, kortlayout, routing, startsidan
- `ovning.$id.tsx` — `BespokeFor` plockar upp animationen automatiskt
