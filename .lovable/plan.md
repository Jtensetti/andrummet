
## Mål
Mindre rörig app, mer betydelsefulla övningar, mer levande animationer, och en analys som uppdateras direkt mellan enheter.

## 1. Ny informationsarkitektur — "Känsla först, övning sen"

**Hem (`/`) blir ett rent rutnät av känslor — inget annat ovanför.**
Sex kakel med varsin färg, ikon och ton:

```
Lugna mig    │ Fokusera     │ Släppa oro
Somna        │ Ladda om     │ Vara snäll mot mig själv
```

Det här ersätter dagens blandning av "behov", "rekommenderat", "senaste" och "utvalt" på startsidan.

**Nivå 2 — kategorisida `/k/$category`:**
Färgtemat från kakelet tar över hela sidan (bakgrund, accenter, knappar). Här ligger 3–5 övningar för den känslan, en kort förklaring av vad kategorin handlar om, och en "snabb 60 sek"-knapp överst. Inga andra kategorier syns — fokus håller sig.

**Nivå 3 — `/ovning/$id`:** spelaren som redan finns, men ärver färgtemat från kategorin (via CSS-variabel som sätts på `<main>`).

**Mobilnav blir 3 ikoner istället för 5:**
- Hem (känslorutnätet)
- Min vecka (historik + mönster)
- Profil (inloggning, inställningar)

"Reflektion" som egen flik försvinner — reflektion sker alltid efter en övning, frivilligt, inte som separat destination. "Insikter" och "Min vecka" slås ihop till en sida med flikar.

**Desktop = spegeln.** Sidopanelen byter fokus från navigation till "Du den senaste veckan": dominerande känsla, snittförändring före/efter, mönster över dagen, kategorimix. Mobil = gör övningen; desktop = förstå mönstret.

## 2. Fler övningar — metaforer som kärnfunktion

Lägger till åtta nya övningar utöver de befintliga. Alla är konkreta åtgärder, inte bara andetag:

- **Stäng flikarna** (stress) — välj tre saker som tar plats just nu, "stäng" dem en i taget visuellt. Skriv en sak du parkerar till imorgon.
- **Passagerare på bussen** (ångest) — ångesten får sitta med, men du kör. Namnge känslan, ge den en plats, fortsätt rikten.
- **5-4-3-2-1** (akut) — fem saker du ser, fyra du hör, tre du känner, två du luktar, en du smakar. Klassisk grounding.
- **Tre vänliga meningar** (självmedkänsla) — skriv tre saker du skulle säga till en vän i samma situation. Läs dem för dig själv.
- **Lägg ner stenen** (oro) — visuell metafor: bär runt på en sten hela dagen, var lägger du den nu? Skriv vad du släpper i 5 minuter.
- **Sortera lådan** (fokus) — tre saker du gör nu, tre senare, tre aldrig. Tvinga fram beslut, inte fler tankar.
- **Värmestrålen** (sömn) — föreställ dig att en varm stråle rör sig från hjässan till tårna. Varje del du passerar blir tung.
- **Tacksamhet utan glitter** (ladda om) — tre saker som funkade idag, även om de var små. Ingen taggig positivitet.

Varje övning får en kort metafor-intro innan steg 1 (en mening + en illustration), inte bara en stegtitel.

## 3. Animationer — nya rörelsemönster

Idag är allt fram-och-tillbaka eller skala upp/ner. Byter till banor och beteenden som matchar övningens mental bild:

- **Spiral inåt / utåt** för andning — istället för pulserande cirkel rör sig en linje i en logaritmisk spiral.
- **Orbit** — flera prickar går i ellipsbanor kring ett centrum, fasförskjutna.
- **Pendel** — mjuk svängning kring ett upphängningspunkt, för "passagerare på bussen".
- **Drivande löv** — bezier-banor som vinglar nedåt, för "tankar som passerar".
- **Flikar som stängs** — fyrkanter glider ut åt sidorna och bleknar, för "stäng flikarna".
- **Värmegradient som vandrar** — vertikal gradient med en ljus zon som sakta rör sig från topp till tå, för "värmestrålen" och kroppsskanning.
- **Sten som lyfts** — en form som sänker sig in i marken / försvinner i horisont, för "lägg ner stenen".
- **Vågor med olika frekvens** — sömn-vågorna får tre olika frekvenser och fas, känns havsmer än repetitiv.
- **Konstellation som ritas** — punkter dyker upp och förbinds med linjer en i taget för 5-4-3-2-1.

Tekniskt: bygger 4–5 nya animationskomponenter med Motion-paths och `useTransform` på en gemensam progress-driver, så rörelserna kopplas till övningens framsteg istället för bara att loopa. Behåller `breath-blob` och `box-breath` men piffar dem (orbit-prickar runt blobben, ljus som åker längs box-kanten istället för diskreta hopp).

## 4. Realtid + cross-device i analysen

Datakopplingen finns redan (sessions-tabellen, RLS, realtime-publication, sync från localStorage). Det som saknas är att analyssidorna lyssnar på samma kanal som `useHistory` redan gör.

- `min-vecka` och `insikter` använder redan `useHistory()` — den hooken har redan en realtime-subscribe på `sessions`-tabellen filtrerad på user_id. Verifierar att alla beräkningar (snitt före/efter, mönster över veckodagar, kategorimix) re-renderar när nya rader kommer in.
- Lägger till en liten "synkad" / "senast uppdaterad nu" indikator i headern på analyssidan så det syns att det är live.
- Slår ihop sidorna till `/min-vecka` med två flikar: **Pass** (lista + dagsmönster) och **Insikter** (före/efter, kategorimix, dominerande känsla).
- Desktop-sidopanelen får en mini-version av samma data så man ser sitt mönster utan att klicka.

## 5. Progression byggd på effekt, inte aktivitet

På min-vecka-sidan ersätts "X minuter, Y dagars streak" som primär siffra med:

- **Snittförändring före → efter** ("Du går i snitt från 7 till 4 i stress")
- **Vad funkar bäst för dig just nu** — kategorin med störst snittförbättring de senaste 14 dagarna
- **Mönster över dagen** — när på dygnet du oftast behöver paus
- **Senaste reflektion** (om någon)

Aktivitet (minuter, antal pass) flyttas till en sekundär rad. Streak tas bort helt — bidrar mer till skam än till hjälp.

## Tekniska detaljer

- Ny katalog `src/components/animations/` får filer per rörelsemönster (`spiral.tsx`, `orbit.tsx`, `pendulum.tsx`, `drifting-leaves.tsx`, `closing-tabs.tsx`, `warm-beam.tsx`, `constellation.tsx`, `lifting-stone.tsx`). En `index.tsx` mappar `AnimationKind` → komponent.
- `exercises.ts` utökas med 8 nya övningar + ett valfritt `metaphor: { intro: string, illustration?: AnimationKind }` fält.
- Ny route `src/routes/k.$category.tsx` för kategori-vyn. `ovningar.tsx` blir omdirigering till hem eller tas bort.
- `index.tsx` skrivs om till rent känslorutnät.
- `min-vecka.tsx` får interna flikar och absorberar `insikter.tsx` (insikter-routen tas bort).
- `AppShell.tsx` får ny 3-ikoners mobilnav, desktop-sidopanelen får analys-widget istället för bara länkar.
- Färgtema per kategori sätts via CSS-variabel på kategori-route och spelaren, så hela undersidan ärver tonen.

## Frågor innan jag bygger

Inget kritiskt — jag har tillräckligt för att börja. Två frågor jag löser själv om jag inte hör annat:
- Behåller "Akut paus" som en flytande knapp som syns på hela appen (snabb tillgång oavsett var man är), eller bara på hem-rutnätet? Default: flytande knapp i hörnet.
- Tar bort `/reflektion`-routen helt eftersom reflektion sker efter övning. Default: ja, ta bort.
