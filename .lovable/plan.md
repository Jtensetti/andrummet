
## Vad jag hittade

Jag gick igenom `script`-fälten och `closing`-meningarna i `src/lib/exercises.ts` för de 13 övningar som faktiskt visas i appen.

### 1. Onaturlig eller felaktig svenska

| Övning | Rad | Nuvarande | Problem |
| --- | --- | --- | --- |
| `vad-behover-jag-just-nu` | 711 | "behovet bor lägre ner i kroppen, **bordet sitter i huvudet**" | "bordet" = möbeln. Ordvitsen på *borde* fungerar inte i skrift. |
| `svalna-innan-svar` | 842 | "in, **uut**, in, **uut**, längre" | Stavfel — ska vara "ut". |
| `mellan-tva-moten` | 922 | "in, ut längre, in, **ut längst**, släpp" | "längst" som imperativ låter konstigt. |
| `reset` | 442 | "Käken, öppna lite, tungan ner, släpp, stilla" | "tungan ner" hänger i luften — saknar varifrån. |
| `reset` / `kroppsskanning` / `slapp-kaken` / `svalna` | 444, 628, 671, 843 | "fixa inget, **bara märk**" | "Märk" som imperativ är tekniskt korrekt men låter klippt och ovanligt. |
| `kroppsskanning` | 629 | "biter du ihop?, **är tänderna emot?**, släpp lite" | "emot" som standalone är otydligt — borde vara "mot varandra". |
| `fokuslinsen` | 529 | "lägg märke till uppmärksamheten, är den **spridd**? hoppar den?" | "spritheten" (rad 529 label) är hemsnickrat ord. |
| `tre-vanliga-meningar` | 804 (closing) | "**Inte tönt.** Bara rättvist." | "Tönt" bryter den varma tonen i övningen. |
| `angesten-far-inte-kora` | 351 | "händer på **10 och 2**" | Klockslagsmetaforen för ratten är dejt — många kör inte bil. |
| `stang-47-flikar` | 326 | "Vad **snurrar**? i huvudet just nu, lista tyst" | "Snurrar" återanvänds gång på gång (se nedan). |

### 2. Upprepade fraser (känns för lika)

Samma formuleringar dyker upp i många övningar — i synnerhet andnings-cuena. Här är de värsta upprepningarna och var de finns:

- **"Andas in / andas ut längre / släpp"** → `reset`, `mellan-tva-moten`, `svalna-innan-svar`, `angesten-far-inte-kora`-stil, `sov-mjukare`, `kroppsskanning`. Identisk fras i 6 av 13.
- **"Släpp axlarna, släpp käken"** → `reset`, `mellan-tva-moten`, `andning-innan-mote`, `mikropaus-vid-skrivbordet`. Samma kombo överallt.
- **"Bara märk / döm inte"** → 8 av 13. Förlorar sin tyngd.
- **"Tyst / säg det tyst"** → 9 av 13.
- **"Stilla / bra"** som avslutande ord i scriptrader → 10+ ställen.
- **"Vad snurrar i huvudet?"** → `reset`, `stang-47-flikar`, `lov-pa-en-flod`, `lagg-undan-till-sen`.

Notera: `andas-i-en-ruta` och `lang-utandning` använder `BoxBreath`/`BreathWave`-komponenterna och visar bara "Andas in / Håll / Andas ut / Vila" — deras scripts används aldrig. Så de räknas inte i upprepningarna ovan, men deras `BOX()`/`WAVE()`-helpers skriver fortfarande dessa scripts (oanvänd dödkod — kan lämnas, ingen påverkan).

## Vad jag föreslår att vi gör

### Konkreta fraser att ersätta

1. **"bordet sitter i huvudet"** → "kravet sitter i huvudet, behovet sitter lägre ner"
2. **"uut"** → "ut" (stavfel)
3. **"ut längst"** → "ut ännu längre"
4. **"bara märk"** → varieras: "lägg bara märke", "notera bara", "se efter", "registrera"
5. **"är tänderna emot?"** → "biter tänderna mot varandra?"
6. **"spritheten"** → "den spridda uppmärksamheten"
7. **"Inte tönt. Bara rättvist."** → "Inte mjäkigt. Bara rättvist."
8. **"händer på 10 och 2"** → "händerna vilar på ratten" (universellare)
9. **"tungan ner"** → "tungan ner från gommen" (full mening)

### Variationsstrategi för upprepningar

Skriv om andnings-cuena så varje övning har sin egen ton:
- `reset` (stress, släppa) → "andas in lugnt, andas ut som en suck, axlarna sjunker"
- `mellan-tva-moten` (worklife) → "kort in, lång ut, gör om tre gånger — sänk pulsen mellan rummen"
- `svalna-innan-svar` (anger) → "in genom näsan, ut långsamt genom munnen — låt elden svalna"
- `sov-mjukare` → "andetaget blir längre, ljudet blir mjukare, kroppen sjunker"
- `kroppsskanning` → bibehåll "skanna utan att fixa"-ton, undvik andnings-cue
- `angesten-far-inte-kora` → bibehåll bilmetafor, andnings-cue blir "händerna på ratten, andetaget hittar takten"

Variera även de andra slitna fraserna:
- "bara märk" → 4–5 olika synonymer fördelade över de 8 ställena
- "döm inte" → "utan att värdera", "ingen rättning behövs", "låt det vara som det är"
- "vad snurrar" → "vad ligger överst", "vad är högst i volym", "vad återkommer"
- "stilla / bra" som slutord → varieras eller tas bort (oftast onödiga)

### Avgränsning

- Bara `src/lib/exercises.ts` ändras.
- Bara `script`-arrayer och enstaka `closing`/`label` rörs — inga ändringar i `seconds`, ID, struktur eller `metaphor.intro` (de är redan distinkta).
- BoxBreath/BreathWave-övningarna (`andas-i-en-ruta`, `lang-utandning`) lämnas oförändrade eftersom deras script aldrig renderas.

## Fil som ändras

- `src/lib/exercises.ts`

