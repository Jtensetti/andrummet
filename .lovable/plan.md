# Synka resten av övningarna med andningsövningarnas textmönster

## Vad som faktiskt funkar i andningsövningarna

I `src/routes/ovning.$id.tsx` har `andas-i-en-ruta` och `lang-utandning` en egen render-gren som ger tre lugna textnivåer:

1. **En stor, stabil rubrik per steg** — byts bara när steget byts (`Andas in`, `Håll`, `Andas ut`, `Vila`). Ingen mid-step-shuffling.
2. **En sekundräknare** — siffrorna `1 2 3 …` lyser upp en i taget i takt med stegets sekunder.
3. **En liten konstant hjälptext** längst ner i uppercase tracking-widest (`Näsan in · munnen ut · längre ut än in`).

De **övriga** övningarna använder istället `subtitleFor()` som hackar upp `script`-arrayen efter `stepProgress`. Texten hoppar då mitt i ett steg, ofta osynkat med animation och voiceover-tempo — det är det som känns ryckigt.

## Vad som ändras

Bara `src/routes/ovning.$id.tsx`, "else"-grenen i `phase === "running"` (den som idag kör `BespokeFor` / `AnimationFor` + `subtitleFor`). Animationerna, tempot och `ex.steps` rörs inte.

### Ny struktur för icke-andningsövningar

```text
[ Animation ]

Stegrubrik (stor, fet, byts bara vid stegbyte)
● ● ● ○ ○ ○ ○        ← sekundräknare 1..stepSeconds
Hjälptext (ex.short i liten uppercase)
```

Konkret:

- **Stor rubrik**: `ex.steps[stepIdx].label`, animerad med samma `AnimatePresence` mode="wait" som idag men keyad på `stepIdx` (inte på `sub.index`) så den byts en gång per steg.
- **Räknare**: samma komponent-mönster som i `lang-utandning`-grenen — `Array.from({ length: stepSeconds }).map(n => <span class={n <= count ? "opacity-100" : "opacity-30"}>{n}</span>)` med `flex-wrap` så långa steg (16–20 s) radbryts snyggt.
- **Hjälptext**: `ex.short` i `text-xs font-semibold uppercase tracking-widest opacity-60`. Återanvänder fältet som redan finns på alla övningar — inget nytt fält i `Exercise`.

### Vad som tas bort

- `subtitleFor()`-funktionen och dess anrop i denna gren.
- Behovet av `script`-arrayen i UI:t för icke-andningsövningar. Vi lämnar `script`-fältet kvar i `src/lib/exercises.ts` (kan användas till voiceover senare), men det renderas inte längre.

### Vad som inte ändras

- `andas-i-en-ruta` och `lang-utandning` — de har redan mönstret.
- `ex.steps`, sekundlängder, `stepProgress`, rAF-loopen, animationerna.
- Intro / before / after / done-faserna.
- Krysset uppe i hörnet.

## Teknisk not

Räknaren beräknas som idag: `count = Math.min(stepSeconds, Math.floor(stepElapsed) + 1)`. Långa steg (t.ex. 20 s) får en wrappad rad med 20 prickar — samma visuella mönster som `BreathWave`-grenen redan använder med `flex-wrap`.
