Tre animationer i `src/components/animations/bespoke.tsx` görs om så bilden följer texten — inte tvärtom.

## 1. Vad behöver jag just nu? (`NeedDrop`)

Stegen: "Vad dyker upp?" → "Behov eller borde?" → "Vad hjälper?" → "Gör det litet" → "Kan du ge dig det?".

Ny visuell idé — **brunnen / lyssna nedåt**:
- En lugn cirkel i mitten = du. En vertikal axel går genom den: huvud (uppe) och kropp (nere).
- Steg 1: små ord-prickar bubblar upp ur huvudet, sprider sig — många tankar på en gång.
- Steg 2: skärm delas mjukt: vänster märkt "borde" (fyrkantiga prickar uppe vid huvudet), höger märkt "behov" (runda prickar nere vid bröst/mage). Prickar sorterar sig själva åt sina sidor.
- Steg 3: "borde"-sidan tonar ner. En enda rund "behov"-prick lyser upp och sjunker långsamt ner till magen.
- Steg 4: pricken krymper till en liten, tydlig kärna — "liten version".
- Steg 5: två händer (enkla bågar) sluter sig mjukt runt kärnan, andas med pulsen. "Att ge dig det själv."

Allt drivs av `stepProgress` med kontinuerlig lerp, ingen reset mellan stegen.

## 2. Sov mjukare (`SoftSleep`)

Ersätt nuvarande kroppspelare helt. Ny scen — **en natt passerar**:
- Bred horisontlinje längs mitten av canvas. Stjärnor svagt utspridda ovanför.
- En halvmåne stiger från vänster horisont, går i en mjuk båge tvärs över himlen och sjunker ner vid höger horisont. Banan följer `progress` (hela övningens progress, inte stepProgress) så månen rör sig kontinuerligt över alla steg.
- Himlen skiftar gradient över tiden: skymning → djupblå natt (mitten) → tidig gryning (slutet).
- Stjärnorna tonar in starkare runt månens högsta punkt och tonar ut mot slutet.
- Andningspuls (`useBreathPulse`) styr bara en mycket subtil skala på månen så den "andas" lugnt.

Textkopplingen blir metaforisk men ärlig: medan du mjuknar passerar natten.

För att kunna driva animationen på hela övningens progress (inte bara `stepProgress`) skickar vi vidare `stepIndex`/`stepCount` och räknar `overallProgress = (stepIndex + stepProgress) / stepCount` inne i komponenten. Inga API-ändringar behövs — props finns redan.

## 3. Ångesten får inte köra bilen (`NotDriving`)

Stegen: "Du sitter vid ratten" → "Namnge känslan" → "Ge den en plats" → "Den får skrika. Du kör." → "Vart vill du köra?" → "En liten handling".

Ny scen — **vy ut genom framrutan**:
- Ramen visar bilens insida nedtill: ratt centrerat nere, instrumentbräda, vindrutans båge upptill. Två händer på ratten på 10 och 2.
- Bakom rutan: en väg i centralperspektiv som rör sig **mot tittaren** (streckade mittlinjer skalas upp och glider neråt/utåt → känsla av att åka framåt). Horisont i mitten med ett mjukt gryningsljus.
- Passageraren (ångesten) sitter **från start** till höger om ratten: en liten rund form, bältad (ett diagonalt streck över sig), med små skakiga vibrationer (skriker). Den lämnar aldrig sin plats.
- Steg 1: ratten + händer framträder, vägen börjar röra sig långsamt.
- Steg 2: passageraren får en etikett/ord ovanför sig som byts (oro / rädsla / stress) — namnges.
- Steg 3: bältet drar åt sig tydligare, passageraren sitter still — "fönsterplats, bältad".
- Steg 4: passageraren skakar mer intensivt (skriker), vägen fortsätter i samma takt — föraren håller kursen.
- Steg 5: en mjuk vägskylt/pil tonar in på horisonten ("riktning").
- Steg 6: ett litet ljus tänds längre fram på vägen (en handling).

Vägens rörelse drivs av en kontinuerlig tids-loop (inte `stepProgress`) så den aldrig hackar mellan steg. Passagerarens skak-amplitud lerpas mjukt upp mot steg 4 och ner igen.

## Tekniskt

Alla tre komponenter skrivs om i `src/components/animations/bespoke.tsx`. Inga ändringar i `exercises.ts`, `ovning.$id.tsx` eller mappningen i `BESPOKE`. Färger via befintliga `--anim-accent` / `--anim-soft` / `--anim-on` CSS-variabler. Behåller `useBreathPulse` och `stepProgress`-easing-mönstret från övriga animationer.
