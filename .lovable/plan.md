# Plan: En till övning i de tunna kategorierna

## Bakgrund

På startsidan listas alla 11 kategorier, men endast övningar i `POLISHED_IDS` (i `src/lib/exercises.ts`) visas på kategorisidorna. Idag är fördelningen:

| Kategori | Polerade idag |
|---|---|
| Lugna kroppen (body) | 1 — Kroppsskanning |
| Fokusera (focus) | 1 — Fokuslinsen |
| Sova (sleep) | 1 — Sov mjukare |
| Snabb paus (quick-pause) | 1 — Stäng några fönster |
| Arbetsdag (worklife) | 1 — Mellan två möten |
| (övriga) | 2–3 |

Mål: en till per kategori — totalt 5 nya — där varje övning kompletterar (inte upprepar) den befintliga, har en metafor som hänger ihop med vald animation, och språk i samma ton som de senaste språkjusteringarna (kort, ovanifrån-fritt, nedtonat, svenskt).

Allt återanvänder befintliga animationsprimitiver i `src/components/animations/index.tsx` — inga nya animationer behöver byggas.

---

## De fem nya övningarna

### 1. Lugna kroppen — "Släpp axlarna tre gånger"
- **Komplement till:** Kroppsskanning (lång, hela kroppen) → den nya är **kort, fysisk, en sak**.
- **Längd:** 2 min, `kind: "short"`, metric: `kroppsspänning`.
- **Animation:** `weight` — en cirkel sjunker långsamt längs en lodrät linje. Varje steg = ett kroppsområde släpps, vikten sjunker ett snäpp.
- **Pedagogiskt:** spänning = något som hålls uppe. Att släppa = låta tyngden falla. Synkat: cirkeln rör sig nedåt exakt i takt med stegets klocka.
- **Steg (skiss):** Lägg märke till axlarna → släpp axlarna → mjuka käken → släpp pannan → lång utandning → klart.
- **Avslut:** "Tre platser mjukare. Det räcker."

### 2. Fokusera — "En sak åt gången"
- **Komplement till:** Fokuslinsen (zoom in på en uppgift) → den nya är **valet i sig**: rensa bordet innan du börjar.
- **Längd:** 3 min, `kind: "short"`, metric: `fokus`.
- **Animation:** `gather` — åtta punkter glider in från kanten mot mitten och blir en kärna. Distraktionerna samlas till en enda punkt = den du gör nu.
- **Pedagogiskt:** känslan av att "allt drar i mig samtidigt" blir bildligt rensad. Punkterna kommer in i takt med stegen.
- **Steg (skiss):** Vad ligger på bordet just nu? → välj en sak → resten får vänta sin tur → bestäm var du börjar → börja där.
- **Avslut:** "En sak. Resten finns kvar — men inte i vägen."

### 3. Sova — "Räkna ner från tio"
- **Komplement till:** Sov mjukare (kroppsavspänning) → den nya är **klassisk nedräkning** med utandning per siffra.
- **Längd:** 4 min, `kind: "short"`, metric: `trötthet`.
- **Animation:** `meter-down` — en mätare som tömmer sig stegvis. Tio steg, ett snäpp per utandning.
- **Pedagogiskt:** insomning är en sänkning, inte en knapp. Mätaren går exakt en tiondel ner per steg = synligt mått på att du landar.
- **Steg (skiss):** 10 steg där varje är "Andas ut — [siffra]" + kort viskning. Sista steget tystnar.
- **Avslut:** "Du behöver inte komma till noll. Du behöver bara sjunka."

### 4. Snabb paus — "Mjuk omstart"
- **Komplement till:** Stäng några fönster (rensa tankar) → den nya är **kroppslig återställning** mellan två sysslor.
- **Längd:** 1 min, `kind: "short"`, metric: `stress`.
- **Animation:** `orb` — en cirkel som krymper till nästan inget och växer tillbaka mjukt. Som när en skärm släcks och tänds igen.
- **Pedagogiskt:** övergång = en mjuk paus, inte ett avbrott. Cirkeln rör sig med andetaget: krymper på ut, växer på in.
- **Steg (skiss):** Stanna här → andas ut (krymp) → andas in (väx) → en till → klart, byt riktning.
- **Avslut:** "Inte ny dag. Bara ny minut. Räcker."

### 5. Arbetsdag — "Stäng dagen mjukt"
- **Komplement till:** Mellan två möten (övergång *inom* dagen) → den nya är **avslutet av dagen**.
- **Längd:** 3 min, `kind: "short"`, metric: `stress`.
- **Animation:** `horizon` — horisontlinjen sjunker över hela övningen, som en solnedgång. Inget kvar att lyfta.
- **Pedagogiskt:** arbetet upphör inte av sig självt — kroppen behöver en signal. Horisonten som sänks = "nu mörkar vi dagen".
- **Steg (skiss):** Sista mejlet är skickat → vad blev gjort idag? → vad lämnar du till imorgon? → en lång utandning → stäng locket.
- **Avslut:** "Dagen är inte färdig. Men din del är slut för idag."

---

## Tonläge för texterna

Samma som de nyligen översatta övningarna: korta meningar, vardagligt svenskt, ingen wellness-amerikanism ("manifestera", "din inre kraft", "magnifikt"), inget pekande uppifrån. Skripten håller sig till `["kort fras", "kort fras"]`-mönstret per steg — som BOX/WAVE i filen.

Jag skriver klart hela texten (titel, kort beskrivning, steg-skript, avslut, metafor-intro) per övning innan implementation. Du får se allt i samma leverans.

---

## Tekniskt (för referens)

Allt sker i en fil: `src/lib/exercises.ts`.

1. Lägg till fem nya `Seed`-objekt i `SEEDS`-arrayen, varje med kategori, animation, metric, steps, closing och metaphor enligt ovan.
2. Lägg till de fem nya id:na i `POLISHED_IDS` så att de syns på kategorisidorna.
3. Inget annat berörs: animationerna finns redan, kategorikorten finns redan, routern hanterar `/ovning/$id` redan.

Inga DB-ändringar. Inga nya komponenter. Inga routes. Ingen designändring i UI.

---

## Vad du behöver bekräfta

Antingen "kör hela planen" — då skriver jag de fem övningarna och lägger in dem — eller säg vilken av de fem du vill ändra koncept/animation på först.