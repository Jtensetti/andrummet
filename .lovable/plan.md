
# Ny övning: "Märk tanken"

En aktiv defusionsövning i kategorin **Reflektera**. Komplement till "Löv i bäcken" — där tittar man passivt på tankar som driver förbi; här gör man något konkret med dem: sätter en etikett på *sorten*, inte på innehållet.

## Varför just den här övningen

- **Evidensbaserad teknik.** "Noting / labeling" är en kärnpraktik i både mindfulness (Goldstein, Salzberg) och ACT (Hayes). Att säga "det här är en oro-tanke" istället för att gå in i innehållet skapar avstånd utan att förtränga.
- **Unik bland reflection-övningarna.** Ingen befintlig övning handlar om kategorisering. Löv i bäcken = se tankar gå förbi. Märk tanken = sätt en lapp på dem först. Olika muskler.
- **Stark omedelbar nytta.** Funkar i busskön, i sängen, i mötet. Tre sekunders verktyg: *"planering"*, *"självkritik"*, *"minne"* — och så går tanken från diffus storm till tydligt objekt.
- **Passar starka färgen.** Reflektera är en intensiv kategori; den här övningen är konkret och handlingsbar, inte luddig.

## Pedagogisk metafor

Diffus tanke = ett moln av dimma man inte ser kanten på. När man **namnger sorten** (oro, plan, minne, kritik, fantasi) **kristalliserar** dimman till ett objekt man kan se — och då kan man också släppa det.

> "Det är inte 'jag kommer aldrig fixa det här' — det är en oro-tanke som dyker upp ofta."

## Animation (bespoke)

Centralt i bildytan: en mjuk, oregelbunden **dimblob** (SVG path med några böljande punkter, animerad via `useTimeSec` så formen rör sig långsamt och organiskt). Runt blobben driver små **etikettord** in från sidorna — "planering", "oro", "minne", "kritik", "fantasi", "fantasi-katastrof", "borde".

När en etikett driver "förbi" blobben (var ~6–8 sek):
1. Etiketten saktar ner och dockar vid blobben
2. Blobben **kristalliserar** — dimman drar ihop sig till en enkel geometrisk form (cirkel, fyrkant, triangel) med etiketten under
3. Det namngivna objektet driver mjukt ut åt sidan och tonar bort
4. En ny dimblob formas i mitten

Detta loopar kontinuerligt, oberoende av `stepProgress`. Texten byts; animationen fortsätter. Det förstärker budskapet: *tankar fortsätter komma — du fortsätter märka*.

**Stilregler (samma som övriga bespoke):**
- Inga gradienter eller skuggor
- `SOFT`-färg för dimman, `ACCENT` för etiketterna och de kristalliserade formerna
- `useBreathPulse` ger blobben en subtil andning så bilden lever utan att kräva andning av användaren
- Edge-fade på etiketter (samma teknik som löven i bäcken) så loopen inte hoppar

**Skiss:**
```text
   planering →
              ╭─ ~~~ ─╮
       oro → │  dimma  │ → [▢ minne]   (kristalliserad, driver ut)
              ╰─ ~~~ ─╯
   självkritik →
```

## Steg och script

Texterna är skrivna för just den här övningen — fokus på *sortering* och *avstånd*, inte på andning eller kropp.

1. **"Vänta in nästa tanke"** (20s)
   - "blicken mjuk, ingen ansträngning"
   - "förr eller senare dyker något upp"
   - "en bild, en mening, en oro"

2. **"Vad är det för sorts tanke?"** (35s)
   - "planering? oro? minne?"
   - "självkritik? fantasi? borde?"
   - "leta efter sorten, inte innehållet"

3. **"Sätt ordet på den"** (35s)
   - "säg tyst: 'det här är en oro-tanke'"
   - "eller 'det här är planering'"
   - "kort etikett, ingen analys"

4. **"Märk skillnaden"** (35s)
   - "tanken är fortfarande där"
   - "men nu är den ett objekt du ser"
   - "inte en sanning du är inuti"

5. **"Samma sort igen?"** (35s)
   - "många tankar är samma sort i ny förpackning"
   - "även då — sätt etiketten"
   - "'oro-tanke. igen.' räcker"

6. **"Tacka hjärnan, släpp"** (20s)
   - "tack för varningen, hjärna"
   - "jag har märkt den"
   - "nästa tanke får sin egen etikett"

**Closing:** "Tankar slutar inte komma. Du har bara fått ett verktyg att se dem med."
**Microcopy (done):** "Du satte ord på sorten. Det räknas."
**Reflection prompt:** "Vilken sorts tanke dök upp oftast?"

## Tekniska detaljer

- **ID:** `mark-tanken`
- **Kategori:** `reflection`
- **Kind:** `reflective`
- **Längd:** 4 min
- **Metric:** `oro` (samma som lov-i-backen)
- **requiresRating:** true
- **animation-fält:** `"drift"` (fallback — bespoke matchar på id)

### Filer som ändras

1. **`src/lib/exercises.ts`**
   - Lägg till övningsobjektet i listan (precis efter `lov-i-backen`, så reflection-blocket är samlat)
   - Lägg till `"mark-tanken"` i `POLISHED_IDS`-arrayen (samma fix som behövdes för löven)

2. **`src/components/animations/bespoke.tsx`**
   - Ny komponent `MarkTanken` som följer samma mönster som `LovIBacken`:
     - `useTimeSec` driver dimblobens path-morf och etiketternas drift
     - `useBreathPulse` ger subtil andning till blobben
     - Beräkna ett cykliskt index för "vilken etikett kristalliseras just nu" baserat på `t`
     - Edge-fade på etiketterna så loopen är osynlig
   - Registrera `mark-tanken` i `hasBespoke` och `BespokeFor`-uppslaget

3. **`.lovable/plan.md`** — uppdatera planen så den dokumenterar båda nya övningar.

## Vad jag INTE rör

- Befintliga övningar, deras texter, animationer eller hastigheter
- Kategorifärger, kortlayout, routing, startsidan
- `ovning.$id.tsx` — `BespokeFor` plockar upp den nya animationen automatiskt
