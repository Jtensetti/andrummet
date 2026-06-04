import type { AnimationKind } from "@/components/animations";
import type { LottieSpec } from "@/components/animations/LottiePlayer";

export type Category =
  | "breath"
  | "quick-pause"
  | "anxiety"
  | "stress"
  | "focus"
  | "sleep"
  | "body"
  | "reflection"
  | "compassion"
  | "anger"
  | "worklife";

export type ExerciseKind = "short" | "reflective";

export type RatingMetric =
  | "stress"
  | "oro"
  | "energi"
  | "fokus"
  | "trötthet"
  | "kroppsspänning"
  | "ilska"
  | "nedstämdhet";

export interface ExerciseStep {
  label: string;
  seconds: number;
  /** Undertext-fraser som visas i tur och ordning under stegets gång. */
  script?: string[];
}

export interface Metaphor {
  intro: string;
  illustration?: AnimationKind;
}

export interface Exercise {
  id: string;
  title: string;
  short: string;
  category: Category;
  categoryLabel: string;
  kind: ExerciseKind;
  minutes: number;
  animation: AnimationKind;
  /** Valfri Lottie-animation. Om satt används den istället för SVG-primitiven. */
  lottie?: LottieSpec;
  steps: ExerciseStep[];
  metric: RatingMetric;
  requiresRating: boolean;
  closing: string;
  microcopy?: string;
  metaphor?: Metaphor;
  reflectionPrompt?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  breath: "Andas",
  "quick-pause": "Snabb paus",
  anxiety: "Hantera oro",
  stress: "Släppa tankar",
  focus: "Fokusera",
  sleep: "Sova",
  body: "Lugna kroppen",
  reflection: "Reflektera",
  compassion: "Var snäll mot dig själv",
  anger: "Hantera ilska",
  worklife: "Arbetsdag",
};

export const CATEGORY_SUBTITLE: Record<Category, string> = {
  breath: "En sak i taget. Andetag. Sen nästa.",
  "quick-pause": "Sextio sekunder räcker. Inget mål.",
  anxiety: "Oron får följa med. Den får inte köra.",
  stress: "Sänk volymen. Bara några klick.",
  focus: "En sak. Resten får vänta sin tur.",
  sleep: "Mjuka landningar mot kvällen.",
  body: "Hitta golvet under fötterna.",
  reflection: "Långsamma frågor utan rätt svar.",
  compassion: "Lite mindre hård. Lite mer mänsklig.",
  anger: "Innan svaret. En kort sväng.",
  worklife: "Mellan möten, mejl och människor.",
};

export const METRIC_LABELS: Record<RatingMetric, string> = {
  stress: "Stress",
  oro: "Oro",
  energi: "Energi",
  fokus: "Fokus",
  trötthet: "Trötthet",
  kroppsspänning: "Kroppsspänning",
  ilska: "Ilska",
  nedstämdhet: "Nedstämdhet",
};

// ─────────────────────────────────────────────────────────────
// Step-tuple: [label, seconds, script?]
// ─────────────────────────────────────────────────────────────
type StepTuple = [string, number] | [string, number, string[]];

type Seed = {
  id: string;
  title: string;
  short: string;
  category: Category;
  kind: ExerciseKind;
  minutes: number;
  animation: AnimationKind;
  lottie?: LottieSpec;
  metric: RatingMetric;
  requiresRating?: boolean;
  steps: StepTuple[];
  closing: string;
  microcopy?: string;
  metaphor?: Metaphor;
  reflectionPrompt?: string;
};

// Centrala Lottie-filer (gratis från lottie.host). Mappas per AnimationKind
// så att alla övningar som använder en viss animation automatiskt får
// motsvarande Lottie. Per-seed `lottie` har högre prioritet.
const LOTTIE_BY_KIND: Partial<Record<AnimationKind, LottieSpec>> = {
  // Andning
  "box-breath": { src: "https://lottie.host/c027e0da-afcd-4db3-b8ad-b0eb95ad2f81/Vabha4lcVQ.lottie", mode: "loop" },
  "breath-wave": { src: "https://lottie.host/c027e0da-afcd-4db3-b8ad-b0eb95ad2f81/Vabha4lcVQ.lottie", mode: "loop" },
  "belly-hand": { src: "https://lottie.host/c027e0da-afcd-4db3-b8ad-b0eb95ad2f81/Vabha4lcVQ.lottie", mode: "loop" },
  // Eld / värme
  "candle": { src: "https://lottie.host/d9cc2ea7-d22e-4e2a-9008-2a2f3832254e/ppT95Xjeh2.lottie", mode: "loop" },
  "ember": { src: "https://lottie.host/d9cc2ea7-d22e-4e2a-9008-2a2f3832254e/ppT95Xjeh2.lottie", mode: "loop" },
  "warm-beam": { src: "https://lottie.host/d9cc2ea7-d22e-4e2a-9008-2a2f3832254e/ppT95Xjeh2.lottie", mode: "loop" },
  "morning-sun": { src: "https://lottie.host/d9cc2ea7-d22e-4e2a-9008-2a2f3832254e/ppT95Xjeh2.lottie", mode: "loop" },
  // Moln / lugn
  "drifting-clouds": { src: "https://lottie.host/e3f8b4b5-a1d6-4a3b-bf13-b49dabf3a478/Nf1am485QU.lottie", mode: "loop" },
  "doorway": { src: "https://lottie.host/e3f8b4b5-a1d6-4a3b-bf13-b49dabf3a478/Nf1am485QU.lottie", mode: "loop" },
  // Tankar/fokus (meditativ hjärna)
  "focus-lens": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  "body-scan": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  "constellation": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  "inner-voice": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  "note-to-self": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  "typing-cursor": { src: "https://lottie.host/83f4dded-8638-43ff-a2a8-fef45118b279/bo1eaLwYAt.lottie", mode: "loop" },
  // Rörelse framåt (pappersplan)
  "first-step": { src: "https://lottie.host/0ffde977-cd24-4d03-9c71-c3097adc9923/wVe55jmePn.lottie", mode: "loop" },
  "walking-path": { src: "https://lottie.host/0ffde977-cd24-4d03-9c71-c3097adc9923/wVe55jmePn.lottie", mode: "loop" },
  "footprints": { src: "https://lottie.host/0ffde977-cd24-4d03-9c71-c3097adc9923/wVe55jmePn.lottie", mode: "loop" },
  "path-fork": { src: "https://lottie.host/0ffde977-cd24-4d03-9c71-c3097adc9923/wVe55jmePn.lottie", mode: "loop" },
  // Mjuk sträckning / katt med garn
  "stretch-up": { src: "https://lottie.host/dc5842d7-f483-4635-8626-9450bbeec0ab/xmo6Cepk2f.lottie", mode: "loop" },
  "jaw-release": { src: "https://lottie.host/dc5842d7-f483-4635-8626-9450bbeec0ab/xmo6Cepk2f.lottie", mode: "loop" },
  "shoulder-drop": { src: "https://lottie.host/dc5842d7-f483-4635-8626-9450bbeec0ab/xmo6Cepk2f.lottie", mode: "loop" },
  "opening-hand": { src: "https://lottie.host/dc5842d7-f483-4635-8626-9450bbeec0ab/xmo6Cepk2f.lottie", mode: "loop" },
  // Släppa / mjukna (blobs)
  "deflate": { src: "https://lottie.host/700d2084-966c-448a-9bc2-5289536489b7/RyvCs0bQ0r.lottie", mode: "loop" },
  "volume-slider": { src: "https://lottie.host/700d2084-966c-448a-9bc2-5289536489b7/RyvCs0bQ0r.lottie", mode: "loop" },
  "compassion-heart": { src: "https://lottie.host/700d2084-966c-448a-9bc2-5289536489b7/RyvCs0bQ0r.lottie", mode: "loop" },
  "dropping-bags": { src: "https://lottie.host/700d2084-966c-448a-9bc2-5289536489b7/RyvCs0bQ0r.lottie", mode: "loop" },
  // Vind / passerar förbi
  "passing-traffic": { src: "https://lottie.host/0fa3f1c9-98fc-4c94-8605-e1aec2e1dece/t8XYoJACsQ.lottie", mode: "loop" },
  "drifter": { src: "https://lottie.host/0fa3f1c9-98fc-4c94-8605-e1aec2e1dece/t8XYoJACsQ.lottie", mode: "loop" },
  // Löv (blowing/falling)
  "closing-tabs": { src: "https://lottie.host/a9ab9f37-211b-485b-9754-9d0f1f5ce043/MpeatW0RrH.lottie", mode: "loop" },
  "closing-laptop": { src: "https://lottie.host/a9ab9f37-211b-485b-9754-9d0f1f5ce043/MpeatW0RrH.lottie", mode: "loop" },
  "inbox-priority": { src: "https://lottie.host/a9ab9f37-211b-485b-9754-9d0f1f5ce043/MpeatW0RrH.lottie", mode: "loop" },
  "sleep-waves": { src: "https://lottie.host/a8f3a3d0-ac88-406a-948a-20172ad60d69/zuX5gR3dm8.lottie", mode: "loop" },
  "mailbox": { src: "https://lottie.host/a8f3a3d0-ac88-406a-948a-20172ad60d69/zuX5gR3dm8.lottie", mode: "loop" },
};

function build(s: Seed): Exercise {
  return {
    id: s.id,
    title: s.title,
    short: s.short,
    category: s.category,
    categoryLabel: CATEGORY_LABELS[s.category],
    kind: s.kind,
    minutes: s.minutes,
    animation: s.animation,
    lottie: s.lottie ?? LOTTIE_BY_KIND[s.animation],
    metric: s.metric,
    requiresRating: s.requiresRating ?? s.kind === "short",
    steps: s.steps.map((t) => ({
      label: t[0],
      seconds: t[1],
      script: t[2],
    })),
    closing: s.closing,
    microcopy: s.microcopy,
    metaphor: s.metaphor,
    reflectionPrompt: s.reflectionPrompt,
  };

}

// Standardscript för andetagsfaser
const IN_SCRIPT  = ["Andas in", "långsamt", "fyll lungorna", "håll kvar"];
const OUT_SCRIPT = ["Andas ut", "mjukt", "släpp allt", "tomt"];
const HOLD_SCRIPT = ["Håll", "stilla", "några sekunder", "snart släpper du"];
const REST_SCRIPT = ["Vila", "tomt", "stilla", "snart in igen"];

// Box-andning (in / håll / ut / vila à 4 sek)
const BOX = (rounds = 3): StepTuple[] =>
  Array.from({ length: rounds }, () => ([
    ["Andas in", 4, IN_SCRIPT] as StepTuple,
    ["Håll", 4, HOLD_SCRIPT] as StepTuple,
    ["Andas ut", 4, OUT_SCRIPT] as StepTuple,
    ["Vila", 4, REST_SCRIPT] as StepTuple,
  ])).flat();

// 4 in / 7 ut (våg)
const WAVE = (rounds = 4): StepTuple[] =>
  Array.from({ length: rounds }, () => ([
    ["Andas in", 4, ["Andas in", "näsan", "fyll lungorna", "stanna"]] as StepTuple,
    ["Andas ut", 7, ["Andas ut", "mjukt", "längre", "tömt", "släpp", "stilla", "vänta"]] as StepTuple,
  ])).flat();

const SEEDS: Seed[] = [
  // ─── ÅNGEST / GROUNDING ───────────────────────────────────
  {
    id: "grounding-54321",
    title: "5-4-3-2-1",
    short: "Fem sinnen. Tillbaka till rummet, sak för sak.",
    category: "anxiety",
    kind: "short",
    minutes: 3,
    animation: "focus-lens",
    metric: "oro",
    steps: [
      ["5 saker du SER", 40, ["Låt blicken vandra", "namnge det du ser", "en sak i taget"]],
      ["4 saker du HÖR", 32, ["Stäng ögonen om du vill", "vad hör du nu?", "även det tysta räknas"]],
      ["3 saker du KÄNNER", 30, ["Märk kroppen mot underlaget", "tyget mot huden", "luftens temperatur"]],
      ["2 saker du LUKTAR", 24, ["Andas in genom näsan", "vad finns där?", "inget alls är också ett svar"]],
      ["1 sak du SMAKAR", 15, ["Smaka i munnen", "vad finns kvar där?", "stanna med det en stund"]],
    ],
    closing: "Du är tillbaka i rummet. Oron fick vänta en stund.",
    metaphor: {
      intro:
        "När oron drar iväg — kom tillbaka via sinnena. Fem saker du ser. Sen fyra du hör. Och så vidare ner till en. Säg dem tyst för dig själv.",
      illustration: "focus-lens",
    },
  },

  // ─── ANDAS ────────────────────────────────────────────────
  {
    id: "andas-i-en-ruta",
    title: "Andas i en ruta",
    short: "Fyra sidor, fyra andetag. Du följer banan.",
    category: "breath",
    kind: "short",
    minutes: 4,
    animation: "box-breath",
    metric: "stress",
    steps: BOX(15),
    closing: "Rutan höll i dig. Du behövde inte tänka tempot.",
    metaphor: {
      intro:
        "Andetaget får en bana: in, håll, ut, vila — fyra sekunder per sida. Du följer pricken runt rutan.",
      illustration: "box-breath",
    },
  },
  {
    id: "lang-utandning",
    title: "Lång utandning",
    short: "Längre ut än in. Nervsystemet svalnar.",
    category: "breath",
    kind: "short",
    minutes: 1,
    animation: "breath-wave",
    metric: "stress",
    steps: WAVE(6),
    closing: "Den långa utandningen var själva poängen.",
    metaphor: {
      intro:
        "Andas in i fyra. Ut i sju. Utandningen är längre — det är där lugnet kommer.",
      illustration: "breath-wave",
    },
  },
  {
    id: "andas-som-en-vag",
    title: "Andas som en våg",
    short: "Vågen rullar in. Vågen rullar ut.",
    category: "breath",
    kind: "short",
    minutes: 3,
    animation: "breath-wave",
    metric: "stress",
    steps: WAVE(6),
    closing: "Du behövde inte göra mer än att följa vågen.",
    metaphor: {
      intro: "Andningen är en våg. Du sätter inte tempot — du följer det.",
      illustration: "breath-wave",
    },
  },
  {
    id: "andas-ner-i-magen",
    title: "Andas ner i magen",
    short: "Andetaget tar sig hela vägen ner.",
    category: "breath",
    kind: "short",
    minutes: 2,
    animation: "belly-hand",
    metric: "kroppsspänning",
    steps: [
      ["Lägg en hand på magen", 12, ["Lägg en hand", "på magen", "platt och varm", "känn den ligga där"]],
      ["Andas in", 5, ["Andas in", "låt magen växa", "handen lyfts", "fyll hela vägen ner"]],
      ["Andas ut", 7, ["Andas ut", "magen sjunker", "handen sänks", "längre ut", "släpp", "stilla"]],
      ["Andas in", 5, ["Andas in", "ner i magen", "handen lyfts", "lite mer"]],
      ["Andas ut", 7, ["Andas ut", "tömt", "handen ner", "släpp", "stilla", "snart en till"]],
      ["Andas in", 5, ["Andas in", "lugnt", "handen följer med", "stanna"]],
      ["Andas ut", 7, ["Andas ut", "mjukt", "släpp axlarna också", "stilla", "lägre tempo", "bra"]],
      ["Bara känn handen", 20, ["Bara känn", "handen mot magen", "den lyfts", "och sänks", "du behöver inte göra något", "andetaget sköter sig"]],
    ],
    closing: "Andetaget gick längre ner än vanligt. Bra.",
  },
  {
    id: "andning-innan-mote",
    title: "Andning innan möte",
    short: "Tre andetag innan dörren öppnas.",
    category: "breath",
    kind: "short",
    minutes: 1,
    animation: "box-breath",
    metric: "stress",
    steps: [
      ["Stanna här", 8, ["Stanna", "här", "innan dörren", "tre andetag räcker"]],
      ["Andas in", 4, IN_SCRIPT],
      ["Andas ut", 6, ["Andas ut", "längre", "släpp axlarna", "släpp käken", "stilla", "bra"]],
      ["Andas in", 4, IN_SCRIPT],
      ["Andas ut", 6, ["Andas ut", "längre", "lugnt", "stilla", "snart sista", "bra"]],
      ["Andas in", 4, IN_SCRIPT],
      ["Andas ut", 8, ["Andas ut", "långsamt", "släpp allt", "stilla", "klar", "klar", "klar", "redo"]],
      ["Gå in", 6, ["Du är klar", "gå in nu", "med lugnare puls"]],
    ],
    closing: "Tre andetag. Inte allt. Bara tre. Räcker.",
  },
  {
    id: "andning-nar-hjarnan-rusar",
    title: "Andning när hjärnan rusar",
    short: "Du behöver inte stänga av tankarna — bara sänka takten.",
    category: "breath",
    kind: "short",
    minutes: 3,
    animation: "breath-wave",
    metric: "stress",
    steps: WAVE(6),
    closing: "Tankarna fortsatte. De får. Du andades långsammare.",
  },

  // ─── SNABB PAUS ───────────────────────────────────────────
  {
    id: "sextio-sekunders-paus",
    title: "Sextio sekunders paus",
    short: "En minut. Inget mål. Bara stanna.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "sand-clock",
    metric: "stress",
    steps: [
      ["Stanna", 12, ["Stanna", "var du är", "du behöver inte göra något", "bara vara här"]],
      ["Andas in", 6, ["Andas in", "lugnt", "genom näsan"]],
      ["Andas ut", 10, ["Andas ut", "mjukt", "längre än in", "släpp axlarna", "stilla"]],
      ["Se dig omkring", 16, ["Lyft blicken", "se rummet", "färger", "former", "ljud", "du är här", "inte i tankarna", "stanna kvar"]],
      ["Märk en sak", 16, ["Välj en sak", "i rummet", "titta på den", "vad är det?", "säg det tyst", "bra", "stanna där", "andas"]],
    ],
    closing: "Du stannade. Det räknas.",
  },
  {
    id: "tre-saker-du-ser",
    title: "Tre saker du ser",
    short: "Tillbaka till rummet. Direkt.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "stoplight",
    metric: "oro",
    steps: [
      ["En sak du ser", 16, ["Titta upp", "låt blicken vila", "hitta en sak", "vad är det?", "säg det tyst", "stanna där en stund"]],
      ["En till", 16, ["Flytta blicken", "någon annan plats", "ny sak", "vad är det?", "säg det tyst", "bra"]],
      ["En sista", 16, ["En tredje sak", "titta runt", "vilken som helst", "vad är det?", "säg det tyst", "klart"]],
      ["Andas ut", 8, ["Andas ut", "längre", "släpp", "du är här"]],
      ["Du är här", 8, ["Du är här", "i rummet", "tillbaka", "redo"]],
    ],
    closing: "Tre saker. Du är tillbaka i rummet.",
  },
  {
    id: "mikropaus-vid-skrivbordet",
    title: "Mikropaus vid skrivbordet",
    short: "Tjugo sekunder. Du syns inte ens göra det.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "shoulder-drop",
    metric: "kroppsspänning",
    steps: [
      ["Släpp axlarna", 10, ["Lägg märke", "till axlarna", "är de upp?", "släpp dem ner", "längre ner"]],
      ["Mjuka käken", 10, ["Käken", "öppna lite", "tungan från gommen", "släpp"]],
      ["En lång utandning", 12, ["Andas ut", "långsamt", "genom munnen", "längre", "släpp pannan också", "stilla"]],
      ["Tillbaka", 6, ["Klar", "tillbaka till skärmen", "med mjukare nacke"]],
    ],
    closing: "Tjugo sekunder mindre på pannan. Räcker.",
  },
  {
    id: "paus-innan-du-svarar",
    title: "Paus innan du svarar",
    short: "Innan du trycker skicka. Innan du säger ja.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "traffic-light",
    metric: "stress",
    steps: [
      ["Rött: stanna", 12, ["Rött ljus", "stanna", "svara inte än", "andas in", "andas ut"]],
      ["Gult: vad känns?", 16, ["Gult ljus", "vad känns just nu?", "var i kroppen?", "är det irritation?", "rädsla?", "stress?", "namnge det tyst"]],
      ["Grönt: välj", 16, ["Grönt ljus", "nu väljer du", "vad vill du säga?", "från vilken plats?", "säg det", "eller skriv det", "klar"]],
    ],
    closing: "Du valde. Du reagerade inte bara.",
    metaphor: {
      intro: "Mellan impuls och svar finns ett mellanrum. Vi gör det lite större.",
      illustration: "traffic-light",
    },
  },
  {
    id: "paus-for-kaken",
    title: "Paus för käken",
    short: "Käken bär saker den inte borde.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "jaw-release",
    metric: "kroppsspänning",
    steps: [
      ["Lägg märke till käken", 12, ["Lägg märke", "till käken", "biter du ihop?", "är tänderna emot varandra?", "lägg bara märke till det"]],
      ["Öppna munnen lite", 10, ["Öppna munnen", "en liten glipa", "luft mellan tänderna", "släpp"]],
      ["Tungan ner", 10, ["Tungan", "vilar i munnen", "ner från gommen", "tung och avslappnad"]],
      ["Andas ut genom munnen", 14, ["Andas ut", "genom munnen", "som en suck", "längre", "släpp käken helt", "den hänger", "bra"]],
    ],
    closing: "Käken släppte ett halvt steg. Det räknas.",
  },
  {
    id: "stang-47-flikar",
    title: "Stäng 47 mentala flikar",
    short: "Stäng tre. Inte alla. Bara tre.",
    category: "quick-pause",
    kind: "short",
    minutes: 2,
    animation: "closing-tabs",
    metric: "stress",
    steps: [
      ["Vad tar plats?", 20, ["Vad snurrar?", "i huvudet just nu", "lista tyst", "två-tre saker", "låt dem dyka upp", "döm dem inte"]],
      ["Välj tre tyst", 18, ["Välj tre", "som tar mest plats", "namnge dem", "tyst", "en", "två", "tre"]],
      ["Lägg den första i 'sen'-lådan", 14, ["Den första", "lägg ner den", "i 'sen'-lådan", "den finns kvar", "den behöver inte lösas nu"]],
      ["Den andra", 14, ["Den andra", "lägg ner den också", "samma låda", "den får vänta", "stäng locket"]],
      ["Den tredje", 14, ["Den tredje", "ner i lådan", "den finns kvar", "men inte i huvudet", "bra"]],
      ["Andas ut längre än in", 16, ["Andas in", "kort", "andas ut", "längre", "släpp", "det är tystare nu"]],
    ],
    closing: "Tre flikar mindre. Tillräckligt för tystnad.",
    metaphor: {
      intro: "Stress är en webbläsare med trettio flikar. Vi börjar med tre.",
      illustration: "mailbox",
    },
  },

  // ─── HANTERA ORO ──────────────────────────────────────────
  {
    id: "tankar-som-trafik",
    title: "Tankar som trafik",
    short: "Tankar passerar. Du står på trottoaren.",
    category: "anxiety",
    kind: "reflective",
    minutes: 5,
    animation: "passing-traffic",
    metric: "oro",
    steps: [
      ["Se trafiken passera", 36, ["Du står still", "tankarna åker förbi", "som bilar", "du behöver inte hoppa in", "bara titta"]],
      ["Lägg märke till en tanke", 48, ["En tanke dyker upp", "lägg märke", "vilken är det?", "namnge den tyst", "döm inte", "bara se den"]],
      ["Namnge den", 40, ["Säg tyst", "'planering'", "eller 'oro'", "eller 'minne'", "vad det än är", "ge den ett namn"]],
      ["Låt den åka vidare", 56, ["Den är inte din uppgift", "låt den passera", "som en bil", "vidare i trafiken", "ut ur synfältet", "borta"]],
      ["Tillbaka till trottoaren", 48, ["Du är kvar", "på trottoaren", "andas in", "andas ut", "tankarna åker", "du står still"]],
      ["En till — låt den passera", 56, ["Ny tanke", "namnge den", "låt den passera", "döm inte", "andas ut", "stanna där du är"]],
    ],
    closing: "Trafiken fortsatte. Du behövde inte hoppa in.",
    metaphor: {
      intro: "Tankar är trafik. Du behöver inte hoppa in i varje bil. Bara se den passera.",
      illustration: "passing-traffic",
    },
    reflectionPrompt: "Vilken tanke kom oftast tillbaka?",
  },
  {
    id: "angesten-far-inte-kora",
    title: "Ångesten får inte köra bilen",
    short: "Passagerare, ja. Förare, nej.",
    category: "anxiety",
    kind: "reflective",
    minutes: 6,
    animation: "steering-wheel",
    metric: "oro",
    steps: [
      ["Du sitter vid ratten", 40, ["Du kör", "du sitter vid ratten", "händer på 10 och 2", "ångesten är passagerare", "inte förare"]],
      ["Namnge känslan", 40, ["Vilken är passageraren?", "är det oro?", "rädsla?", "stress?", "säg den tyst", "ge den ett namn"]],
      ["Ge den en plats", 48, ["Den får sitta med", "men inte vid ratten", "fönsterplats", "bältad", "du bestämmer farten"]],
      ["Den får skrika. Du kör.", 56, ["Den får skrika", "den får gnälla", "den får storma", "du kör ändå", "i din riktning"]],
      ["Vart vill du köra?", 56, ["Vart vill du", "köra härnäst?", "ett litet steg", "i vilken riktning?", "vad är viktigt idag?"]],
      ["En liten handling", 48, ["En liten handling", "i den riktningen", "vad kan du göra?", "idag", "just idag", "räcker"]],
    ],
    closing: "Ångesten fick följa med. Den fick inte ratten.",
    reflectionPrompt: "Vad är en liten handling i din riktning just nu?",
  },
  {
    id: "oro-som-moln",
    title: "Oro som moln",
    short: "Molnen rör sig. Du står kvar.",
    category: "anxiety",
    kind: "reflective",
    minutes: 7,
    animation: "drifting-clouds",
    metric: "oro",
    steps: [
      ["Se himlen", 40, ["Du är himlen", "stor", "öppen", "molnen rör sig över dig", "du står kvar"]],
      ["Ett moln glider in", 56, ["Ett moln", "kommer in från sidan", "en känsla", "en tanke", "lägg märke till den"]],
      ["Det är en känsla", 56, ["Det är en känsla", "inte ett faktum", "inte sanningen", "bara ett moln", "som passerar"]],
      ["Ett mörkare moln", 56, ["Ett mörkare moln", "kanske oro", "kanske rädsla", "det får finnas", "du är himlen kvar"]],
      ["Det åker iväg också", 56, ["Det rör sig", "långsamt", "ut ur synfältet", "borta", "himlen är kvar"]],
      ["Du är himlen", 56, ["Molnen kommer och går", "du är kvar", "du är himlen", "stor", "öppen", "lugn"]],
    ],
    closing: "Känslorna passerade. Himlen var ovan dem hela tiden.",
    metaphor: {
      intro: "Du är inte molnet. Du är himlen som molnen rör sig över.",
      illustration: "drifting-clouds",
    },
    reflectionPrompt: "Vilket moln var tyngst idag?",
  },
  {
    id: "ankare",
    title: "Hitta ankaret",
    short: "När huvudet flyger — vi sänker tyngden.",
    category: "anxiety",
    kind: "short",
    minutes: 3,
    animation: "anchor-drop",
    metric: "oro",
    steps: [
      ["Känn fötterna", 20, ["Sätt ner fötterna", "platta mot golvet", "känn underlaget", "tryck lätt", "du är förankrad"]],
      ["Känn stolen", 20, ["Känn stolen", "eller golvet", "under dig", "den bär dig", "du behöver inte hålla i något"]],
      ["Ankaret sjunker", 28, ["Föreställ dig", "ett ankare", "i mitten av kroppen", "det sjunker", "långsamt", "ner mot jorden"]],
      ["Det rör vid botten", 28, ["Det landar", "mjukt", "på botten", "stilla", "tungt", "stadigt"]],
      ["Andas ut längre än in", 56, ["Andas in", "kort", "andas ut", "långt", "släpp", "andas in", "andas ut", "längre", "släpp mer", "stilla", "förankrad"]],
    ],
    closing: "Du är förankrad. Vinden får blåsa.",
    metaphor: {
      intro: "När huvudet drar iväg behöver vi tyngd i botten. Ankaret sjunker.",
      illustration: "anchor-drop",
    },
  },
  {
    id: "sank-volymen-pa-oron",
    title: "Sänk volymen på oron",
    short: "Oron försvinner inte. Den blir tystare.",
    category: "anxiety",
    kind: "short",
    minutes: 3,
    animation: "volume-slider",
    metric: "oro",
    steps: [
      ["Lägg märke till volymen", 20, ["Lyssna inåt", "hur högt är det?", "från 1 till 10", "vilken siffra?", "döm inte"]],
      ["Var sitter den?", 28, ["Var sitter oron?", "bröstet?", "magen?", "halsen?", "huvudet?", "lägg en hand där"]],
      ["Dra reglaget ett snäpp", 28, ["Föreställ dig", "ett ljudreglage", "dra ner ett snäpp", "bara ett", "inte tyst", "bara lägre"]],
      ["Ett till", 28, ["Ett snäpp till", "ner", "oron finns kvar", "men lägre", "stilla"]],
      ["Andas ut tills mjukt", 56, ["Andas in", "andas ut", "längre ut än in", "ett snäpp till ner", "andas", "stilla", "mjukare", "räcker"]],
    ],
    closing: "Volymen blev lägre. Inte noll. Bara lägre.",
    metaphor: {
      intro: "Oron är ett ljud. Vi sänker volymen — inte stänger av.",
      illustration: "volume-slider",
    },
  },

  // ─── SLÄPPA TANKAR ────────────────────────────────────────
  {
    id: "reset",
    title: "Reset",
    short: "Sänk tempot. Tre tag, en kropp.",
    category: "stress",
    kind: "short",
    minutes: 3,
    animation: "deflate",
    metric: "stress",
    steps: [
      ["Släpp axlarna", 20, ["Lägg märke", "till axlarna", "är de upp?", "släpp ner dem", "längre ner", "bra"]],
      ["Mjuka käken", 20, ["Käken", "öppna lite", "tungan ner", "släpp", "stilla"]],
      ["Andas ut genom munnen", 20, ["Andas in näsan", "andas ut munnen", "som en suck", "längre", "släpp"]],
      ["Lägg märke till kroppen", 28, ["Skanna kort", "huvud till tå", "var är det spänt?", "var är det mjukt?", "fixa inget", "bara märk"]],
      ["Lägg märke till tankarna", 28, ["Vad snurrar?", "i huvudet just nu", "namnge tyst", "döm inte", "låt dem vara"]],
      ["Kom tillbaka hit", 28, ["Tillbaka", "till andetaget", "till kroppen", "till rummet", "du är här", "bra"]],
    ],
    closing: "Du gjorde nästan ingenting i tre minuter. Starkt jobbat.",
  },
  {
    id: "lagg-undan-till-sen",
    title: "Lägg undan till sen",
    short: "Brevlådan märkt 'sen'. Den är inte glömska.",
    category: "stress",
    kind: "short",
    minutes: 3,
    animation: "note-to-self",
    metric: "stress",
    steps: [
      ["Vad försöker du lösa?", 28, ["Vad snurrar?", "vad försöker hjärnan lösa?", "just nu", "namnge en sak", "tyst"]],
      ["Skriv tyst en lapp", 28, ["Föreställ dig", "en lapp", "skriv saken på den", "tyst i huvudet", "kort", "några ord"]],
      ["Lägg den i 'sen'-lådan", 28, ["Vik lappen", "lägg ner den", "i lådan märkt 'sen'", "stäng locket", "den finns kvar"]],
      ["Inte glömska — paus", 28, ["Det är inte glömska", "det är paus", "du kan hämta den senare", "om du behöver", "men inte nu"]],
      ["Andas ut", 28, ["Andas in", "andas ut längre", "släpp", "huvudet blev tystare", "bra"]],
    ],
    closing: "Du behöver inte lösa allt nu. Det får vänta.",
    metaphor: {
      intro: "Vi lägger lappen i en låda märkt 'sen'. Den finns kvar. Den behöver bara inte lösas nu.",
      illustration: "mailbox",
    },
  },
  {
    id: "stress-som-ljudvolym",
    title: "Stress som ljudvolym",
    short: "Dra ner reglaget ett snäpp.",
    category: "stress",
    kind: "short",
    minutes: 2,
    animation: "volume-slider",
    metric: "stress",
    steps: [
      ["Var är volymen nu?", 18, ["Lyssna inåt", "hur högt är det?", "från 1 till 10", "vilken siffra?"]],
      ["Dra ner ett snäpp", 22, ["Dra reglaget", "ner ett snäpp", "bara ett", "inte tyst", "bara lägre"]],
      ["Andas ut", 14, ["Andas in", "andas ut längre", "släpp"]],
      ["Ett snäpp till", 22, ["Ett snäpp till", "ner", "stilla", "mjukare"]],
      ["Andas ut", 14, ["Andas in", "andas ut", "ännu längre", "släpp"]],
      ["Mjukare här", 18, ["Det är mjukare", "inte tyst", "men mjukare", "räcker"]],
    ],
    closing: "Mjukare. Inte stilla. Mjukare räcker.",
  },
  {
    id: "lagg-ner-stenen",
    title: "Lägg ner stenen",
    short: "Vad har du burit hela dagen?",
    category: "stress",
    kind: "reflective",
    minutes: 5,
    animation: "lifting-stone",
    metric: "stress",
    steps: [
      ["Vad har du burit?", 40, ["Vad har du burit?", "hela dagen", "i bröstet", "i magen", "i pannan", "namnge en sak"]],
      ["Sätt ord på en sak", 48, ["En sak", "som tynger", "ge den ett namn", "säg det tyst", "döm inte"]],
      ["Lägg ner den i 5 minuter", 56, ["Föreställ dig", "en sten", "i händerna", "lägg ner den", "framför dig", "bara i fem minuter"]],
      ["Den finns kvar", 40, ["Den ligger där", "den finns kvar", "du har inte slängt den", "bara lagt ner den"]],
      ["Du hämtar den sen", 56, ["Du kan hämta den", "om en stund", "om du vill", "men just nu", "är dina händer tomma"]],
    ],
    closing: "Du satte ner den. Det räknas.",
    reflectionPrompt: "Vad lade du ner just nu?",
  },
  {
    id: "lov-pa-en-flod",
    title: "Löv på en flod",
    short: "Lägg tanken på ett löv. Låt det driva förbi.",
    category: "stress",
    kind: "short",
    minutes: 4,
    animation: "drifting-leaves",
    metric: "stress",
    steps: [
      ["Sätt dig vid floden", 20, ["Föreställ dig", "en lugn flod", "du sitter på stranden", "vattnet rör sig sakta", "förbi dig"]],
      ["Vad snurrar?", 40, ["Märk en tanke", "som snurrar", "i huvudet just nu", "den första som dyker upp", "räcker", "döm den inte"]],
      ["Lägg den på ett löv", 40, ["Föreställ dig ett löv", "som flyter förbi", "lägg tanken på lövet", "några ord räcker", "tyst", "som en lapp"]],
      ["Låt lövet flyta", 40, ["Knuffa inte", "håll inte fast", "låt lövet driva", "med strömmen", "iväg", "bra"]],
      ["Nästa tanke, nästa löv", 50, ["En ny tanke kommer", "ett nytt löv", "lägg den där", "låt det flyta", "om och om", "i din egen takt"]],
      ["Du sitter kvar vid floden", 50, ["Tankarna kommer", "tankarna går", "du sitter kvar", "vid floden", "stilla", "du är inte tankarna"]],
    ],
    closing: "Tankarna fortsatte komma. Du fortsatte släppa dem.",
    metaphor: {
      intro: "Föreställ dig en lugn flod. Varje tanke som dyker upp lägger du på ett löv som flyter förbi. Du behöver inte stoppa floden. Du behöver inte hoppa i. Du bara sitter och tittar.",
      illustration: "drifting-leaves",
    },
  },



  // ─── FOKUSERA ─────────────────────────────────────────────
  {
    id: "valj-en-sak",
    title: "Välj en sak",
    short: "Tre kandidater. En vinnare. Resten väntar.",
    category: "focus",
    kind: "short",
    minutes: 3,
    animation: "path-fork",
    metric: "fokus",
    steps: [
      ["Tre saker du gör NU", 36, ["Lista tyst", "tre saker", "som måste göras", "idag", "just NU", "säg dem"]],
      ["Tre som får VÄNTA", 36, ["Tre saker", "som kan vänta", "till imorgon", "eller nästa vecka", "säg dem tyst"]],
      ["Tre du ALDRIG gör", 36, ["Tre saker", "som du släpper helt", "inte värda din tid", "säg dem", "bra"]],
      ["Välj minsta från NU", 30, ["Från NU-listan", "välj den minsta", "den lättaste", "första steget", "vad är det?"]],
      ["Andas. Börja där.", 30, ["Andas in", "andas ut", "öppna det dokumentet", "ring det samtalet", "börja där", "nu"]],
    ],
    closing: "Sorterat. Nu behöver hjärnan inte hålla det åt dig.",
    metaphor: {
      intro: "När allt känns lika viktigt blir inget gjort. Vi tvingar fram tre högar.",
      illustration: "sorting-shelf",
    },
  },
  {
    id: "fokuslinsen",
    title: "Fokuslinsen",
    short: "Spridd uppmärksamhet samlas långsamt.",
    category: "focus",
    kind: "short",
    minutes: 3,
    animation: "focus-lens",
    metric: "fokus",
    steps: [
      ["Lägg märke till spritheten", 20, ["Lägg märke", "till uppmärksamheten", "är den spridd?", "hoppar den?", "döm inte"]],
      ["Välj ett ord eller en uppgift", 28, ["Välj en sak", "ett ord", "en uppgift", "en mening", "vad är det?"]],
      ["Låt det vara mitten", 28, ["Sätt det i mitten", "som en lins", "allt fokus dit", "bara den saken"]],
      ["Resten i kanten", 40, ["Allt annat", "får finnas", "i utkanten", "det försvinner inte", "men inte i mitten"]],
      ["Andas in mot mitten", 40, ["Andas in", "mot mitten", "andas ut", "kanterna släpper", "andas", "samla"]],
    ],
    closing: "Linsen är inte perfekt. Den är bara mer samlad.",
    metaphor: {
      intro: "Fokus är inte att stänga av allt. Det är att samla något i mitten.",
      illustration: "focus-lens",
    },
  },
  {
    id: "borja-litet",
    title: "Börja litet",
    short: "Första handlingen. Bara den.",
    category: "focus",
    kind: "short",
    minutes: 2,
    animation: "first-step",
    metric: "fokus",
    steps: [
      ["Vad är första handlingen?", 28, ["Vad är", "första handlingen?", "inte hela uppgiften", "bara första steget"]],
      ["Gör den absurt liten", 28, ["Gör den", "så liten", "att det blir absurt", "öppna dokumentet", "skriv en rad", "det räcker"]],
      ["Två-minuters timer", 20, ["Sätt en timer", "två minuter", "i huvudet", "bara två"]],
      ["Andas ut", 18, ["Andas in", "andas ut längre", "släpp", "redo"]],
      ["Gå", 18, ["Gå", "börja", "första handlingen", "nu"]],
    ],
    closing: "Du behövde inte hela berget. Bara första steget.",
  },
  {
    id: "fokus-innan-skrivande",
    title: "Fokus innan skrivande",
    short: "Två minuter samling innan första meningen.",
    category: "focus",
    kind: "short",
    minutes: 2,
    animation: "typing-cursor",
    metric: "fokus",
    steps: [
      ["Vad ska du skriva om?", 20, ["Vad ska du skriva?", "huvudtemat", "i en mening", "tyst för dig själv"]],
      ["En mening i huvudet", 28, ["Säg tyst", "första meningen", "inte perfekt", "bara en mening", "vad blir det?"]],
      ["Andas in", 4, IN_SCRIPT],
      ["Andas ut", 6, OUT_SCRIPT],
      ["Skriv meningen tyst", 28, ["Säg meningen", "för dig själv", "igen", "håll den i huvudet", "den är klar"]],
      ["Öppna dokumentet", 24, ["Öppna dokumentet", "skriv ner den", "första meningen", "resten kommer", "gå"]],
    ],
    closing: "Första meningen finns redan. Resten är bara skriva ner.",
  },

  // ─── SOVA ─────────────────────────────────────────────────
  {
    id: "sov-mjukare",
    title: "Sov mjukare",
    short: "En lugn landning mot sömnen.",
    category: "sleep",
    kind: "reflective",
    minutes: 8,
    animation: "candle",
    metric: "trötthet",
    steps: [
      ["Sänk tempot", 56, ["Du är klar för dagen", "sänk tempot", "ingenting måste lösas nu", "bara andas", "långsamt"]],
      ["Släpp pannan", 56, ["Lägg märke till pannan", "är den spänd?", "släpp den", "låt huden mjukna", "stilla"]],
      ["Käken får hänga", 56, ["Käken", "öppna lite", "tungan ner från gommen", "släpp", "hängande"]],
      ["Axlar tunga", 80, ["Axlarna", "tunga ner mot kudden", "släpp", "längre ner", "andas ut", "tyngre"]],
      ["Bröstkorgen mjuk", 80, ["Bröstkorgen", "lyfter när du andas in", "sjunker när du andas ut", "mjuk", "långsam"]],
      ["Magen släpper", 56, ["Magen", "släpper helt", "ingen spänning där", "mjuk", "varm"]],
      ["Benen tunga", 56, ["Benen", "tunga mot madrassen", "låret", "vaden", "släpp"]],
      ["Fötter varma", 56, ["Fötterna", "varma", "tunga", "släpp tårna", "stilla"]],
    ],
    closing: "Resten av kvällen behöver du inte lösa nu.",
  },
  {
    id: "varmestralen",
    title: "Värmestrålen",
    short: "En varm stråle vandrar från hjässa till tå.",
    category: "sleep",
    kind: "reflective",
    minutes: 6,
    animation: "warm-beam",
    metric: "trötthet",
    steps: [
      ["Hjässan blir varm", 36, ["En varm stråle", "vid hjässan", "som solljus", "långsamt", "varmt", "tungt"]],
      ["Pannan släpper", 36, ["Strålen", "rör sig ner", "över pannan", "huden mjuknar", "släpp"]],
      ["Käken släpper", 36, ["Käken", "varm", "öppen", "tungan ner", "släpp"]],
      ["Axlarna tunga", 36, ["Axlarna", "varma", "tunga", "ner mot kudden", "släpp"]],
      ["Bröstet mjukt", 36, ["Bröstet", "varmt", "andas långsamt", "lyfter och sjunker", "mjukt"]],
      ["Magen släpper", 36, ["Magen", "varm", "mjuk", "ingen spänning", "släpp"]],
      ["Benen tunga", 36, ["Strålen", "över benen", "låret", "vaden", "tunga"]],
      ["Fötterna varma", 36, ["Fötterna", "varma", "tunga", "tårna släpper", "stilla"]],
      ["Hela kroppen vilar", 40, ["Hela kroppen", "varm", "tung", "stilla", "vilar", "redo att sova"]],
    ],
    closing: "Värmen finns kvar. Tankarna får stanna utanför.",
    metaphor: {
      intro: "Föreställ dig en varm stråle som rör sig sakta nedåt. Det den passerar blir tungt.",
      illustration: "body-scan",
    },
  },
  {
    id: "lagg-dagen-i-en-lada",
    title: "Lägg dagen i en låda",
    short: "Dagen finns kvar — den behöver inte ligga i huvudet.",
    category: "sleep",
    kind: "short",
    minutes: 3,
    animation: "mailbox",
    metric: "trötthet",
    steps: [
      ["Vad hände idag?", 28, ["Vad hände idag?", "kort genomgång", "tyst i huvudet", "döm inte"]],
      ["Skriv en kort lapp", 28, ["Föreställ dig", "en lapp", "skriv 'idag'", "och två-tre saker", "som hände"]],
      ["Lägg den i lådan 'imorgon'", 28, ["Vik lappen", "lägg ner den", "i lådan", "märkt 'imorgon'", "den ligger där"]],
      ["Stäng locket", 20, ["Stäng locket", "klick", "stängt", "den finns kvar", "men inte i huvudet"]],
      ["Andas ut långsamt", 56, ["Andas in lugnt", "andas ut längre", "släpp dagen", "andas ut igen", "längre", "släpp", "tungt", "stilla"]],
    ],
    closing: "Dagen ligger i lådan. Den finns kvar imorgon.",
    metaphor: {
      intro: "Dagen behöver inte ligga i huvudet hela natten. Vi lägger den i en låda märkt 'imorgon'.",
      illustration: "mailbox",
    },
  },
  {
    id: "lang-utandning-for-natten",
    title: "Lång utandning för natten",
    short: "Längre ut än in. Tills kroppen följer med.",
    category: "sleep",
    kind: "short",
    minutes: 3,
    animation: "sleep-waves",
    metric: "trötthet",
    steps: WAVE(7),
    closing: "Kroppen följde med till slut. Som den brukar.",
  },

  // ─── LUGNA KROPPEN ────────────────────────────────────────
  {
    id: "kroppsskanning-huvud-till-fot",
    title: "Kroppsskanning från huvud till fot",
    short: "Långsam koll. Inget ska fixas.",
    category: "body",
    kind: "reflective",
    minutes: 7,
    animation: "body-scan",
    metric: "kroppsspänning",
    steps: [
      ["Pannan", 48, ["Lägg märke", "till pannan", "är den spänd?", "är den slät?", "fixa inget", "bara märk"]],
      ["Käken", 48, ["Käken", "biter du ihop?", "är tänderna emot?", "släpp lite", "öppna munnen en glipa"]],
      ["Hals och axlar", 56, ["Halsen", "axlarna", "är de upp?", "är de spända?", "släpp ner dem", "några centimeter"]],
      ["Bröstkorg", 56, ["Bröstkorgen", "andas in", "lyfts den?", "andas ut", "sjunker den?", "mjukt"]],
      ["Mage", 48, ["Magen", "är den spänd?", "är den mjuk?", "släpp helt", "andas dit"]],
      ["Höfter och ben", 56, ["Höfterna", "låren", "vaderna", "är de tunga?", "släpp"]],
      ["Fötter", 48, ["Fötterna", "tårna", "hälarna", "känner du dem?", "släpp tårna", "stilla"]],
    ],
    closing: "Du skannade utan att fixa. Det är hela övningen.",
    reflectionPrompt: "Var höll kroppen mest?",
    metaphor: {
      intro:
        "Uppmärksamheten vandrar genom kroppen — pannan, käken, halsen, bröstet, magen, höfter, fötter. Du fixar inget. Du lyser bara upp ett område i taget och märker vad som finns där.",
      illustration: "body-scan",
    },
  },
  {
    id: "kanna-fotterna",
    title: "Känn fötterna",
    short: "Tjugo sekunder ner till golvet.",
    category: "body",
    kind: "short",
    minutes: 1,
    animation: "footprints",
    metric: "kroppsspänning",
    steps: [
      ["Hela foten mot golvet", 14, ["Sätt ner fötterna", "platta mot golvet", "hela fotsulan", "känn underlaget"]],
      ["Vikten i hälarna", 14, ["Flytta vikten", "lite bakåt", "in i hälarna", "tryck lätt", "stadig"]],
      ["Tårna avslappnade", 14, ["Tårna", "släpp dem", "låt dem vara mjuka", "ingen spänning där"]],
      ["Andas ut nedåt", 18, ["Andas in", "andas ut", "som om luften", "går ner genom fötterna", "in i jorden", "stadigt"]],
    ],
    closing: "Fötterna fanns. Hjärnan visste inte ens om dem innan.",
  },
  {
    id: "slapp-kaken",
    title: "Släpp käken",
    short: "Käken jobbar gratis. Vi tackar nej.",
    category: "body",
    kind: "short",
    minutes: 1,
    animation: "jaw-release",
    metric: "kroppsspänning",
    steps: [
      ["Lägg märke till käken", 14, ["Lägg märke", "till käken", "biter du ihop?", "döm inte", "bara märk"]],
      ["Öppna munnen lite", 14, ["Öppna munnen", "en liten glipa", "luft mellan tänderna", "släpp"]],
      ["Tungan ner från gommen", 14, ["Tungan", "ner från gommen", "vilar i munnen", "tung", "släpp"]],
      ["Andas ut genom munnen", 22, ["Andas in näsan", "andas ut munnen", "som en suck", "längre", "släpp käken helt", "den hänger", "bra"]],
    ],
    closing: "Käken slutade jobba en stund.",
  },
  {
    id: "mjuka-axlar",
    title: "Mjuka axlar",
    short: "Axlarna har bott uppe i nacken. De får komma ner.",
    category: "body",
    kind: "short",
    minutes: 2,
    animation: "shoulder-drop",
    metric: "kroppsspänning",
    steps: [
      ["Dra axlarna upp", 10, ["Dra axlarna", "upp mot öronen", "håll", "håll", "släpp snart"]],
      ["Släpp dem ner", 14, ["Släpp", "ner", "långt ner", "tungt", "låt dem hänga"]],
      ["Lägg märke till skillnaden", 16, ["Märk skillnaden", "innan och efter", "är det mjukare?", "längre nacke?", "bra"]],
      ["En till — upp", 10, ["Upp igen", "axlarna", "mot öronen", "håll", "släpp snart"]],
      ["Och släpp", 14, ["Släpp", "ner", "tungt", "hänger", "stilla"]],
      ["Bara hänger nu", 22, ["Axlarna hänger", "tunga", "ner från nacken", "andas in", "andas ut", "släpp lite till", "bra"]],
    ],
    closing: "Axlarna kom ner. Det syns inte. Men du känner det.",
  },

  // ─── REFLEKTERA ───────────────────────────────────────────
  {
    id: "vad-behover-jag-just-nu",
    title: "Vad behöver jag just nu?",
    short: "En enkel fråga. Långsamt svar.",
    category: "reflection",
    kind: "reflective",
    minutes: 5,
    animation: "walking-path",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Vad dyker upp först?", 56, ["Fråga dig själv", "vad behöver jag?", "just nu", "det första som dyker upp", "döm inte", "lyssna"]],
      ["Behov eller borde?", 56, ["Är det", "vad du behöver?", "eller vad du tror", "att du borde?", "skillnad", "lyssna igen"]],
      ["Vad skulle hjälpa?", 56, ["Vad skulle hjälpa", "i just denna timme?", "inte hela livet", "bara nu", "en sak"]],
      ["En liten version av det", 56, ["Vad är", "en liten version?", "tio minuter", "ett glas vatten", "en kort promenad", "vad blir det?"]],
      ["Skulle du kunna ge dig det?", 56, ["Skulle du", "kunna ge dig det?", "även om det är litet", "även om det är konstigt", "bara nu"]],
    ],
    closing: "Du frågade utan att kräva ett perfekt svar.",
    reflectionPrompt: "Vad behöver du nästa timme?",
  },
  {
    id: "livskvalitet-minus-jamforelse",
    title: "Livskvalitet minus jämförelse",
    short: "Lägg ner måttstocken. Se dig omkring.",
    category: "reflection",
    kind: "reflective",
    minutes: 7,
    animation: "measuring-tape",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Vem jämför du dig med?", 56, ["Vem jämför du dig", "med just nu?", "någon på instagram?", "en kollega?", "din syster?", "namnge tyst"]],
      ["Vad kostar det dig?", 56, ["Vad kostar", "den jämförelsen?", "tid?", "glädje?", "energi?", "lägg märke"]],
      ["Lägg ner måttstocken", 56, ["Föreställ dig", "en måttstock", "i handen", "lägg ner den", "på golvet", "bara fem minuter"]],
      ["Vad finns kvar?", 80, ["När du inte mäter", "vad finns kvar?", "i ditt liv", "som faktiskt är ditt?", "lyssna", "vänta", "döm inte"]],
      ["En sak du gillar", 80, ["En sak", "i ditt liv", "som du faktiskt gillar", "just nu", "litet eller stort", "namnge det"]],
      ["Låt den finnas", 56, ["Låt den finnas", "utan att jämföras", "med någon annans", "den är din", "den räcker"]],
    ],
    closing: "Måttstocken finns kvar. Den behöver bara inte ligga i handen.",
    metaphor: {
      intro: "Vi går runt med en måttstock som vi inte minns när vi tog upp. Vi lägger ner den ett tag.",
      illustration: "measuring-tape",
    },
    reflectionPrompt: "Vad såg du när måttstocken låg ner?",
  },
  {
    id: "vad-forsoker-kanslan-saga",
    title: "Vad försöker känslan säga?",
    short: "Känslan är inte sanningen. Den är en signal.",
    category: "reflection",
    kind: "reflective",
    minutes: 8,
    animation: "constellation",
    metric: "oro",
    requiresRating: false,
    steps: [
      ["Vilken känsla är starkast?", 56, ["Lyssna inåt", "vilken känsla", "är starkast nu?", "döm inte", "namnge den tyst"]],
      ["Var sitter den?", 56, ["Var i kroppen?", "bröstet?", "magen?", "halsen?", "kinden?", "lägg en hand där"]],
      ["Vad försöker den säga?", 80, ["Vad försöker", "känslan säga?", "vad behöver du veta?", "lyssna", "vänta", "döm inte", "kanske ett ord"]],
      ["Vad skulle den behöva höra?", 80, ["Vad skulle", "den behöva höra?", "från någon snäll?", "en mening", "en vänlig mening"]],
      ["Säg det själv", 80, ["Säg den meningen", "till känslan", "tyst", "som till en vän", "som du menar det", "stanna där"]],
      ["Låt känslan vara", 80, ["Den får finnas", "du dömer inte", "du fixar inte", "du lyssnade", "det räcker"]],
    ],
    closing: "Känslan blev hörd. Den behöver inte skrika lika högt.",
    reflectionPrompt: "Vad sa känslan, när du lyssnade?",
  },
  {
    id: "vad-bar-jag-som-inte-ar-mitt",
    title: "Vad bär jag som inte är mitt?",
    short: "Andras förväntningar tar plats. Vi sorterar.",
    category: "reflection",
    kind: "reflective",
    minutes: 6,
    animation: "dropping-bags",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Vad bär du på?", 56, ["Vad bär du", "på just nu?", "i bröstet", "i huvudet", "namnge tre saker", "tyst"]],
      ["Vad är ditt?", 56, ["Av det du bär", "vad är ditt?", "din vilja", "ditt val", "ditt liv"]],
      ["Vad är någon annans?", 56, ["Vad är", "någon annans?", "förväntningar", "krav", "skuld", "som inte är din"]],
      ["Lägg tillbaka — vänligt", 80, ["Det som inte är ditt", "lägg tillbaka", "vänligt", "till den det tillhör", "du bär det inte mer", "andas"]],
      ["Vad behåller du?", 80, ["Det som är ditt", "vad är värt att bära?", "vilka val är dina?", "vad behåller du?", "namnge det"]],
    ],
    closing: "Du sorterade. Något blev någon annans igen.",
    reflectionPrompt: "Vad var inte ditt?",
  },

  // ─── KOMPASSION ───────────────────────────────────────────
  {
    id: "tre-vanliga-meningar",
    title: "Tre vänliga meningar",
    short: "Tre saker du skulle säga till en vän. Till dig själv.",
    category: "compassion",
    kind: "reflective",
    minutes: 4,
    animation: "compassion-heart",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Tänk på dig som en vän", 40, ["Tänk dig själv", "som en vän", "som har det svårt", "vad skulle du säga?", "med vilken ton?"]],
      ["Säg en vänlig mening", 56, ["Första meningen", "säg den tyst", "som du menar det", "kort", "snäll", "ärlig"]],
      ["En till", 56, ["En till mening", "säg den tyst", "till dig själv", "som en vän skulle", "stanna där"]],
      ["Och en sista", 56, ["Sista meningen", "säg den tyst", "låt den landa", "döm den inte", "den får finnas"]],
      ["Låt det landa", 40, ["Andas in", "andas ut", "låt orden landa", "i bröstet", "i magen", "bra"]],
    ],
    closing: "Inte tönt. Bara rättvist.",
    metaphor: {
      intro: "Du pratar snällare med vänner än med dig själv. Vi lånar tonen tillbaka.",
      illustration: "compassion-heart",
    },
    reflectionPrompt: "Vilken mening behövde du höra mest?",
  },
  {
    id: "du-far-vara-mansklig",
    title: "Du får vara mänsklig",
    short: "Du är inte ett projekt. Du är en människa.",
    category: "compassion",
    kind: "short",
    minutes: 3,
    animation: "inner-voice",
    metric: "stress",
    steps: [
      ["Det här är svårt", 40, ["Säg tyst", "till dig själv", "det här är svårt", "det är okej att det är svårt", "andra människor", "skulle också tycka det"]],
      ["Du gör så gott du kan", 40, ["Säg tyst", "jag gör så gott", "jag kan just nu", "med det jag har", "med vad jag vet", "det räcker"]],
      ["Du behöver inte vara perfekt", 40, ["Säg tyst", "jag behöver inte", "vara perfekt", "jag får vara mänsklig", "jag får göra fel"]],
      ["Andas in vänlighet", 28, ["Andas in", "vänlighet", "som värme", "in i bröstet"]],
      ["Andas ut piskan", 28, ["Andas ut", "piskan", "kraven", "släpp", "släpp", "släpp"]],
    ],
    closing: "Du är mänsklig. Det räcker idag.",
  },
  {
    id: "lagg-ner-piskan",
    title: "Lägg ner piskan",
    short: "Den inre rösten kan vara hård. Vi sänker den.",
    category: "compassion",
    kind: "short",
    minutes: 3,
    animation: "opening-hand",
    metric: "stress",
    steps: [
      ["Vad säger du till dig?", 28, ["Lyssna inåt", "vad säger du", "till dig själv", "just nu?", "ärligt", "döm inte"]],
      ["Skulle du säga det till en vän?", 28, ["Skulle du säga", "samma sak", "till en vän?", "med samma ton?", "samma ord?"]],
      ["Sänk volymen", 28, ["Sänk volymen", "på den rösten", "ett snäpp", "den får finnas", "men inte skrika"]],
      ["En vänligare version", 40, ["Vad blir", "en vänligare version?", "samma sak", "men snällare ton", "säg den tyst"]],
      ["Säg den tyst", 40, ["Säg den", "till dig själv", "som du menar det", "låt den landa", "andas in", "andas ut"]],
    ],
    closing: "Piskan ligger på golvet. Den får ligga där.",
  },

  // ─── ILSKA ────────────────────────────────────────────────
  {
    id: "svalna-innan-svar",
    title: "Svalna innan svar",
    short: "Elden får bli glöd innan du svarar.",
    category: "anger",
    kind: "short",
    minutes: 2,
    animation: "ember",
    metric: "ilska",
    steps: [
      ["Stanna här", 14, ["Stanna", "svara inte än", "vänta", "andas"]],
      ["Andas ut längre", 18, ["Andas in kort", "andas ut längre", "ut", "ut", "släpp"]],
      ["Var sitter elden?", 18, ["Var sitter elden?", "i bröstet?", "i magen?", "i händerna?", "lägg märke"]],
      ["Flammor till glöd", 30, ["Föreställ dig", "flammor", "sjunker", "blir glöd", "fortfarande het", "men inte brinnande"]],
      ["Svara från glöden", 30, ["Nu svarar du", "från glöden", "inte från elden", "vad säger du?", "från vilken plats?"]],
    ],
    closing: "Glöd är fortfarande het. Den brinner bara inte upp rummet.",
    metaphor: {
      intro: "Ilska är eld. Vi släcker den inte — vi väntar tills den blir glöd.",
      illustration: "ember",
    },
  },
  {
    id: "rott-gult-gront",
    title: "Rött, gult, grönt",
    short: "Stanna. Märk. Välj.",
    category: "anger",
    kind: "short",
    minutes: 2,
    animation: "traffic-light",
    metric: "ilska",
    steps: [
      ["Rött: stanna helt", 18, ["Rött ljus", "stanna helt", "säg inget", "skriv inget", "andas"]],
      ["Gult: vad känns under?", 28, ["Gult ljus", "vad känns", "under ilskan?", "är det sårad?", "rädsla?", "skam?", "lyssna"]],
      ["Gult: vad är du rädd för?", 28, ["Vad är du", "rädd för?", "just nu", "bakom ilskan", "kanske inget farligt", "kanske något"]],
      ["Grönt: välj handling", 28, ["Grönt ljus", "välj nu", "vad säger du?", "vad gör du?", "från vilken plats?", "klar"]],
    ],
    closing: "Du svarade — du reagerade inte.",
  },
  {
    id: "vad-finns-under-ilskan",
    title: "Vad finns under ilskan?",
    short: "Ilska brukar ligga ovanpå något annat.",
    category: "anger",
    kind: "reflective",
    minutes: 5,
    animation: "ember",
    metric: "ilska",
    steps: [
      ["Var sitter ilskan?", 36, ["Var i kroppen?", "bröstet?", "käken?", "händerna?", "magen?", "lägg märke"]],
      ["Vad hände innan?", 48, ["Vad hände", "precis innan?", "vad triggade?", "ord?", "blick?", "minne?"]],
      ["Vad gjorde ont?", 56, ["Vad gjorde ont?", "inte bara fel", "vad sårades?", "vilken känsla", "under ilskan?"]],
      ["Vad behövde du?", 56, ["Vad behövde du", "som du inte fick?", "att bli sedd?", "tagen på allvar?", "respekterad?", "förstådd?"]],
      ["Andas. Det får göra ont.", 56, ["Andas in", "andas ut", "det får göra ont", "du behöver inte fixa", "bara lyssna", "vara där"]],
    ],
    closing: "Under ilskan fanns något annat. Du tittade efter.",
    reflectionPrompt: "Vad fanns under?",
  },
  {
    id: "paus-innan-sms",
    title: "Paus innan sms",
    short: "Innan du trycker skicka. En kort sväng.",
    category: "anger",
    kind: "short",
    minutes: 1,
    animation: "traffic-light",
    metric: "ilska",
    steps: [
      ["Lägg telefonen ner", 10, ["Lägg telefonen", "ner", "skicka inte än", "vänta"]],
      ["Andas ut", 10, ["Andas in", "andas ut längre", "släpp axlarna"]],
      ["Vill du säga det om en timme?", 18, ["Skulle du säga", "samma sak", "om en timme?", "om en dag?", "ärligt"]],
      ["Om ja: säg det", 10, ["Om ja", "säg det", "skicka det", "stå för det"]],
      ["Om nej: mjukare version", 12, ["Om nej", "skriv om", "samma sak", "men mjukare", "kortare", "ärligare"]],
    ],
    closing: "Inget skickat i affekt. Du tackar dig själv imorgon.",
  },

  // ─── ARBETSDAG ────────────────────────────────────────────
  {
    id: "innan-arbetsdagen-borjar",
    title: "Innan arbetsdagen börjar",
    short: "Två minuter innan inkorgen.",
    category: "worklife",
    kind: "short",
    minutes: 2,
    animation: "morning-sun",
    metric: "fokus",
    steps: [
      ["Dagens viktigaste sak?", 28, ["Vad är", "dagens viktigaste sak?", "bara en", "vilken är det?", "säg den tyst"]],
      ["Vad får vänta?", 28, ["Vad får vänta", "till imorgon?", "ge ditt tillstånd", "det är okej att inte hinna allt"]],
      ["Vad säger du nej till?", 28, ["Vad säger du nej till", "idag?", "vilket möte?", "vilket samtal?", "vilken uppgift?", "namnge"]],
      ["Andas in", 4, IN_SCRIPT],
      ["Andas ut", 8, ["Andas ut", "längre", "släpp axlarna", "släpp käken", "redo", "klar"]],
      ["Öppna datorn", 14, ["Öppna datorn", "med en riktning", "inte med kaos", "gå"]],
    ],
    closing: "Dagen har en riktning. Det räcker som start.",
  },
  {
    id: "mellan-tva-moten",
    title: "Mellan två möten",
    short: "Sextio sekunder. Stå upp. Andas ut.",
    category: "worklife",
    kind: "short",
    minutes: 1,
    animation: "stretch-up",
    metric: "stress",
    steps: [
      ["Stå upp om du kan", 10, ["Res dig", "om du kan", "ge kroppen luft", "annars sitt och sträck"]],
      ["Släpp axlarna", 10, ["Axlarna", "är de upp?", "släpp dem ner", "lång nacke"]],
      ["Tre långa utandningar", 28, ["Andas in", "andas ut längre", "in", "ut längre", "in", "ut längst", "släpp"]],
      ["Vad behöver nästa möte?", 12, ["Vad behöver", "nästa möte av dig?", "närvaro?", "lugn?", "tydlighet?"]],
    ],
    closing: "Du gick inte rakt in i nästa rum med samma puls.",
  },
  {
    id: "efter-en-lang-dag",
    title: "Efter en lång dag",
    short: "Stäng arbetsdagen innan du går hem mentalt.",
    category: "worklife",
    kind: "short",
    minutes: 3,
    animation: "closing-laptop",
    metric: "stress",
    steps: [
      ["Vad blev klart idag?", 28, ["Vad blev klart", "idag?", "även smått", "räkna upp tre saker", "tyst"]],
      ["Imorgons första sak?", 28, ["Vad är", "imorgons första sak?", "namnge den", "tyst", "den finns kvar imorgon"]],
      ["Lägg i 'imorgon'-lådan", 28, ["Lägg den", "i 'imorgon'-lådan", "den finns kvar", "men inte i huvudet", "stäng locket"]],
      ["Stäng datorn", 28, ["Stäng datorn", "fysiskt om du kan", "annars mentalt", "klick", "stängt"]],
      ["Andas ut längre än in", 36, ["Andas in", "andas ut längre", "släpp jobbet", "andas in", "andas ut", "längre", "släpp", "klar"]],
    ],
    closing: "Du gick hem från jobbet. Inte med jobbet.",
  },
  {
    id: "nar-inkorgen-morrar",
    title: "När inkorgen morrar",
    short: "Inkorgen är inte din chef. Vi prioriterar.",
    category: "worklife",
    kind: "short",
    minutes: 2,
    animation: "inbox-priority",
    metric: "stress",
    steps: [
      ["Stäng inkorgen", 14, ["Stäng inkorgen", "ett ögonblick", "den finns kvar", "men inte i ögonen"]],
      ["Vad är akut — på riktigt?", 22, ["Vad är akut", "på riktigt?", "för dig", "för idag", "inte för andra", "namnge"]],
      ["Vad är akut för andra?", 22, ["Vad är akut", "för någon annan?", "men inte för dig?", "det är inte ditt", "lägg åt sidan"]],
      ["Vad kan vänta?", 22, ["Vad kan vänta", "till imorgon?", "till nästa vecka?", "ge dig själv lov"]],
      ["Öppna — gör en sak", 24, ["Öppna inkorgen", "gör en sak", "en", "inte alla", "klart"]],
    ],
    closing: "En sak gjord. Resten ligger sorterat.",
  },
  {
    id: "innan-du-hamtar-barn",
    title: "Innan du hämtar barn",
    short: "En liten omställning innan du går in genom dörren.",
    category: "worklife",
    kind: "short",
    minutes: 2,
    animation: "doorway",
    metric: "stress",
    steps: [
      ["Stanna utanför", 14, ["Stanna", "utanför dörren", "ett ögonblick", "innan du går in"]],
      ["Släpp dagens lista", 18, ["Allt som var", "på din lista", "släpp det", "det finns kvar", "men inte här"]],
      ["Vad ska du vara?", 28, ["Vad behöver du vara", "när du går in?", "närvarande?", "lugn?", "tålmodig?", "välj en sak"]],
      ["En lång utandning", 18, ["Andas in", "andas ut långt", "släpp", "redo"]],
      ["Gå in", 14, ["Gå in", "som den du vill vara", "inte som en kö av uppgifter"]],
    ],
    closing: "Du gick in som någon — inte som en kö av uppgifter.",
  },
];

export const EXERCISES: Exercise[] = SEEDS.map(build);

export const getExercise = (id: string) => EXERCISES.find((e) => e.id === id);

export const getByCategory = (cat: Category) =>
  EXERCISES.filter((e) => e.category === cat);

export const getByKind = (cat: Category, kind: ExerciseKind | "all") =>
  kind === "all"
    ? getByCategory(cat)
    : EXERCISES.filter((e) => e.category === cat && e.kind === kind);

/** 8 huvudbehov på startsidan (i ordning) */
export const FEELINGS: {
  category: Category;
  label: string;
  question: string;
}[] = [
  { category: "body", label: "Lugna kroppen", question: "Spänd i kropp och käke" },
  { category: "breath", label: "Andas", question: "Behöver bara andas" },
  { category: "anxiety", label: "Hantera oro", question: "Tankarna snurrar" },
  { category: "stress", label: "Släppa tankar", question: "Allt på en gång" },
  { category: "focus", label: "Fokusera", question: "Måste få något gjort" },
  { category: "sleep", label: "Sova", question: "Vill landa mot kvällen" },
  { category: "reflection", label: "Reflektera", question: "Behöver tänka klart" },
  { category: "quick-pause", label: "Snabb paus", question: "Bara stanna en stund" },
];

/** Sekundära kategorier (visas under "Fler") */
export const MORE_CATEGORIES: Category[] = ["compassion", "anger", "worklife"];

export const ALL_CATEGORIES: Category[] = [
  ...FEELINGS.map((f) => f.category),
  ...MORE_CATEGORIES,
];
