export type Category =
  | "calm"
  | "stress"
  | "sleep"
  | "anxiety"
  | "focus"
  | "compassion"
  | "recovery";

export type AnimationKind =
  | "breath-blob"
  | "box-breath"
  | "passing-thoughts"
  | "body-scan"
  | "reset-shapes"
  | "sleep-waves"
  | "compassion-heart"
  | "pulse"
  | "spiral"
  | "orbit"
  | "pendulum"
  | "drifting-leaves"
  | "closing-tabs"
  | "warm-beam"
  | "lifting-stone"
  | "constellation";

export type RatingMetric =
  | "stress"
  | "oro"
  | "energi"
  | "fokus"
  | "trötthet"
  | "kroppsspänning";

export interface ExerciseStep {
  label: string;
  seconds: number;
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
  minutes: number;
  animation: AnimationKind;
  steps: ExerciseStep[];
  metric: RatingMetric;
  closing: string;
  microcopy?: string;
  metaphor?: Metaphor;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  calm: "Lugna mig",
  stress: "Ladda om",
  sleep: "Somna",
  anxiety: "Släppa oro",
  focus: "Fokusera",
  compassion: "Vara snäll mot mig själv",
  recovery: "Snabb hjälp",
};

export const CATEGORY_SUBTITLE: Record<Category, string> = {
  calm: "Sänk tempo. Hitta marken under fötterna.",
  stress: "Stäng några flikar. Inte alla. Bara några.",
  sleep: "Mjuka landningar mot kvällen.",
  anxiety: "Oron får följa med. Den får inte köra.",
  focus: "En sak i taget. Resten får vänta.",
  compassion: "Lite mindre hård. Lite mer mänsklig.",
  recovery: "Sextio sekunder. Bara stanna.",
};

export const METRIC_LABELS: Record<RatingMetric, string> = {
  stress: "Stress",
  oro: "Oro",
  energi: "Energi",
  fokus: "Fokus",
  trötthet: "Trötthet",
  kroppsspänning: "Kroppsspänning",
};

export const EXERCISES: Exercise[] = [
  // ── LUGNA MIG ──────────────────────────────────────────────
  {
    id: "andas-med-katten",
    title: "Andas med katten",
    short: "Fem långsamma andetag. Katten sköter tempot.",
    category: "calm",
    categoryLabel: "Andning",
    minutes: 2,
    animation: "breath-blob",
    metric: "stress",
    microcopy: "Fem andetag. Katten har redan fattat grejen.",
    metaphor: {
      intro:
        "Din kropp är som ett system med för många öppna flikar. Vi börjar med att ladda en sak åt gången: ett andetag.",
      illustration: "spiral",
    },
    steps: [
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 2 },
      { label: "Andas ut", seconds: 6 },
      { label: "Vila", seconds: 2 },
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 2 },
      { label: "Andas ut", seconds: 6 },
      { label: "Vila", seconds: 2 },
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 2 },
      { label: "Andas ut", seconds: 6 },
      { label: "Vila", seconds: 2 },
    ],
    closing: "Klart. Du andades. Revolutionerande, men ändå effektivt.",
  },
  {
    id: "spiral-andning",
    title: "Spiralandningen",
    short: "Andetag som rullar inåt och utåt i en spiral.",
    category: "calm",
    categoryLabel: "Andning",
    minutes: 3,
    animation: "spiral",
    metric: "stress",
    metaphor: {
      intro:
        "Tänk dig att andetagen ritar en spiral. När du andas in dras den inåt, när du andas ut släpper den ut igen.",
    },
    steps: [
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 7 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 7 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 7 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 7 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 7 },
    ],
    closing: "Spiralen var inte ett virrvarr. Den var en väg.",
  },

  // ── LADDA OM (stress) ──────────────────────────────────────
  {
    id: "stang-flikarna",
    title: "Stäng flikarna",
    short: "Välj tre saker som tar plats. Stäng dem en i taget.",
    category: "stress",
    categoryLabel: "Stress",
    minutes: 4,
    animation: "closing-tabs",
    metric: "stress",
    microcopy: "Din hjärna öppnade 47 flikar. Vi stänger tre av dem nu.",
    metaphor: {
      intro:
        "Stress är som en webbläsare med trettio flikar. Vi behöver inte stänga alla. Vi börjar med tre.",
      illustration: "closing-tabs",
    },
    steps: [
      { label: "Vad tar plats just nu?", seconds: 30 },
      { label: "Välj tre saker tyst", seconds: 40 },
      { label: "Stäng den första", seconds: 30 },
      { label: "Stäng den andra", seconds: 30 },
      { label: "Stäng den tredje", seconds: 30 },
      { label: "Parkera en sak till imorgon", seconds: 40 },
      { label: "Andas ut längre än du andas in", seconds: 40 },
    ],
    closing: "Tre flikar mindre. Tillräckligt för ett ögonblicks tystnad.",
  },
  {
    id: "reset",
    title: "Reset",
    short: "En snabb omstart för kropp och huvud.",
    category: "stress",
    categoryLabel: "Stress",
    minutes: 3,
    animation: "reset-shapes",
    metric: "kroppsspänning",
    metaphor: {
      intro:
        "Kroppen är ett system som behöver luft. Vi släpper trycket på tre ställen: axlar, käke, andetag.",
    },
    steps: [
      { label: "Släpp ner axlarna", seconds: 20 },
      { label: "Ta ett djupt andetag", seconds: 20 },
      { label: "Andas ut genom munnen", seconds: 20 },
      { label: "Lägg märke till kroppen", seconds: 30 },
      { label: "Lägg märke till tankarna", seconds: 30 },
      { label: "Kom tillbaka hit", seconds: 30 },
    ],
    closing: "Du gjorde bokstavligen ingenting i tre minuter. Starkt jobbat.",
  },

  // ── SLÄPPA ORO (anxiety) ───────────────────────────────────
  {
    id: "tankar-som-trafik",
    title: "Tankar som trafik",
    short: "Låt tankar och känslor passera utan att hoppa in i varje bil.",
    category: "anxiety",
    categoryLabel: "Mindfulness",
    minutes: 5,
    animation: "drifting-leaves",
    metric: "oro",
    microcopy: "Tankarna får passera. De behöver inte få parkeringstillstånd.",
    metaphor: {
      intro:
        "Tankar är som löv som driver förbi i en bäck. Du kan se dem utan att hoppa i och simma med dem.",
      illustration: "drifting-leaves",
    },
    steps: [
      { label: "Se tanken", seconds: 60 },
      { label: "Namnge den tyst", seconds: 60 },
      { label: "Låt den passera", seconds: 90 },
      { label: "Kom tillbaka till andetaget", seconds: 90 },
    ],
    closing: "Tankarna fick passera. Du behövde inte följa med.",
  },
  {
    id: "passagerare-pa-bussen",
    title: "Passagerare på bussen",
    short: "Oron får följa med. Du sitter vid ratten.",
    category: "anxiety",
    categoryLabel: "Ångest",
    minutes: 4,
    animation: "pendulum",
    metric: "oro",
    metaphor: {
      intro:
        "Föreställ dig att du kör en buss. Känslorna är passagerare. De får följa med — men de kör inte. Du gör det.",
      illustration: "pendulum",
    },
    steps: [
      { label: "Du kör. Känslan får följa med.", seconds: 40 },
      { label: "Namnge känslan tyst", seconds: 40 },
      { label: "Ge den en plats — kanske fönsterplats", seconds: 50 },
      { label: "Den får skrika om den vill — du fortsätter", seconds: 60 },
      { label: "Kör i den riktning du valt", seconds: 50 },
    ],
    closing: "Ångesten fick följa med. Den fick inte ratten.",
  },
  {
    id: "lagg-ner-stenen",
    title: "Lägg ner stenen",
    short: "Vad har du burit på hela dagen? Sätt ner det här.",
    category: "anxiety",
    categoryLabel: "Oro",
    minutes: 4,
    animation: "lifting-stone",
    metric: "oro",
    metaphor: {
      intro:
        "Vi går runt med stenar i ryggsäcken utan att märka det. Du behöver inte slänga dem. Bara sätta ner dem en stund.",
      illustration: "lifting-stone",
    },
    steps: [
      { label: "Vad har du burit på idag?", seconds: 40 },
      { label: "Sätt ord på en sak — tyst räcker", seconds: 50 },
      { label: "Lägg ner den. Bara i fem minuter.", seconds: 60 },
      { label: "Den finns kvar. Den ligger där nere.", seconds: 40 },
      { label: "Andas ut. Du hämtar den sen om du vill.", seconds: 40 },
    ],
    closing: "Du satte ner den. Det räknas, även om du tar upp den igen.",
  },
  {
    id: "kroppen-forst",
    title: "Kroppen först",
    short: "En lugn skanning från huvud till fot.",
    category: "anxiety",
    categoryLabel: "Ångest",
    minutes: 4,
    animation: "warm-beam",
    metric: "kroppsspänning",
    metaphor: {
      intro:
        "Oro bor ofta i kroppen innan vi hör den i huvudet. Vi börjar längst ner och lyssnar uppåt.",
    },
    steps: [
      { label: "Känn fötterna", seconds: 40 },
      { label: "Känn stolen eller golvet", seconds: 40 },
      { label: "Lägg märke till käken", seconds: 40 },
      { label: "Släpp axlarna lite", seconds: 40 },
      { label: "Andas ut längre än du andas in", seconds: 80 },
    ],
    closing: "Ångesten fick följa med, men den fick inte köra bilen.",
  },

  // ── FOKUSERA (focus) ───────────────────────────────────────
  {
    id: "fokus-utan-panik",
    title: "Fokus utan panik",
    short: "En sak i taget. Resten får vänta.",
    category: "focus",
    categoryLabel: "Fokus",
    minutes: 4,
    animation: "box-breath",
    metric: "fokus",
    metaphor: {
      intro:
        "Fokus är inte att stänga av allt. Det är att välja en sak och låta resten finnas i bakgrunden tills den får sin tur.",
    },
    steps: [
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 4 },
      { label: "Andas ut", seconds: 4 },
      { label: "Håll", seconds: 4 },
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 4 },
      { label: "Andas ut", seconds: 4 },
      { label: "Håll", seconds: 4 },
      { label: "Välj en sak", seconds: 30 },
      { label: "Lägg resten åt sidan", seconds: 30 },
      { label: "Börja enkelt", seconds: 60 },
    ],
    closing: "Din hjärna öppnade 47 flikar. Vi stängde några nu.",
  },
  {
    id: "sortera-ladan",
    title: "Sortera lådan",
    short: "Tre nu. Tre senare. Tre aldrig.",
    category: "focus",
    categoryLabel: "Fokus",
    minutes: 5,
    animation: "orbit",
    metric: "fokus",
    metaphor: {
      intro:
        "När allt känns lika viktigt så blir inget gjort. Vi tvingar fram tre högar: nu, senare, aldrig.",
      illustration: "orbit",
    },
    steps: [
      { label: "Tre saker du gör NU", seconds: 60 },
      { label: "Tre saker som får VÄNTA", seconds: 60 },
      { label: "Tre saker du ALDRIG kommer göra", seconds: 60 },
      { label: "Välj den minsta från NU-högen", seconds: 45 },
      { label: "Andas. Sen börjar du där.", seconds: 45 },
    ],
    closing: "Inget mer i huvudet behövde lösas. Bara sorteras.",
  },

  // ── SOMNA (sleep) ──────────────────────────────────────────
  {
    id: "sov-mjukare",
    title: "Sov mjukare",
    short: "En lugn landning mot sömn.",
    category: "sleep",
    categoryLabel: "Sömn",
    minutes: 8,
    animation: "sleep-waves",
    metric: "trötthet",
    metaphor: {
      intro:
        "Sömn är inte en knapp. Det är en mjuk landning. Vi sänker höjdmetern, en del av kroppen i taget.",
    },
    steps: [
      { label: "Sänk tempot", seconds: 60 },
      { label: "Släpp pannan", seconds: 60 },
      { label: "Låt kroppen bli tung", seconds: 120 },
      { label: "Andas långsamt", seconds: 120 },
      { label: "Tankarna får komma och gå", seconds: 120 },
    ],
    closing: "Bra. Resten av kvällen behöver du inte lösa just nu.",
  },
  {
    id: "varmestralen",
    title: "Värmestrålen",
    short: "En varm stråle vandrar från hjässa till tå.",
    category: "sleep",
    categoryLabel: "Sömn",
    minutes: 6,
    animation: "warm-beam",
    metric: "trötthet",
    metaphor: {
      intro:
        "Föreställ dig en varm stråle som rör sig sakta nedåt genom kroppen. Det den passerar blir tungt och varmt.",
      illustration: "warm-beam",
    },
    steps: [
      { label: "Hjässan blir varm", seconds: 30 },
      { label: "Pannan släpper", seconds: 30 },
      { label: "Käken släpper", seconds: 30 },
      { label: "Axlarna blir tunga", seconds: 40 },
      { label: "Bröstet blir mjukt", seconds: 40 },
      { label: "Magen släpper", seconds: 40 },
      { label: "Benen tunga", seconds: 40 },
      { label: "Fötterna varma", seconds: 40 },
      { label: "Hela kroppen vilar", seconds: 60 },
    ],
    closing: "Värmen finns kvar. Tankarna behöver du inte ta med dig in.",
  },

  // ── VARA SNÄLL (compassion) ────────────────────────────────
  {
    id: "sjalvmedkansla",
    title: "Självmedkänsla för folk som tycker det låter töntigt",
    short: "Ett varmt avbrott. Inget tönt här inne.",
    category: "compassion",
    categoryLabel: "Självmedkänsla",
    minutes: 5,
    animation: "compassion-heart",
    metric: "stress",
    metaphor: {
      intro:
        "Du pratar förmodligen snällare med en vän än med dig själv. Vi lånar tonen tillbaka en stund.",
    },
    steps: [
      { label: "Det här är svårt", seconds: 60 },
      { label: "Du får vara mänsklig", seconds: 60 },
      { label: "Du behöver inte vara perfekt", seconds: 60 },
      { label: "En liten vänlig tanke räcker", seconds: 60 },
      { label: "Andas in värme", seconds: 60 },
    ],
    closing: "En paus räknas också som framsteg.",
  },
  {
    id: "tre-vanliga-meningar",
    title: "Tre vänliga meningar",
    short: "Tre saker du skulle säga till en vän. Sagt till dig själv.",
    category: "compassion",
    categoryLabel: "Självmedkänsla",
    minutes: 4,
    animation: "compassion-heart",
    metric: "stress",
    metaphor: {
      intro:
        "Föreställ dig en vän i exakt din situation. Vad skulle du säga? Säg det till dig själv. Det är inte tönt. Det är rättvist.",
    },
    steps: [
      { label: "Tänk på dig själv som en vän", seconds: 45 },
      { label: "Säg en vänlig mening tyst", seconds: 60 },
      { label: "Säg en till", seconds: 60 },
      { label: "Och en sista", seconds: 60 },
      { label: "Låt det landa. Det får landa.", seconds: 45 },
    ],
    closing: "Du gav dig själv tre vänliga meningar. Inte tönt. Behövdes.",
  },

  // ── SNABB HJÄLP (recovery) ─────────────────────────────────
  {
    id: "akut-paus",
    title: "Akut paus",
    short: "60 sekunder. Bara stanna.",
    category: "recovery",
    categoryLabel: "Snabb hjälp",
    minutes: 1,
    animation: "pulse",
    metric: "stress",
    metaphor: {
      intro: "Sextio sekunder. Inget mål. Bara stanna.",
    },
    steps: [
      { label: "Stanna", seconds: 10 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 10 },
      { label: "Se dig omkring", seconds: 15 },
      { label: "Nämn tre saker du ser", seconds: 20 },
    ],
    closing: "Du stannade. Det räknas.",
  },
  {
    id: "fem-fyra-tre-tva-ett",
    title: "5-4-3-2-1",
    short: "Tillbaka till rummet. Tillbaka till kroppen.",
    category: "recovery",
    categoryLabel: "Grounding",
    minutes: 3,
    animation: "constellation",
    metric: "oro",
    metaphor: {
      intro:
        "När huvudet drar iväg så hämtar vi det tillbaka via sinnena. Punkt för punkt — som en konstellation som ritar sig själv.",
      illustration: "constellation",
    },
    steps: [
      { label: "Fem saker du SER", seconds: 40 },
      { label: "Fyra saker du HÖR", seconds: 40 },
      { label: "Tre saker du KÄNNER mot huden", seconds: 40 },
      { label: "Två saker du LUKTAR", seconds: 40 },
      { label: "En sak du SMAKAR", seconds: 40 },
    ],
    closing: "Du är här igen. I rummet. I kroppen. Det räcker just nu.",
  },
  {
    id: "tacksamhet-utan-glitter",
    title: "Tacksamhet utan glitter",
    short: "Tre små saker som funkade idag. Inget glitter.",
    category: "recovery",
    categoryLabel: "Återhämtning",
    minutes: 3,
    animation: "constellation",
    metric: "energi",
    metaphor: {
      intro:
        "Inget taggigt positivt tänkande här. Tre saker som funkade. Även om de var pinsamt små.",
    },
    steps: [
      { label: "En sak som funkade idag", seconds: 45 },
      { label: "En till — den får vara liten", seconds: 45 },
      { label: "En sista — något du brukar ta för givet", seconds: 45 },
      { label: "Tack. Vi går vidare.", seconds: 30 },
    ],
    closing: "Tre små saker. Inte glitter. Bara sant.",
  },
];

export const getExercise = (id: string) => EXERCISES.find((e) => e.id === id);

export const getByCategory = (cat: Category) =>
  EXERCISES.filter((e) => e.category === cat);

export const FEELINGS: { category: Category; label: string; question: string }[] = [
  { category: "calm", label: "Lugna mig", question: "Jag behöver sänka tempot" },
  { category: "focus", label: "Fokusera", question: "Jag måste få något gjort" },
  { category: "anxiety", label: "Släppa oro", question: "Tankarna snurrar" },
  { category: "sleep", label: "Somna", question: "Jag vill landa mot kvällen" },
  { category: "stress", label: "Ladda om", question: "Allt blev för mycket" },
  { category: "compassion", label: "Vara snäll mot mig själv", question: "Jag är hård mot mig själv" },
];
