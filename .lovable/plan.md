
# Ny övning i "Hantera oro": **Surfa vågen**

## Varför just den här övningen

De fem befintliga oro-övningarna täcker:

| Övning | Vad den gör |
|---|---|
| **5-4-3-2-1** | Distraktion via sinnen — bort från oron, in i rummet |
| **Ångesten får inte köra bilen** | ACT-värderiktning — agera trots oron |
| **Oro som moln** | Dis-identifiera — "jag är inte tanken" |
| **Hitta ankaret** | Kroppslig tyngd — jorda när huvudet flyger |
| **Sänk volymen på oron** | Gradvis dämpning via reglage |

**Vad som saknas:** Den klassiska insikten att en *akut* ångestvåg toppar och avtar av sig själv på några minuter — om du inte motarbetar den. Ingen av övningarna ovan lär ut detta. "Sänk volymen" *sänker* aktivt. "Moln" är passiv distans. "Ankaret" jordar. Men ingen säger: *stanna kvar i toppen, den faller av sig själv*.

Detta är **urge surfing** (Alan Marlatt) — kärnan i DBT- och MBRP-arbete med ångest och begär. Pedagogiskt unik och med starkt egetvärde: nästa gång oron stiger känner användaren igen formen och vet att den faller.

**Kärnbudskap:** *Du behöver inte stoppa vågen. Du behöver bara hålla dig på brädan tills den brutit.*

## Animation: vågkurv som stiger, toppar, faller

En horisontell vågkurva som långsamt växer från vänster till höger, når en topp, och faller mot noll. Inte loop — **en enda våg över hela övningens längd** (samma princip som snöglob-övningen som ändrades nyss).

```text
amplitud
   ▲
   │              ╱╲
   │            ╱    ╲
   │          ╱        ╲
   │        ╱            ╲___
   │     ╱                    ╲___
   │___╱                          ╲_____
   └────────────────────────────────────▶ tid (180s)
   stigande    topp~40%    avtagande    plana
```

**Visuellt:**
- Tunn linjekurva i `--anxiety-accent` (varm orange) — *vågen själv*
- Under linjen: mjukt fyllt fält i `--anxiety-soft` (dämpad gul) — *känslan*
- En liten cirkel/surfare i `--anxiety-on` (vit) som åker längs kurvans överkant — *du, som håller dig kvar*
- Bakgrund: `--anxiety` (teal) — vatten
- **`useBreathPulse`** ger surfaren en knappt märkbar andning. Hen står stilla på brädan — det är vågen som rör sig.

**Tekniskt mönster (samma som SnowGlobeSettle):**
- `useTimeSec()` → `u = t / totalSeconds` (0..1 över hela övningen)
- Amplitudkurva: `amp(u) = sin(π * u^0.7) * smoothPeak(u)` — asymmetrisk så att toppen ligger ~40 % in och fallet är längre än stigningen (matchar verkligt ångestförlopp)
- Kurvan ritas som SVG `path` med ~80 punkter, beräknade per frame
- Surfarens position: följer kurvans nuvarande högerkant (där "nu" är)
- Inga `useState`-uppdateringar per partikel — bara `useTimeSec` driver allt
- Stilregler: platt SVG, inga gradienter, samma stilmässiga grammatik som övriga bespoke

**Pedagogisk synk:**
- Steg 1–2 (orientera): vågen ligger nästan platt — bara svaga krusningar
- Steg 3 (vågen stiger): kurvan börjar resa sig — användaren ser den växa medan texten säger "den växer"
- Steg 4 (toppen): kurvan når sin maxhöjd när texten säger "det här är toppen"
- Steg 5 (faller): kurvan börjar sjunka medan texten säger "se hur den faller av sig själv"
- Steg 6 (lugnt vatten): kurvan är nästan platt igen, surfaren glider på stilla vatten

Texten *beskriver vad användaren ser hända*. Pedagogiken ligger i sammanträffandet: budskapet *vågor faller av sig själv* bevisas av animationen som faller av sig själv.

## Steg och script (~3 min, kind: short)

1. **"En våg är på väg"** (20s)
   - "lägg märke till oron"
   - "den är inte farlig"
   - "den är en våg"

2. **"Stå på brädan"** (25s)
   - "du behöver inte stoppa vågen"
   - "du behöver bara stå kvar"
   - "fötterna stadiga"

3. **"Vågen växer"** (35s)
   - "låt den växa"
   - "kämpa inte emot"
   - "ju mer du brottas, desto högre blir den"

4. **"Det här är toppen"** (40s)
   - "det känns mycket nu"
   - "andas — stå kvar"
   - "toppen är där den börjar falla"

5. **"Den faller av sig själv"** (40s)
   - "se hur den sjunker"
   - "du gjorde ingenting"
   - "du stannade bara kvar"

6. **"Lugnt vatten"** (20s)
   - "vågen bröt"
   - "nästa kommer också att falla"

**Closing:** "Du stoppade inte vågen. Du surfade den."

**Microcopy (done-screen):** "Vågen föll. Det gör de alltid."

(Ingen `reflectionPrompt`, ingen `requiresRating` — `kind: "short"`.)

## Tekniska detaljer

- **ID:** `surfa-vagen`
- **Kategori:** `anxiety`
- **Kind:** `short`
- **Längd:** 3 min
- **Metric:** `oro`
- **animation-fält:** `"drift"` (fallback — bespoke matchar på id)

### Filer som ändras

1. **`src/lib/exercises.ts`**
   - Lägg till övningsobjektet direkt efter `sank-volymen-pa-oron` (så hela oro-blocket är samlat)
   - Lägg till `"surfa-vagen"` i `POLISHED_IDS`-arrayen

2. **`src/components/animations/bespoke.tsx`**
   - Ny komponent `RideTheWave` som följer samma mönster som `SnowGlobeSettle`:
     - `useTimeSec` driver hela vågkurvan (0..1 över exercise-längden)
     - SVG `path` byggs per frame från ~80 sampelpunkter
     - `useBreathPulse` på surfaren
     - Stilfärger: anxiety / anxiety-accent / anxiety-soft / anxiety-on
   - Registrera `surfa-vagen` → `RideTheWave` i `BESPOKE`-uppslaget

3. **`.lovable/plan.md`** — uppdatera så planen reflekterar att Surfa vågen är tillagd.

## Vad jag INTE rör

- Befintliga oro-övningar, deras texter, animationer eller hastigheter
- Kategorifärger, kortlayout, routing, startsidan
- `ovning.$id.tsx` — `BespokeFor` plockar upp animationen automatiskt via id
