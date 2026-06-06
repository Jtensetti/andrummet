# Ny övning: Löv i bäcken

En klassisk ACT-defusionsövning där man lär sig se sina tankar passera istället för att fastna i dem. Lövet är tanken. Bäcken är medvetandet. Tanken är inte du — den flyter förbi.

## Placering

- **Kategori:** `reflection` (passar bättre än anxiety — det är en observations­övning, inte en lugnande)
- **ID:** `lov-i-backen`
- **Titel:** "Löv i bäcken"
- **Längd:** 3 min
- **Metric:** `clarity` (eller motsvarande befintlig — kollas mot METRIC_LABELS)
- **requiresRating:** true
- **reflectionPrompt:** "Vilken tanke var svårast att släppa förbi?"

## Animation (bespoke)

En platt, ovanifrån-vy av en bäck som rinner från vänster till höger. Två böljande linjer markerar strandkanterna (`SOFT`). Längs strömmen färdas ovala löv (`ACCENT`) i olika takt och y-offset. Varje löv föds till vänster, driver förbi, och försvinner till höger. Allt drivs av `useTimeSec` så rörelsen är kontinuerlig och oberoende av steg.

**Pedagogisk koppling:**
- Lövens hastighet är konstant — användaren kan inte stoppa dem, bara titta på
- När `stepProgress` byter steg byts inte animationen, bara texten — det förstärker "tankarna kommer och går, du gör inget"
- Inga gradient/skugga, samma stil som övriga bespoke-animationer
- Subtil andningspuls (`useBreathPulse`) på bäckens svaja, så bilden andas utan att kräva andning

**Skiss:**
```text
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  ← strand (SOFT)
   🍂      🍂            🍂      →
        🍂        🍂           🍂  →
   🍂           🍂      🍂        →
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
(Löven renderas som enkla ellipser med liten rotation, inte emoji.)

## Steg och script (övningsspecifikt språk)

Texterna är skrivna för just denna övning — ingen "andas in / andas ut", inget "släpp axlarna". Fokus ligger på observation och defusion.

1. **"Sätt dig vid bäcken"** (20s)
   - "blicken mjuk, ingenstans att vara"
   - "bäcken rinner av sig själv"

2. **"Lägg nästa tanke på ett löv"** (30s)
   - "vänta tills något dyker upp i huvudet"
   - "en oro, en plan, ett minne — vad som helst"
   - "lägg den på lövet och låt det driva"

3. **"Tankar är inte order"** (40s)
   - "du behöver inte hålla med"
   - "du behöver inte argumentera"
   - "låt lövet passera även om tanken känns viktig"

4. **"Om du följer med lövet"** (30s)
   - "märk det — du har klivit i vattnet"
   - "kliv upp på stranden igen"
   - "nästa tanke, nytt löv"

5. **"Samma bäck, andra löv"** (40s)
   - "tankar upprepar sig — det är okej"
   - "samma tanke får ett nytt löv"
   - "den behöver inte lösas, bara passera"

6. **"Lämna bäcken sakta"** (20s)
   - "bäcken finns kvar utan dig"
   - "ta med dig blicken, inte tankarna"

**Closing:** "Bäcken finns kvar nästa gång du behöver den."
**Microcopy (done):** "Du satt och tittade. Det räknas."

## Filer som ändras

- `src/lib/exercises.ts` — lägg till övningen i listan med category `reflection`, fyll i steps/script/closing/microcopy. Sätt `animation: "river"` (fallback ignoreras eftersom bespoke matchar id).
- `src/components/animations/bespoke.tsx` — ny komponent `LovIBacken` + registrera id `lov-i-backen` i `hasBespoke` / `BespokeFor`-uppslaget (samma mönster som befintliga bespoke-övningar).

Inga ändringar i `ovning.$id.tsx` (BespokeFor plockar upp den automatiskt). Inga ändringar i routing, kategorifärger eller startsidan.

## Vad jag INTE rör

- Befintliga övningar, animationer, hastigheter, kategorifärger, kortlayout.
- Andnings-UI med stegcountern (denna övning använder ren script-undertext, samma som övriga reflection-övningar).
