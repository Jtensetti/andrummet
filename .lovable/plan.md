# Plan: Gör body scan perfekt — riktig kroppssilhuett

Vi använder den befintliga övningen `kroppsskanning-huvud-till-fot` (7 min, 7 steg från pannan till fötterna). Den har redan bra text och pedagogik — det vi gör är att ge den en riktig, **konkret kroppssilhuett som faktiskt ser ut som en kropp**, där den aktuella zonen lyser upp och pulserar mjukt i takt med klockan.

## Vad animationen visar

En stor, ren SVG-silhuett av en människa framifrån — huvud, hals, axlar, bröstkorg, mage, höfter, lår, vader, fötter. Stiliserad, ingen anatomi, ingen genus-koppling. Bara en form man genast känner igen som "kropp".

Varje steg motsvarar en **zon** på kroppen:

1. Pannan → en mjuk lysande fläck på övre huvudet
2. Käken → fläck över käkparti
3. Hals & axlar → fläck över hals + axlinje
4. Bröstkorg → ovansidan av bålen
5. Mage → nedre delen av bålen
6. Höfter & ben → höft- och lårparti
7. Fötter → fötter + ankel

**Beteende per zon under stegets gång:**
- Vid start: zonen tänds långsamt (fade-in ~1 sek).
- Under merparten av tiden: zonen lyser stadigt med mjuk in/ut-puls (~3 sek per cykel) — som ett varmt ljus som vandrar med andetaget.
- Sista 10 %: zonen tonar ner mjukt så det blir tydligt att uppmärksamheten "släpper" den och vandrar vidare till nästa.

Tidigare zoner förblir lätt antydda (väldigt svag glöd) så man ser kartan över var man varit. Resten av kroppen är en tunn kontur.

Allt drivs av `stepIdx` (vilken zon) + `stepProgress` (puls + fade-in/out). Inga `<motion>`-transitions — beräknad opacity per frame, exakt synkat med övningsklockan.

## Text-mönster

Samma lugna mönster som tidigare övningar:

```text
[stor zon-rubrik]            ← byts vid stegbyte
Pannan / Käken / Hals & axlar / …

[liten hjälpfras]            ← roterar inom steget, 1 fras per ~8 s
Lägg märke till pannan · Är den spänd? · Är den slät? · Fixa inget — bara märk

[fast bottenrad]             ← står still hela övningen
Bara märk. Du behöver inte fixa något.
```

Hjälpfrasen hämtas från stegets befintliga `script[]` (de finns redan). Den byter inte ord-för-ord; den byter när nästa rad i scriptet är dags utifrån stegets tid.

## Vad jag bygger

1. **Ny komponent** `src/components/animations/BodyScan.tsx`
   - SVG-silhuett (huvud-cirkel + hals + bål + armar + ben + fötter, mjuka rundade former).
   - Definierar 7 zoner som överliggande former med beräknad opacity.
   - Props: `zoneIndex` (0–6), `zoneProgress` (0→1).

2. **Ändring i `src/routes/ovning.$id.tsx`**
   - Fjärde special-case (`ex.id === "kroppsskanning-huvud-till-fot"`).
   - Renderar `BodyScan` + zon-rubrik + roterande hjälpfras + bottenrad.

3. **Datatouch i `src/lib/exercises.ts`**
   - Lämnar steg och tider i fred — de är redan bra.
   - Lägger till en `metaphor.intro` så användaren ser bilden innan start.

## Vad jag *inte* gör

- Ingen 3D, ingen anatomi, inga muskler eller skelett.
- Inga andra övningar rörs.
- Inga nya bibliotek.
