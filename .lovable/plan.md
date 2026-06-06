## Mål

Gå igenom samtliga 45 övningar i `src/lib/exercises.ts` och putsa språket så det känns **svenskt, vardagligt och som om en lugn röst pratar** — inte översatt självhjälp.

Inga animationer, ingen timing, ingen struktur ändras. Bara orden.

## Vad jag tittar efter

Genom hela filen letar jag systematiskt efter:

1. **Engelska/amerikanismer**
   - Titlar: `Reset` → svensk titel, `Mikropaus` → enklare ord.
   - Lånord i flödet: *fixa, mindset, timer, reset, tracka, scrolla*.
   - Datormetaforer som låter som produktivitetsbloggar: "47 mentala flikar", "webbläsare med trettio flikar", "öppna det dokumentet, ring det samtalet".
   - Pep-talk-ekon: "Starkt jobbat", "Du gjorde det!", "Du är awesome", "Gå!".

2. **Översatt självhjälp-jargong**
   - "Tack för varningen, hjärna" (att tala till organ).
   - "Litet räknas. Litet är nog." (engelsk rytm: *small counts, small is enough*).
   - "Redo" som slutord (ekar engelskans *ready*).
   - "Du gör så gott du kan" (ren översättning av *doing your best*).

3. **Stelhet och tempo**
   - För många imperativ på rad ("Stäng. Märk. Välj.") — bryts upp eller mjukas.
   - Onödiga "tyst i huvudet", "säg det tyst" som upprepas i varenda steg.
   - "Andetaget" vs "andetaget ditt" — ibland naturligare med possessiv.
   - Korta huggiga rader som skulle flyta bättre som en hel mening.

4. **Specifika kulturella referenser**
   - "någon på instagram" → mer neutralt ("någon på en skärm").
   - Bilkörning i `Ångesten får inte köra bilen` — fungerar men språket runt ratten kan svenskifieras ("Vart vill du köra härnäst?" känns dubbat).
   - Surfbräda i `Surfa vågen` — behålls (etablerad ACT-metafor) men ordvalet runt mjukas.

5. **Konsistens**
   - FEELINGS-etiketterna på startsidan (`Lugna kroppen`, `Var snäll mot dig själv`, …) ska matcha samma ton som övningarna.
   - `categoryLabel` och `metric`-etiketter (METRIC_LABELS) stäms av.

## Vad jag *inte* rör

- `id` — bryter rutter och länkar.
- `seconds` per steg — bryter timing och animation.
- Antal script-rader per steg — bryter undertext-rytmen (`subtitleFor` delar upp tiden jämnt på antalet rader). Bytet sker rad-för-rad, samma antal in, samma antal ut.
- `animation`, `kind`, `category`, `minutes`, `requiresRating` — datastruktur.
- Andra filer än `src/lib/exercises.ts` (om inte en åtgärd kräver det, t.ex. METRIC_LABELS i samma fil).

## Arbetssätt

Ett pass, hela filen, en sammanhängande diff. För varje övning går jag genom:

```
title  →  short  →  steps[].label  →  steps[].script[]  →  closing
       →  metaphor.intro  →  reflectionPrompt  →  microcopy
```

Och stämmer sedan av:

- `FEELINGS[]` (startsidans etiketter och underrubriker)
- `METRIC_LABELS` (om någon etikett skaver)
- `categoryLabel`-strängarna i `build()`

## Exempel på riktning (för att kalibrera tonen)

- "Reset" → **"Sänk tempot"** (titel) + "Sänk tempot. Tre tag, en kropp." behålls som short.
- "Starkt jobbat" → **"Bra gjort."** eller helt enkelt "Det räcker."
- "Tack för varningen, hjärna / jag har märkt den" → **"Märkt. Jag noterar den. / Nästa tanke får sin egen etikett."**
- "Stäng 47 mentala flikar / webbläsare med trettio flikar" → **"Stäng några fönster"** (titel) + metaforen blir "Huvudet är fullt av öppna fönster. Vi stänger tre." Funkar utan tekniktermer.
- "öppna det dokumentet, ring det samtalet, börja där, nu" → **"öppna det du behöver, ta första raden, första klicket — börja där."**
- "Litet räknas. Litet är nog." → **"Det lilla räcker. Det får räknas."**
- "Redo" som slutord → **"Klar."** eller helt utelämnas.

Riktningen är *vardaglig svenska* i andnings- och kroppsövningar, *stillsamt poetisk* i reflektions- och kompassionsövningar, *rakt och nyktert* i ilska/fokus. Jag bedömer per övning enligt ditt svar.

## Leverans

En enda redigering av `src/lib/exercises.ts`. När den är på plats kan du gå in på 3–4 övningar du minns kändes stelaste, och säga var det fortfarande skaver — då tar jag ett kalibreringspass.
