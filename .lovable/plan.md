
# Optimering av Andrum

Behåller all befintlig teknik: TanStack-routing, `useHistory`, Supabase-sync, auth, `ovning.$id.tsx`-spelaren, `k.$category.tsx`, AppShell. Inga DB-migrationer. Detta är en **innehålls-, animations- och layoutomgång**.

## 1. Rensad mobil-startsida (`src/routes/index.tsx`)

Ny struktur, max ett syfte per skärm:

```text
┌─────────────────────────────┐
│  Vad behöver du just nu?    │
│                             │
│  [ Starta 60 sek paus ]     │  ← stor primär-CTA
│                             │
│  8 behovskakel (2 kolumner):│
│  Lugna kroppen   Andas      │
│  Hantera oro     Släppa     │
│  Fokusera        Sova       │
│  Reflektera      Snabb paus │
│                             │
│  Max 4 "för dig just nu"    │  ← liten sektion, inte dominant
└─────────────────────────────┘
```

Tas bort från mobilstart: statistik, veckosammanfattning, historik-preview. Allt sådant flyttas till `/min-vecka` och desktop-sidopanelen.

## 2. Två tydliga övningstyper

Utöka `Exercise`-typen i `src/lib/exercises.ts`:

```ts
type ExerciseKind = "short" | "reflective";
// short: 30s–3min, konkret, animation styr handling
// reflective: 4–12min, 4–8 reflektionssteg, animation håller rytm
```

Filterchip i `k.$category.tsx`: **Korta** / **Reflekterande** / **Alla**.

## 3. 15 nya animationstyper (ersätter generiska centrum-ut)

Ny katalog `src/components/animations/` med en fil per typ. Varje animation har **egen rörelselogik kopplad till övningens syfte** — ingen pulsblob som default.

| # | `kind` | Rörelse | Används för |
|---|---|---|---|
| 1 | `box-breath` | Prick åker längs fyrkantens sidor, en sida per fas | Boxandning |
| 2 | `breath-wave` | Horisontell våg in/ut från sidan | Andningsvåg |
| 3 | `body-scan` | Ljuspunkt vandrar nedåt längs siluett, stannar vid zoner | Kroppsskanning |
| 4 | `passing-traffic` | Former glider vänster→höger i olika hastighet/höjd | Tankar som trafik |
| 5 | `drifting-clouds` | Långsamma moln med olika opacitet över himmel | Moln/känslor |
| 6 | `anchor-drop` | Vertikal sjunkande tyngd mot botten | Grounding |
| 7 | `focus-lens` | Spridda punkter samlas gradvis mot mitten | Fokus (endast) |
| 8 | `sorting-shelf` | Lappar glider in i 3–4 fack | Sortera tankar |
| 9 | `unknotting` | SVG-linje med trasslig path → mjukare path | Släpp spänning |
| 10 | `walking-path` | Liten figur går steg-för-steg genom färgfält | Lång reflektion |
| 11 | `traffic-light` | Rött → gult → grönt, en åt gången | Paus före reaktion |
| 12 | `battery-fill` | Ojämn, långsam fyllning | Återhämtning |
| 13 | `volume-slider` | Stort reglage dras nedåt | Sänk intensitet |
| 14 | `mailbox` | Lappar läggs i låda märkt "sen" | Lägg undan |
| 15 | `ember` | Platt eld → glöd över tid | Ilska |

Tekniskt: en gemensam `progress` (0–1) drivs av spelaren och skickas till animationen via prop, så rörelsen följer övningens framsteg istället för att bara loopa. `AnimationFor` i `src/components/animations/index.tsx` mappar `kind` → komponent. `breath-blob` och centrum-skala-animationer tas bort som default; finns kvar endast om någon övning uttryckligen behöver dem.

## 4. Övningsspelaren (`src/routes/ovning.$id.tsx`)

Helskärm, ett syfte per vy. Behåller fas-flödet `intro → before → running → after → done` men städar `running`:

- Endast: färgtema, central animation, **en** instruktion åt gången, diskret progress-rad, paus, X.
- Tar bort sekundära element, hjälptext, "steg X av Y" som siffra (visas bara i progress-baren).
- Instruktioner från `exercise.steps[].label` visas en åt gången, ingen lista.

`reflective`-övningar får en lugnare layout: instruktion som typewriter-fade, längre stegtider, valfri "skriv en tanke"-prompt mellan steg på sista tredjedelen.

## 5. Skattning före/efter — relevant dimension per övning

Utöka `metric` på övning så att den styr frågetexten. Visa **bara om övningen har `requiresRating: true`** — inte alla övningar varje gång.

Återkoppling efter: "Din skattning gick från 7 till 5. Det är en liten signal, inte ett facit."

## 6. Övningsbibliotek (seed-data)

Bygger ut `src/lib/exercises.ts` med övningarna från promptens lista, grupperade i kategorier som mappar till befintliga + nya kategori-routes:

- `breath` (Andning) — ~25 övningar
- `quick-pause` (Snabb paus) — ~25
- `anxiety` (Oro & ångest) — ~25
- `stress` (Stress & återhämtning) — ~25
- `focus` (Fokus) — ~25
- `sleep` (Sömn & kväll) — ~25
- `body` (Kropp & närvaro) — ~25
- `reflection` (Reflektion) — ~25
- `compassion` (Självmedkänsla) — ~25
- `anger` (Ilska) — ~20
- `worklife` (Arbetsdag & vardag) — ~25

För att hålla filstorleken hanterbar: splittra till `src/lib/exercises/` med en fil per kategori + en `index.ts` som exporterar samlat. Varje övning får:

```ts
{
  id, title, category, kind: "short" | "reflective",
  minutes, purpose, animation: AnimationKind,
  theme: { bg, ink },  // ärvs från kategori
  short, steps: [{label, seconds}],
  closing, microcopy,
  metric, requiresRating: boolean,
  reflectionPrompt?: string,   // endast reflective
  metaphor?: { intro, illustration }
}
```

Behovskakel på startsidan mappar till kategori-route (`/k/$category`), inte till en enskild övning.

## 7. Kategorisida (`src/routes/k.$category.tsx`)

Behåller färgtema-arv. Lägger till:
- Filter: Korta / Reflekterande / Alla
- "Snabb 60 sek"-knapp överst i varje kategori (mappar till en kort övning i kategorin)
- Max 8 övningar synliga, "Visa fler" expanderar

## 8. Min vecka / progression (`src/routes/min-vecka.tsx`)

Behåller flikarna, men byter primärsiffror till **mönster, inte prestation**:
- Antal pass, total tid (sekundärt)
- Vanligaste övningstyp (`kind` + `animation`)
- Vilka övningar som oftast sänkt skattning mest
- Vilka känslor som återkommer (från kategori-mix)
- Tider på dygnet
- Försiktiga insiktstexter ("Du verkar ofta välja korta andningsövningar när stressen är hög.")

Streak förblir borta.

## 9. AppShell

Mobil: behåll 3-flikars nav. Ta bort eventuella analys-widgets som råkat hamna i mobilheadern. Desktop-sidopanelen får utökad analysmodul (samma data som `/min-vecka` insikter-flik, komprimerad).

## 10. Mikrocopy och ton

Genomgång av alla texter så att de matchar promptens exempel — vänligt, icke-medicinskt, inte taggigt positiva, inte prestationsinriktade. Reflektionsplaceholder: "En mening räcker. Alla tankar behöver inte bli dokument."

## Tekniska detaljer

- `src/lib/exercises.ts` → splittas till `src/lib/exercises/{breath,quickPause,anxiety,...}.ts` + `index.ts`. Behåller exporterad form (`getExercise`, `METRIC_LABELS`) så `ovning.$id.tsx` inte ändrar API.
- `src/components/animations/index.tsx` → behåll `AnimationFor`, lägg till nya `kind`-mappningar. Gamla `breath-blob`/`box-breath` finns kvar tills nya `box-breath` (sidovandring) är på plats, sen byts importen ut.
- Ingen DB-ändring. Ingen ändring av `auth.tsx`, `history.ts`, `client.ts`, `supabase/config.toml`.
- Routes oförändrade förutom innehåll: `index.tsx`, `k.$category.tsx`, `ovning.$id.tsx`, `min-vecka.tsx`.
- Färgteman: utöka CSS-variabler i `src/styles.css` med tokens för nya kategorier (`anger`, `worklife`, `breath`, `quick-pause`).

## Vad som inte ändras

Inloggning (Google + e-post), `sessions`-tabellen, RLS, realtidssynk, `useHistory`, lokal fallback, auth-route, sparflödet i spelaren, generell routing-arkitektur.

## Öppen fråga (löser default om inget svar)

Behovskakel på startsidan: ska "Reflektera" leda till en separat reflektionskategori-route eller filtrera `kind=reflective` tvärs alla kategorier? **Default:** egen kategori-route med blandade reflektionsövningar (enklare mental modell).
