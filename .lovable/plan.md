# Plan: Gör 5-4-3-2-1 grounding perfekt

Klassisk grounding-övning för ångest. Användaren letar konkreta saker i rummet — sinne för sinne, nedräkning från 5 till 1. Inget tekniskt klurigt; det viktiga är att man **förstår exakt vad man ska göra** i varje sekund.

## Övningen

- **Ny övning**, ID: `grounding-54321`, kategori: `anxiety` ("Hantera oro").
- Fem steg, ett per sinne:
  1. **5 saker du ser** — 5 × 8 s = 40 s
  2. **4 saker du hör** — 4 × 8 s = 32 s
  3. **3 saker du känner** — 3 × 10 s = 30 s (kräver lite mer tid)
  4. **2 saker du luktar** — 2 × 12 s = 24 s
  5. **1 sak du smakar** — 1 × 15 s = 15 s
- Totalt ~2:20. `minutes: 3`.

## Vad animationen visar

En **stor cirkel med sinnes-ikon** i mitten (öga, öra, hand, näsa, mun — enkla SVG-glyfer) och **5/4/3/2/1 punkter runt om** som tänds en i taget allt eftersom man hittar nästa sak.

- Vid stegets start är alla prickar släckta utom en glödande "aktiv" prick.
- När tiden för en sak (8/10/12/15 s) går ut tänds nästa prick och nedräknaren ändras.
- När alla prickar lyser → fasen är klar → byter till nästa sinne.

Den aktiva pricken pulserar mjukt så man ser "jag jobbar på sak nr 3 nu".

Drivs av samma frame-klocka — `stepProgress` × `itemsInStep` ger aktivt index, inga tidsglapp.

## Text-mönster

```text
[stort ord / sinne]                  ← byts vid stegbyte
5 saker du ser

[stor numerär]                       ← "1 av 5", växer under stegets gång
Sak 1 av 5

[liten hjälptext]                    ← sinnes-specifik, byts per steg
Låt blicken vandra. Säg sakerna tyst för dig själv.
```

Övre raden står still i hela steget. Mellanraden tickar upp när man går vidare till nästa sak. Hjälptexten byts bara mellan steg, inte mitt i.

## Vad jag bygger

1. **Ny komponent** `src/components/animations/Grounding54321.tsx`
   - Props: `total` (5/4/3/2/1), `activeIndex` (0…total-1), `itemProgress` (0→1 inom aktuell sak), `sense` ("see" | "hear" | "feel" | "smell" | "taste").
   - Cirkel + sinnes-ikon i mitten, prickar runt om, glöd för aktiv prick.

2. **Ändring i `src/routes/ovning.$id.tsx`**
   - Tredje special-case bredvid `andas-i-en-ruta` och `lang-utandning`.
   - Beräknar `itemsInStep`, `activeIndex = floor(stepProgress * itemsInStep)`, `itemProgress = (stepProgress * itemsInStep) % 1`.
   - Visar sinnesnamn (stor rubrik), "Sak X av N" (mellanstor), hjälptext (liten).

3. **Datatouch i `src/lib/exercises.ts`**
   - Lägg till `grounding-54321` i SEEDS.
   - Använd `animation: "focus-lens"` som fallback-kind (komponenten är ändå special-case i route).
   - Övriga övningar (inkl. den befintliga "Tre saker du ser") lämnas orörda.

## Vad jag *inte* gör

- Rör inte "Tre saker du ser" — den får finnas kvar som en snabbare variant.
- Inga nya bibliotek.
- Ingen sinne-specifik bakgrundsbild eller ljud — håller det grafiskt och rent.
