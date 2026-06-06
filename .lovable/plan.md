# Mjuka ut animationerna

## Vad som händer just nu

Box-andning och våg-andningen flyter eftersom de drivs av **en enda kontinuerlig parameter** (`phaseProgress` 0→1) som glider in i nästa fas utan att något annat värde byter sida.

De bespoke-animationerna som hackar (`HeldInArch`, `CloseTabs`, `NotDriving`, `FocusLens`, `BodyScan`, `NeedDrop`, `KindSentences`, `FlamesToEmber`, `MeetingsTimeline`, `LeavesOnStream`, `NameTheThought`, `SnowGlobeSettle`, `RideTheWave` m.fl.) bryter mot detta på tre vanliga sätt:

1. **Diskret grenning på `stepIdx`.** Värden som `jitterAmount = stepIdx === 0 ? 1 : stepIdx === 1 ? 0.3 : 0` hoppar direkt vid varje stegbyte istället för att tona. Samma med `stand`, `shoulderDrop`, `dropY`, `arrowOp`, `emberOp`, `lensOp` osv. När `stepIdx` växlar ändras värdet i en frame.
2. **`stepProgress` återställs till 0 vid varje steg.** Allt som skrivs `easeInOut(sp)` startar om från noll. För en *kontinuerlig* form (t.ex. en boll som faller hela övningen) blir det en synlig återstart.
3. **`transition: transform 220ms linear` på en grupp vars `transform` redan uppdateras varje frame** (HeldInArch). CSS-övergången släpar efter rAF-uppdateringen och skapar en stegig "catch-up"-rörelse.

Box-andningen undviker allt detta: den läser bara `phaseIndex` + `phaseProgress` och ritar en punkt på en kvadrat-kant. Inget värde är "olika" mellan steg.

## Lösning — en gemensam mall

Alla bespoke-animationer ska drivas av:

- `u = totalT(p)` — kontinuerlig 0..1 över hela övningen (finns redan)
- `t = useTimeSec()` — för wobble/drift som inte ska återstartas
- `breathe = useBreathPulse(...)` — för andnings-puls

Diskreta `if (stepIdx === N)`-grenar ersätts med **envelope-funktioner** över `u`:

```ts
const envelope = (start, peak, end, u) => {
  // mjukt upp till peak, mjukt ner till end
  return smoothstep(start, peak, u) * (1 - smoothstep(peak, end, u));
};
const ramp = (a, b, u) => smoothstep(a, b, u); // 0→1 mellan a och b
```

Resultat: ingen variabel ändrar härkomst mellan steg, allt rör sig som en kontinuerlig kurva. Stegbytet blir osynligt — texten byts men formen flyter vidare.

## Approach

Jag gör det **i två omgångar**, inte alla på en gång — varje animation behöver verifieras visuellt och en stor diff-batch gör det svårt att se vad som gick fel.

### Omgång 1 — fixa de mest synligt hackiga + den vi just byggde

1. **`HeldInArch`** — ta bort `transition: transform 220ms linear` (rAF + CSS-transition krockar). Lämna kvar `scale()` direkt på varje frame. Mjuka övergångar mellan faserna är redan envelope-baserade, så när transitionen är borta blir det smidigt.
2. **`CloseTabs`** — ersätt `stepIdx`-grenar i `jitterAmount`, `liftY`, `dim`, `fall` med envelopes över `u`. Brickorna ska *glida* till lådan, inte vänta på "sitt" steg och sedan hoppa.
3. **`NotDriving`** (`reset`-bars, `FocusLens`) — samma mönster: ersätt `stepIdx === N ? easeInOut(sp) : ...` med `smoothstep(a, b, u)`.

### Omgång 2 — resten

`BodyScan`, `NeedDrop`, `KindSentences`, `FlamesToEmber`, `MeetingsTimeline`, `LeavesOnStream`, `NameTheThought`, `SnowGlobeSettle`, `RideTheWave`. Samma refaktor, men jag tar dem i en omgång till efter att du sett att omgång 1 ser rätt ut, så vi vet att mönstret känns bra innan jag applicerar det brett.

### Vad jag *inte* rör

- `BoxBreath` och `BreathWave` — de flyter redan korrekt.
- `useTimeSec` / `useBreathPulse` / `totalT` — fungerar.
- Texter, script, exercise-data — inget innehåll ändras, bara rörelsen.
- Routerfilen `ovning.$id.tsx` — timern är redan rAF-driven.

## Förväntat resultat

När du tittar på en övning ska formen aldrig "klicka" till ett nytt läge när texten byter. Bollen glider, bågen växer, brickorna sjunker — allt på en enda kontinuerlig kurva från start till slut.

## Vill du att jag kör omgång 1 nu?

Jag kan börja direkt med `HeldInArch` + `CloseTabs` + `reset`/`FocusLens` så ser du mönstret. Säg till om du hellre vill att jag tar alla på en gång.
