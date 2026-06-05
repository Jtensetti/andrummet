## Problem

När jag introducerade `TEXT_SPEED = 0.8` för att snabba upp text/voiceover med 20% förlorades den ursprungliga 1:1-synken mellan steg, animation, text och timer. Senast skalade jag även stegklockan med samma faktor — det gör övningen snabbare totalt, men ändrar fortfarande de ursprungliga stegtiderna som animationerna designades mot.

Original-designen: varje stegs `seconds` är sanningen. Animation, undertextsbyten, timer-räknare och progress-bar drevs alla från samma `stepElapsed / step.seconds` — perfekt synk.

## Lösning

Ta bort `TEXT_SPEED` helt i `src/routes/ovning.$id.tsx` och återgå till att använda `ex.steps[stepIdx].seconds` rakt av som enda tidsbas:

- rAF-loopen byter steg när `stepElapsedMs >= step.seconds * 1000`
- `stepSeconds = step.seconds` (ingen skalning)
- `totalSeconds = sum(step.seconds)` (ingen skalning)
- `stepProgress = stepElapsed / stepSeconds`
- `animStepProgress = stepProgress` (redan så)
- `progress = elapsed / totalSeconds` med `elapsed = sum prior raw seconds + stepElapsed`

Resultatet: animation, undertext, BoxBreath/BreathWave-räknare och progress-bar delar exakt samma klocka som från början. Om enskilda övningar känns för långsamma justerar vi `seconds` per steg i `src/lib/exercises.ts` i en separat omgång — då rör vi inte synken.

## Filer som ändras

- `src/routes/ovning.$id.tsx` — ta bort `TEXT_SPEED`-konstanten och alla `* TEXT_SPEED`-multiplikationer (rAF-loop, `stepSeconds`, `totalSeconds`, `elapsed`).

Inga ändringar i animationskomponenter eller `exercises.ts`.
