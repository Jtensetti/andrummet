
# Pilot: en bespoke animation per kategori

## Vad som inte funkar nu
Primitiverna (`orb`, `hexagon/polygon`, `drift`, `weight` …) är generiska geometriska loopar. De är fina men säger ingenting om vad du faktiskt ska göra. "Ångesten får inte köra bilen" som en snurrande hexagon → ingen koppling.

Dessutom: animationerna återställs hårt vid varje steg-byte istället för att flyta vidare i samma form.

## Ny princip
1. **En animation per övning** (inte per primitiv). Animationen är gjord *för just den övningen* och dess steg-script.
2. **Fortfarande abstrakt och platt** — geometri, inga figurer, inga gradienter/skuggor. "Andas i en ruta" är förebilden: en prick som följer en kvadrat, ett moment per sida.
3. **Synkad med texten.** Varje steg har redan `label` + `script`. Animationen får samma steg-index och stepProgress som driver formen — när texten säger "lägg den första i 'sen'-lådan" så landar en bricka i lådan.
4. **Snygg loop.** Inga abrupta resets mellan steg. Antingen
   - state-machine: formen står kvar i sluttillstånd för steg N och fortsätter därifrån in i steg N+1, eller
   - cyklisk: hela övningen är en kontinuerlig loop (typ box-breath) där steget bara byter färgton/markör.

## Pilot — 11 övningar, en per kategori
Vi gör en åt gången, du godkänner, sen nästa. Förslag på vilken som blir "kategorins ansikte" och vad animationen visar:

| Kategori | Övning | Animation (idé) |
|---|---|---|
| breath | **Andas i en ruta** ✓ (klar) | Prick runt kvadrat, en sida per fas |
| breath (extra) | **Lång utandning** ✓ (klar) | Båge som fylls (in 4s) / töms (ut 7s) |
| quick-pause | **Stäng 47 mentala flikar** | 3 brickor överst, en glider ner i "låda" per steg, hög blir låg |
| anxiety | **Ångesten får inte köra bilen** | Horisontell väg: en stadig prick (du) i mitten + en mindre, oroligare prick som först studsar runt ratten, sen sätter sig vid sidan medan vägen rullar vidare |
| stress | **Reset** | Tre staplade segment (axlar/käke/andetag) som tappar höjd ett i taget |
| focus | **Fokuslinsen** | Många små prickar i utkanten → drar in mot ett centrum tills bara en finns kvar |
| sleep | **Sov mjukare** | Horisontlinje som sänks i mjuka steg, en cirkel (sol/måne) glider ner under linjen |
| body | **Kroppsskanning** (välj kortaste) | Lodrät stapel där en ljus markör vandrar uppifrån ned, segment "mjuknar" (tjocklek minskar) när den passerar |
| reflection | välj en | Cirkel som sakta ritar sig själv runt ett centrum — en varv per fråga |
| compassion | välj en | Två cirklar som närmar sig varandra och överlappar mjukt (du + du) |
| anger | välj en | Skarp triangel som sakta roterar till en rundad form, en kant per andetag |
| worklife | välj en | Tidslinje med block (möten) — ett block tonar ner per steg tills det blir luft mellan dem |

Övriga övningar i kategorin behåller tills vidare de generiska primitiverna — vi byter ut dem efter pilotrundan.

## Hur jag bygger varje animation
- Egen komponent under `src/components/animations/exercises/<id>.tsx`.
- Tar emot `stepIndex`, `stepCount`, `stepProgress` (0–1 inom steget) och `phase` (label-strängen). Inget annat.
- Använder bara `var(--anim-accent)` / `var(--anim-soft)` / `currentColor` — kategorifärgen kommer fortsatt från `ovning.$id.tsx`.
- `AnimationFor` får en lookup: om övningens `animation`-fält är ett känt övnings-id → rendera dess komponent, annars fall tillbaka till nuvarande primitiv.
- **Loop utan reset:** komponenten håller eget internt state med `useRef` + rAF som *inte* nollställs vid stegbyte — bara fas-mål byts. Övergångar via `framer-motion`s `animate` mot nytt target.

## Fråga innan jag börjar
1. **Pilotomfång:** kör vi alla 11 på en gång, eller börjar vi med 3 (anxiety, quick-pause, stress) för att se om formspråket sitter innan vi rullar ut resten?
2. **Övningsval per kategori:** håller listan ovan, eller vill du peka ut en annan övning som kategorins ansikte (t.ex. "ankaret" istället för "bilen" för anxiety)?
3. **Övriga övningar i samma kategori under tiden:** ska de ärva pilot-övningens animation (så slipper vi se generisk hexagon), eller behåller vi nuvarande primitiver tills var och en får sin egen?
