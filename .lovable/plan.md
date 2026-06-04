# Plan: Ny övning — "Löv på en flod" (släppa tankar)

Klassisk ACT-övning. Tanken kommer, du lägger den på ett löv, lövet flyter iväg. Du fastnar inte i tanken. Mjuk, meditativ, konkret.

## Övningen

- **Ny övning**, ID: `lov-pa-en-flod`, kategori: `stress` ("Släppa tankar").
- 4 min, 6 steg ≈ 240 s.
- Tempo: ett löv per steg, ~30–45 s per löv. Lugnt — det får ta tid.

**Steg:**
1. **Sätt dig vid floden** (20 s) — orientering, ingen tanke ännu.
2. **Vad snurrar?** (40 s) — märk en tanke som snurrar i huvudet.
3. **Lägg den på ett löv** (40 s) — sätt ord på den, placera på lövet.
4. **Låt lövet flyta** (40 s) — släpp, se lövet driva nedströms.
5. **Nästa tanke, nästa löv** (50 s) — märk en till, släpp en till.
6. **Du sitter kvar vid floden** (50 s) — tankarna kommer, tankarna går. Du blir kvar.

## Vad animationen visar

En horisontal **flod** som flyter mjukt åt höger — två/tre vågiga linjer med ljusare reflexer. Löv är **stiliserade SVG-blad** (mandelform med en mittnerv) som flyter förbi:

- Vid varje steg "släpps" ett nytt löv från vänster.
- Lövet driver långsamt åt höger med lätt vaggande rotation.
- Mitt i bilden är lövet störst och tydligast — då visas tankens text bredvid det (eller på det).
- Lövet glider ut åt höger och försvinner — texten tonar bort med.

Tidigare löv ligger kvar som svaga siluetter längre nedströms — man ser att man redan släppt flera.

Allt drivs av samma frame-klocka: `stepProgress` styr lövets position längs floden + opacity-envelopen. Inga `<motion>`-transitions — beräknat per frame.

## Text-mönster

Samma lugna struktur som body scan:

```text
[stor steg-rubrik]           ← byts vid stegbyte
Lägg den på ett löv

[liten hjälpfras]            ← roterar från stegets script
Sätt ord på tanken · skriv den tyst på lövet · släpp

[fast bottenrad]             ← står still hela övningen
Tankar kommer. Tankar går. Du sitter kvar.
```

## Vad jag bygger

1. **Ny komponent** `src/components/animations/LeavesOnStream.tsx`
   - SVG: bred horisontal flod (vågor + reflexer som driver svagt åt höger).
   - 1 aktivt löv per steg + spår-siluetter för 1–2 tidigare löv.
   - Props: `stepIndex`, `stepProgress`. Räknar internt ut x-position, rotation, scale, opacity.

2. **Ändring i `src/routes/ovning.$id.tsx`**
   - Femte special-case (`ex.id === "lov-pa-en-flod"`).
   - Visar `LeavesOnStream` + steg-rubrik + roterande hjälpfras + bottenrad.

3. **Datatouch i `src/lib/exercises.ts`**
   - Lägg till `lov-pa-en-flod` i SEEDS, kategori `stress`.
   - `animation: "drifter"` (eller annan befintlig kind — komponenten är ändå special-case).
   - `metaphor.intro` som introducerar bilden.

## Vad jag *inte* gör

- Ingen interaktion (drag löv etc.). Användaren tittar och släpper i huvudet.
- Inga andra övningar rörs.
- Inga nya bibliotek.
