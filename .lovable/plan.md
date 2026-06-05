
# Plan: Platta abstrakta animationer + rensning

Riktning från dig: ren geometri, platt färg, inga gradienter, inga skuggor, inget 3D, inget som "föreställer" en kropp/eld/löv. **Andas i en ruta** är referensen — bara en prick som vandrar runt en kvadrat.

## Princip för alla animationer

- Endast: cirklar, rektanglar, linjer, prickar.
- En platt fyllning + en linje. Aldrig fler än två färger ovanpå bakgrunden.
- Inga `boxShadow`, `linearGradient`, `filter: blur`, "glow"-haloar. Bort med dem även i befintliga `BoxBreath` / `BreathWave`.
- Rörelsen ska *visa vad texten säger*. Inget ska likna något — det ska bara röra sig rätt.
- Drivs av övningens klocka (`stepProgress`/`stepIndex`), inga egna transitions som krockar.

## Abstrakta primitiver (hela appen klarar sig på dessa sex)

```text
1. Box        prick vandrar runt en kvadrat, en sida per fas        (andning i ruta)
2. Bow        en båge som höjs/sänks                                (andning in/ut)
3. Orb        cirkel växer/krymper                                  (andning, hjärtslag, närvaro)
4. Meter      vertikal stapel som fylls eller töms                  (volym, sand, ankare, värme nedåt)
5. Dots       n prickar på rad, tänds en i taget                    (5-4-3-2-1, "tre saker", välj en sak)
6. Drift      en prick glider tvärs över en linje, en per steg      (löv, moln, trafik, tankar)
```

Trafikljuset (3 cirklar) kan ses som en variant av **Dots** vertikalt med tre färger. Vi behåller det som egen variant.

`BodyFigure`, `EmberCooling`, `LeavesOnStream`, `Grounding54321` (om den ritar sinnen som ikoner), `Drifter` (med "moln/löv/bil"-form), alla figurativa primitiver i `src/components/animations/index.tsx`, samt Lottie-mappningarna i `exercises.ts` — **bort**. Ersätts av de sex ovan.

## Övningar — vad varje övning ska ha

Markering: **[K]** = behåll, **[B]** = byt animation till abstrakt primitiv, **[T]** = ta bort som dubblett.

### Andas
- **andas-i-en-ruta** — [K] Box. *Rensa: ta bort glow/shadow i nuvarande BoxBreath.*
- **lang-utandning** — [K] Bow. *Rensa gradient och glow.*
- **andas-ner-i-magen** — [B] Orb (växer på in, krymper längre på ut). Inget "hand-på-mage".
- **andning-innan-mote** — [B] Box, 3 varv. Återanvänder samma primitiv.
- **andas-som-en-vag** — [T] dubblett av lang-utandning.
- **andning-nar-hjarnan-rusar** — [T] dubblett av lang-utandning.

### Snabb paus
- **sextio-sekunders-paus** — [B] Meter (töms uppifrån-ner under 60 s).
- **tre-saker-du-ser** — [B] Dots (3 prickar tänds en i taget).
- **mikropaus-vid-skrivbordet** — [B] Orb som mjukt sjunker i skala över stegen.
- **paus-innan-du-svarar** — [T] dubblett av rott-gult-gront.
- **paus-for-kaken** — [T] dubblett av slapp-kaken (body).
- **stang-47-flikar** — [B] Dots (lyser släcks en i taget — från många till få).

### Hantera oro
- **grounding-54321** — [B] Dots med variabelt antal (5,4,3,2,1) per steg. Skippa sinnes-ikonerna.
- **ankare** — [B] Meter som sjunker (tyngd i botten).
- **sank-volymen-pa-oron** — [B] Meter som dras ner i snäpp per steg.
- **oro-som-moln** — [B] Drift.
- **tankar-som-trafik** — [T] dubblett av oro-som-moln + lov-pa-en-flod (allt är "Drift").
- **angesten-far-inte-kora** — [K] reflektiv övning utan animation. Visa bara text + en stilla Orb i mitten.

### Släppa tankar
- **lov-pa-en-flod** — [B] Drift. (Ta bort `LeavesOnStream`.)
- **reset** — [B] Orb som långsamt minskar över hela övningen.
- **lagg-ner-stenen** — [T] överlappar lagg-undan-till-sen och vad-bar-jag-som-inte-ar-mitt.
- **lagg-undan-till-sen** — [B] Dots (lägger ner en lapp per steg = en prick släcks).
- **stress-som-ljudvolym** — [T] dubblett av sank-volymen-pa-oron.

### Fokusera
- **valj-en-sak** — [B] Dots i tre kolumner som sorteras (kan bli enkel 3×3 grid där vissa tänds).
- **fokuslinsen** — [B] Orb som krymper mot mitten (samlar fokus).
- **borja-litet** — [B] Dots — en enda prick tänds.
- **fokus-innan-skrivande** — [T] dubblett av borja-litet.

### Sova
- **sov-mjukare** — [B] Meter som töms långsamt (Candle utan låga).
- **lang-utandning-for-natten** — [B] Bow. (Konceptuellt dubblett av lang-utandning men kontext = natt, behålls.)
- **lagg-dagen-i-en-lada** — [B] Dots — en prick släcks per steg.
- **varmestralen** — [T] dubblett av kroppsskanning.

### Lugna kroppen
- **kroppsskanning-huvud-till-fot** — [B] Meter där en horisontell markör vandrar nedåt steg för steg (inte en kroppssilhuett).
- **kanna-fotterna** — [B] Orb längst ner i bild som lyser starkare per andetag.
- **slapp-kaken** — [B] Orb som mjuknar (skala 1.0 → 0.85, ingen "käke").
- **mjuka-axlar** — [B] Två Orbar som höjs och sänks (spänn/släpp).

### Reflektera
- **vad-behover-jag-just-nu** — [B] Dots — en prick per fråga.
- **livskvalitet-minus-jamforelse** — [B] Meter (måttstock) som läggs ner: vertikal blir horisontell.
- **vad-forsoker-kanslan-saga** — [B] Orb som långsamt växer (känslan får plats).
- **vad-bar-jag-som-inte-ar-mitt** — [B] Dots där prickar släcks/sorteras.

### Kompassion
- **tre-vanliga-meningar** — [B] Dots — 3 prickar tänds en per mening.
- **du-far-vara-mansklig** — [B] Orb, mjuk närvaro.
- **lagg-ner-piskan** — [T] överlappar du-far-vara-mansklig + sank-volymen-pa-oron.

### Ilska
- **svalna-innan-svar** — [B] Meter som töms (från full/het till låg/glöd). Ta bort `EmberCooling`.
- **rott-gult-gront** — [K] Dots vertikalt med 3 färger (trafikljus). *Rensa skuggor.*
- **vad-finns-under-ilskan** — [B] Orb som långsamt sjunker i ljusstyrka.
- **paus-innan-sms** — [T] dubblett av rott-gult-gront.

### Arbetsdag
- **innan-arbetsdagen-borjar** — [B] Orb som tänds (start).
- **mellan-tva-moten** — [B] Bow (samma som lang utandning).
- **efter-en-lang-dag** — [B] Meter som töms (stäng ner).
- **nar-inkorgen-morrar** — [B] Dots (sortera).
- **innan-du-hamtar-barn** — [B] Orb som mjuknar.

## Tekniska steg

```text
1. src/components/animations/primitives.tsx (ny)
   - Box, Bow, Orb, Meter, Dots, TrafficDots
   - Alla rena SVG, currentColor, ingen filter/gradient/shadow.

2. src/components/animations/index.tsx
   - AnimationFor mappar varje AnimationKind till en av primitiverna.
   - Behåll AnimationKind-strängarna (data ändras minimalt) men låt dem peka på primitiver.
   - Ta bort BodyFigure, Drifter (figurativ), LetterDrop, SoftHeart-grafik etc.

3. Rensa BoxBreath och BreathWave
   - Ta bort linearGradient, boxShadow, "glow". Bara stroke + flat fill.

4. Radera komponenter som inte längre används
   - src/components/animations/BodyScan.tsx
   - src/components/animations/EmberCooling.tsx
   - src/components/animations/LeavesOnStream.tsx
   - src/components/animations/Grounding54321.tsx (om den är figurativ — annars ersätt med Dots-rendering)
   - src/components/animations/LottiePlayer.tsx (Lottie är figurativt och tungt — bort)

5. src/routes/ovning.$id.tsx
   - Ta bort special-cases för svalna-innan-svar, lov-pa-en-flod, kroppsskanning-huvud-till-fot.
   - Behåll special-cases för andas-i-en-ruta, lang-utandning, grounding-54321 (men låt dem rendera primitiver istället för dedikerade komponenter).

6. src/lib/exercises.ts
   - Radera de övningar markerade [T] ovan (11 stycken).
   - Ta bort LOTTIE_BY_KIND-blocket och `lottie`-fältet helt.
   - Byt animation-värden för [B]-övningarna till de nya primitiv-namnen.

7. src/components/ExerciseCard.tsx
   - Behåll. Dekoren där är platta former, OK.
```

## Vad jag *inte* gör

- Rör inte textinnehållet i övningarna (du har redan rättat dem du brydde dig om).
- Lägger inte till nya övningar.
- Inga nya bibliotek. Inga gradienter.

Säg till om du vill fler eller färre dubletter borttagna — annars kör jag enligt listan ovan när du godkänt.
