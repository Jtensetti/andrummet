## Problem

Båda animationerna återställs vid varje stegbyte vilket ger ett ryckigt "loop"-intryck istället för en sammanhängande rörelse som i resten av appen.

**Mjuk omstart (orb):** Steg som "Andas in/ut" styrs av andnings­logiken (krymper/växer mellan 0.4 och 1.0), men stegen "Stanna här" och "Stilla" har ingen andnings­etikett och faller tillbaka på en sinus­puls (0.6→1.0→0.6 per steg). Resultat: orben hoppar i storlek vid varje stegbyte — t.ex. slutar utandningen på 0.4 och börjar nästa steg på 0.6 — och pulsen i icke-andnings­steg känns som en egen liten loop.

**En sak åt gången (gather):** De 8 prickarna samlas in mot mitten över `stepProgress` 0→1, och snäpper sedan tillbaka ut till ringen vid nästa steg. Sex steg = sex återställningar. Metaforen ("samla det utspridda till en punkt") bryts.

## Lösning

Inga textändringar, inga nya animationer — bara förfining av befintliga `Orb` och `Gather` i `src/components/animations/index.tsx` så de följer hela övningens båge, precis som `Horizon`, `Meter`, `Stack` m.fl. redan gör.

### Gather — samlas en åt gången

Istället för att alla 8 prickarna pulsar in–ut per steg: en prick faller in i mitten per steg och stannar där. Det säger exakt det övningen säger ("välj en", "resten får vänta", "börja där").

- Använd `stepIndex` + `stepCount` + `stepProgress` för att avgöra hur många prickar som redan är i mitten, plus den som just nu glider in.
- Prickar som "valts" sitter still i en liten klunga nära centrum.
- Prickar som "väntar" sitter still på sin plats i ringen (ingen rörelse mellan steg).
- Den aktuella pricken interpolerar från sin ringposition in mot klungan över `stepProgress`.
- Mjuk easeInOut så rörelsen inte är linjär.

Resultat: en lugn, kumulativ samling över hela övningen — inget snäpper tillbaka.

### Orb — en enda mjuk andning genom övningen

Behåll andnings­kopplingen för "Andas in/ut", men ta bort den fristående sinus­pulsen i icke-andnings­steg och eliminera hoppen vid stegbyten.

- För steg med breath (`in`/`out`/`hold`/`rest`): interpolera storleken från **stegets startvärde** till **stegets slutvärde** utifrån stegets egen riktning (in: 0.45→1.0, out: 1.0→0.45, hold/rest: konstant).
- För steg utan breath ("Stanna här", "Stilla"): håll storleken konstant på samma värde som föregående steg slutade på — så det aldrig blir ett synligt hopp.
- Lägg till en mycket långsam, oberoende "andning" på bakgrundsringens opacity (sin över hela `progress`, inte per steg) så bilden lever utan att konkurrera med stegrytmen.

Resultat: orben rör sig som en lugn andning som följer instruktionerna, och stegbytena syns inte längre som ryck.

## Teknisk detalj

Filer som ändras:
- `src/components/animations/index.tsx` — `Gather` och `Orb` (cirka 15 + 25 rader)

`Gather` behöver `stepIndex`, `stepCount`, `stepProgress` (alla finns redan i `Props`). `Orb` behöver dessutom föregående stegs slutvärde — beräknas deterministiskt från `stepIndex` genom att gå igenom de andra stegen är dyrt; enklare lösning: vi har inte stegens etiketter här, så vi använder en enkel regel — låt icke-breath-steg hålla `0.72` (mellanvärdet) och sätt breath-steg så att de börjar/slutar på 0.72 för in/out där det är möjligt (in: 0.45→1.0, out: 1.0→0.45, hold/rest: 0.72). Kombinerat med fade-mellan-steg via `AnimatePresence` på övergripande nivå räcker det för att ta bort det synliga hoppet.

Ingen påverkan på andra övningar som använder `orb` eller `gather` — beteendet blir mjukare för alla.
