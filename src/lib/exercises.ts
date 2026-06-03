import type { AnimationKind } from "@/components/animations";

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

// Kort builder för att hålla biblioteket kompakt
type Seed = {
  id: string;
  title: string;
  short: string;
  category: Category;
  kind: ExerciseKind;
  minutes: number;
  animation: AnimationKind;
  metric: RatingMetric;
  requiresRating?: boolean;
  steps: Array<[string, number]>;
  closing: string;
  microcopy?: string;
  metaphor?: Metaphor;
  reflectionPrompt?: string;
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
    metric: s.metric,
    requiresRating: s.requiresRating ?? s.kind === "short",
    steps: s.steps.map(([label, seconds]) => ({ label, seconds })),
    closing: s.closing,
    microcopy: s.microcopy,
    metaphor: s.metaphor,
    reflectionPrompt: s.reflectionPrompt,
  };
}

// Boilerplate-fri steg-mall för boxandning
const BOX = (rounds = 3): Array<[string, number]> =>
  Array.from({ length: rounds }, () => [
    ["Andas in", 4],
    ["Håll", 4],
    ["Andas ut", 4],
    ["Vila", 4],
  ]).flat() as Array<[string, number]>;

const WAVE = (rounds = 4): Array<[string, number]> =>
  Array.from({ length: rounds }, () => [
    ["Andas in", 4],
    ["Andas ut", 7],
  ]).flat() as Array<[string, number]>;

const SEEDS: Seed[] = [
  // ── ANDAS ────────────────────────────────────────────────
  {
    id: "andas-i-en-ruta",
    title: "Andas i en ruta",
    short: "Fyra sidor, fyra andetag. Du följer banan.",
    category: "breath",
    kind: "short",
    minutes: 2,
    animation: "box-breath",
    metric: "stress",
    steps: BOX(3),
    closing: "Rutan höll i dig. Du behövde inte tänka tempot.",
    metaphor: { intro: "Andetaget får en bana. Du följer den runt — en sida i taget." },
  },
  {
    id: "lang-utandning",
    title: "Lång utandning",
    short: "Längre ut än in. Nervsystemet svalnar.",
    category: "breath",
    kind: "short",
    minutes: 2,
    animation: "breath-wave",
    metric: "stress",
    steps: WAVE(5),
    closing: "Den långa utandningen var själva poängen.",
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
    metaphor: { intro: "Andningen är som en våg. Du sätter inte tempot — du följer det." },
  },
  {
    id: "andas-ner-i-magen",
    title: "Andas ner i magen",
    short: "Andetaget tar sig hela vägen ner.",
    category: "breath",
    kind: "short",
    minutes: 2,
    animation: "breath-wave",
    metric: "kroppsspänning",
    steps: [
      ["Lägg en hand på magen", 10],
      ["Andas in — låt handen lyftas", 4],
      ["Andas ut — handen sänks", 6],
      ["Andas in", 4],
      ["Andas ut", 6],
      ["Andas in", 4],
      ["Andas ut", 6],
      ["Bara känn handen röra sig", 20],
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
      ["Stanna här", 6],
      ["Andas in", 4],
      ["Andas ut", 6],
      ["Andas in", 4],
      ["Andas ut", 6],
      ["Andas in", 4],
      ["Andas ut", 8],
      ["Gå in. Du är klar.", 8],
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

  // ── SNABB PAUS ───────────────────────────────────────────
  {
    id: "sextio-sekunders-paus",
    title: "Sextio sekunders paus",
    short: "En minut. Inget mål. Bara stanna.",
    category: "quick-pause",
    kind: "short",
    minutes: 1,
    animation: "anchor-drop",
    metric: "stress",
    steps: [
      ["Stanna", 10],
      ["Andas in", 5],
      ["Andas ut", 10],
      ["Se dig omkring", 15],
      ["Nämn tre saker du ser", 20],
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
    animation: "pebbles",
    metric: "oro",
    steps: [
      ["En sak du ser", 12],
      ["En sak till", 12],
      ["En sista", 12],
      ["Andas ut", 8],
      ["Du är här.", 6],
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
    animation: "volume-slider",
    metric: "kroppsspänning",
    steps: [
      ["Släpp axlarna", 8],
      ["Mjuka käken", 8],
      ["En lång utandning", 10],
      ["Tillbaka.", 4],
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
      ["Rött: stanna", 10],
      ["Gult: vad känns här?", 15],
      ["Grönt: välj nästa steg", 15],
    ],
    closing: "Du valde. Du reagerade inte bara.",
    metaphor: {
      intro:
        "Mellan impuls och svar finns ett mellanrum. Vi gör det lite större.",
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
    animation: "volume-slider",
    metric: "kroppsspänning",
    steps: [
      ["Lägg märke till käken", 10],
      ["Öppna munnen lite", 8],
      ["Andas ut genom munnen", 10],
      ["Käken hänger.", 12],
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
    animation: "mailbox",
    metric: "stress",
    steps: [
      ["Vad tar plats just nu?", 20],
      ["Välj tre saker tyst", 20],
      ["Lägg den första i 'sen'-lådan", 15],
      ["Den andra", 15],
      ["Den tredje", 15],
      ["Andas ut längre än du andas in", 15],
    ],
    closing: "Tre flikar mindre. Tillräckligt för tystnad.",
    metaphor: { intro: "Stress är en webbläsare med trettio flikar. Vi börjar med tre.", illustration: "mailbox" },
  },

  // ── HANTERA ORO (anxiety) ────────────────────────────────
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
      ["Se trafiken passera", 40],
      ["Lägg märke till en tanke", 50],
      ["Namnge den tyst", 40],
      ["Låt den åka vidare", 60],
      ["Kom tillbaka till trottoaren", 50],
      ["En till tanke — låt den passera", 60],
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
    animation: "drifting-clouds",
    metric: "oro",
    steps: [
      ["Du sitter vid ratten", 40],
      ["Namnge känslan tyst", 40],
      ["Ge den en plats — fönsterplats", 50],
      ["Den får skrika. Du kör.", 60],
      ["Vart vill du köra härnäst?", 60],
      ["En liten handling i den riktningen", 50],
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
      ["Se himlen", 40],
      ["Ett moln glider in", 60],
      ["Det är en känsla — inte ett faktum", 60],
      ["Ett mörkare moln passerar", 60],
      ["Det åker iväg också", 60],
      ["Himlen är kvar. Du är himlen.", 60],
    ],
    closing: "Känslorna passerade. Himlen var ovan dem hela tiden.",
    metaphor: { intro: "Du är inte molnet. Du är himlen som molnen rör sig över.", illustration: "drifting-clouds" },
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
      ["Känn fötterna", 20],
      ["Känn stolen eller golvet", 20],
      ["Ankaret sjunker", 30],
      ["Det rör vid botten", 30],
      ["Andas ut längre än du andas in", 60],
    ],
    closing: "Du är förankrad. Vinden får blåsa.",
    metaphor: { intro: "När huvudet drar iväg behöver vi tyngd i botten. Ankaret sjunker.", illustration: "anchor-drop" },
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
      ["Lägg märke till volymen", 20],
      ["Var sitter den i kroppen?", 30],
      ["Dra reglaget ett snäpp ner", 30],
      ["Ett till", 30],
      ["Andas ut tills volymen blir mjuk", 60],
    ],
    closing: "Volymen blev lägre. Inte noll. Bara lägre.",
    metaphor: { intro: "Oron är ett ljud. Vi sänker volymen — inte stänger av.", illustration: "volume-slider" },
  },

  // ── SLÄPPA TANKAR (stress) ───────────────────────────────
  {
    id: "reset",
    title: "Reset",
    short: "Sänk tempot. Tre tag, en kropp.",
    category: "stress",
    kind: "short",
    minutes: 3,
    animation: "volume-slider",
    metric: "stress",
    steps: [
      ["Släpp axlarna", 20],
      ["Mjuka käken", 20],
      ["Andas ut genom munnen", 20],
      ["Lägg märke till kroppen", 30],
      ["Lägg märke till tankarna", 30],
      ["Kom tillbaka hit", 30],
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
    animation: "mailbox",
    metric: "stress",
    steps: [
      ["Vad försöker du lösa nu?", 30],
      ["Skriv tyst en lapp", 30],
      ["Lägg den i 'sen'-lådan", 30],
      ["Lådan är inte glömska — den är paus", 30],
      ["Andas ut", 30],
    ],
    closing: "Du behöver inte lösa allt nu. Det får vänta.",
    metaphor: { intro: "Vi lägger lappen i en låda märkt 'sen'. Den finns kvar. Den behöver bara inte lösas nu.", illustration: "mailbox" },
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
      ["Var är volymen nu?", 20],
      ["Dra ner ett snäpp", 25],
      ["Andas ut", 15],
      ["Ett snäpp till", 25],
      ["Andas ut", 15],
      ["Det är mjukare här", 20],
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
    animation: "anchor-drop",
    metric: "stress",
    steps: [
      ["Vad har du burit på idag?", 40],
      ["Sätt ord på en sak", 50],
      ["Lägg ner den — bara i fem minuter", 60],
      ["Den finns kvar. Den ligger där nere.", 40],
      ["Du hämtar den sen om du vill.", 60],
    ],
    closing: "Du satte ner den. Det räknas.",
    reflectionPrompt: "Vad lade du ner just nu?",
  },

  // ── FOKUSERA (focus) ─────────────────────────────────────
  {
    id: "valj-en-sak",
    title: "Välj en sak",
    short: "Tre kandidater. En vinnare. Resten väntar.",
    category: "focus",
    kind: "short",
    minutes: 3,
    animation: "sorting-shelf",
    metric: "fokus",
    steps: [
      ["Tre saker du gör NU", 40],
      ["Tre som får VÄNTA", 40],
      ["Tre du ALDRIG gör", 40],
      ["Välj minsta från NU-högen", 30],
      ["Andas. Sen börjar du där.", 30],
    ],
    closing: "Sorterat. Nu behöver hjärnan inte hålla det åt dig.",
    metaphor: { intro: "När allt känns lika viktigt blir inget gjort. Vi tvingar fram tre högar.", illustration: "sorting-shelf" },
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
      ["Lägg märke till hur spritt det är", 20],
      ["Välj ett ord eller en uppgift", 30],
      ["Låt det vara mitten", 30],
      ["Allt annat får finnas i kanten", 40],
      ["Andas in mot mitten", 40],
    ],
    closing: "Linsen är inte perfekt. Den är bara mer samlad.",
    metaphor: { intro: "Fokus är inte att stänga av allt. Det är att samla något i mitten.", illustration: "focus-lens" },
  },
  {
    id: "borja-litet",
    title: "Börja litet",
    short: "Första handlingen. Bara den.",
    category: "focus",
    kind: "short",
    minutes: 2,
    animation: "focus-lens",
    metric: "fokus",
    steps: [
      ["Vad är första handlingen?", 30],
      ["Gör den så liten att det blir absurt", 30],
      ["Sätt en två-minuters timer mentalt", 20],
      ["Andas ut", 20],
      ["Gå.", 20],
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
    animation: "focus-lens",
    metric: "fokus",
    steps: [
      ["Vad ska du skriva om?", 20],
      ["En mening i huvudet — inte perfekt", 30],
      ["Andas in", 4],
      ["Andas ut", 6],
      ["Skriv första meningen tyst", 30],
      ["Öppna dokumentet.", 30],
    ],
    closing: "Första meningen finns redan. Resten är bara skriva ner.",
  },

  // ── SOVA (sleep) ─────────────────────────────────────────
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
      ["Sänk tempot", 60],
      ["Släpp pannan", 60],
      ["Käken får hänga", 60],
      ["Axlar tunga", 90],
      ["Bröstkorgen mjuk", 90],
      ["Magen släpper", 60],
      ["Benen tunga", 60],
      ["Fötter varma", 60],
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
    animation: "body-scan",
    metric: "trötthet",
    steps: [
      ["Hjässan blir varm", 40],
      ["Pannan släpper", 40],
      ["Käken släpper", 40],
      ["Axlarna tunga", 40],
      ["Bröstet mjukt", 40],
      ["Magen släpper", 40],
      ["Benen tunga", 40],
      ["Fötterna varma", 40],
      ["Hela kroppen vilar", 40],
    ],
    closing: "Värmen finns kvar. Tankarna får stanna utanför.",
    metaphor: { intro: "Föreställ dig en varm stråle som rör sig sakta nedåt. Det den passerar blir tungt.", illustration: "body-scan" },
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
      ["Vad hände idag?", 30],
      ["Skriv en kort lapp tyst", 30],
      ["Lägg den i lådan märkt 'imorgon'", 30],
      ["Stäng locket", 20],
      ["Andas ut långsamt", 60],
    ],
    closing: "Dagen ligger i lådan. Den finns kvar imorgon.",
    metaphor: { intro: "Dagen behöver inte ligga i huvudet hela natten. Vi lägger den i en låda märkt 'imorgon'.", illustration: "mailbox" },
  },
  {
    id: "lang-utandning-for-natten",
    title: "Lång utandning för natten",
    short: "Längre ut än in. Tills kroppen följer med.",
    category: "sleep",
    kind: "short",
    minutes: 3,
    animation: "breath-wave",
    metric: "trötthet",
    steps: WAVE(7),
    closing: "Kroppen följde med till slut. Som den brukar.",
  },

  // ── LUGNA KROPPEN (body) ─────────────────────────────────
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
      ["Pannan", 50],
      ["Käken", 50],
      ["Hals och axlar", 60],
      ["Bröstkorg", 60],
      ["Mage", 50],
      ["Höfter och ben", 60],
      ["Fötter", 50],
    ],
    closing: "Du skannade utan att fixa. Det är hela övningen.",
    reflectionPrompt: "Var höll kroppen mest?",
  },
  {
    id: "kanna-fotterna",
    title: "Känn fötterna",
    short: "Tjugo sekunder ner till golvet.",
    category: "body",
    kind: "short",
    minutes: 1,
    animation: "anchor-drop",
    metric: "kroppsspänning",
    steps: [
      ["Hela foten mot golvet", 15],
      ["Vikten ner i hälarna", 15],
      ["Tårna avslappnade", 15],
      ["Andas ut nedåt", 15],
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
    animation: "volume-slider",
    metric: "kroppsspänning",
    steps: [
      ["Lägg märke till käken", 12],
      ["Öppna munnen lite", 12],
      ["Tungan ner från gommen", 12],
      ["Andas ut genom munnen", 24],
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
    animation: "volume-slider",
    metric: "kroppsspänning",
    steps: [
      ["Dra axlarna upp", 8],
      ["Släpp dem ner", 12],
      ["Lägg märke till skillnaden", 15],
      ["En till — upp", 8],
      ["Och släpp", 15],
      ["Bara hänger nu.", 22],
    ],
    closing: "Axlarna kom ner. Det syns inte. Men du känner det.",
  },

  // ── REFLEKTERA (reflection) ──────────────────────────────
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
      ["Vad är det första som dyker upp?", 60],
      ["Är det vad du behöver — eller vad du tror att du borde?", 60],
      ["Vad skulle hjälpa just i denna timme?", 60],
      ["Vad är en mycket liten version av det?", 60],
      ["Skulle du kunna ge dig det?", 60],
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
    animation: "walking-path",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Vem jämför du dig med just nu?", 60],
      ["Vad kostar den jämförelsen dig?", 60],
      ["Lägg ner måttstocken — bara i fem minuter", 60],
      ["Vad finns kvar när du inte mäter?", 90],
      ["En sak du faktiskt gillar med ditt liv just nu", 90],
      ["Den får finnas — utan att jämföras", 60],
    ],
    closing: "Måttstocken finns kvar. Den behöver bara inte ligga i handen.",
    metaphor: { intro: "Vi går runt med en måttstock som vi inte minns när vi tog upp. Vi lägger ner den ett tag.", illustration: "walking-path" },
    reflectionPrompt: "Vad såg du när måttstocken låg ner?",
  },
  {
    id: "vad-forsoker-kanslan-saga",
    title: "Vad försöker känslan säga?",
    short: "Känslan är inte sanningen. Den är en signal.",
    category: "reflection",
    kind: "reflective",
    minutes: 8,
    animation: "drifting-clouds",
    metric: "oro",
    requiresRating: false,
    steps: [
      ["Vilken känsla är starkast nu?", 60],
      ["Var sitter den i kroppen?", 60],
      ["Vad försöker den säga?", 90],
      ["Vad skulle den behöva höra?", 90],
      ["Skulle du kunna säga det själv?", 90],
      ["Låt känslan vara. Den får finnas.", 90],
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
    animation: "sorting-shelf",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Vad bär du på just nu?", 60],
      ["Vad är ditt?", 60],
      ["Vad är någon annans?", 60],
      ["Vad kan du lägga tillbaka — vänligt?", 90],
      ["Vad väljer du att behålla?", 90],
    ],
    closing: "Du sorterade. Något blev någon annans igen.",
    reflectionPrompt: "Vad var inte ditt?",
  },

  // ── KOMPASSION (compassion) ──────────────────────────────
  {
    id: "tre-vanliga-meningar",
    title: "Tre vänliga meningar",
    short: "Tre saker du skulle säga till en vän. Till dig själv.",
    category: "compassion",
    kind: "reflective",
    minutes: 4,
    animation: "warm-hand",
    metric: "stress",
    requiresRating: false,
    steps: [
      ["Tänk på dig själv som en vän", 45],
      ["Säg en vänlig mening tyst", 60],
      ["En till", 60],
      ["Och en sista", 60],
      ["Låt det landa", 45],
    ],
    closing: "Inte tönt. Bara rättvist.",
    metaphor: { intro: "Du pratar snällare med vänner än med dig själv. Vi lånar tonen tillbaka.", illustration: "unknotting" },
    reflectionPrompt: "Vilken mening behövde du höra mest?",
  },
  {
    id: "du-far-vara-mansklig",
    title: "Du får vara mänsklig",
    short: "Du är inte ett projekt. Du är en människa.",
    category: "compassion",
    kind: "short",
    minutes: 3,
    animation: "unknotting",
    metric: "stress",
    steps: [
      ["Det här är svårt", 40],
      ["Du gör så gott du kan just nu", 40],
      ["Du behöver inte vara perfekt", 40],
      ["Andas in vänlighet", 30],
      ["Andas ut piskan", 30],
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
      ["Vad säger du till dig själv just nu?", 30],
      ["Skulle du säga det till en vän?", 30],
      ["Sänk volymen ett snäpp", 30],
      ["En vänligare version — vad blir det?", 40],
      ["Säg den tyst", 40],
    ],
    closing: "Piskan ligger på golvet. Den får ligga där.",
  },

  // ── ILSKA (anger) ────────────────────────────────────────
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
      ["Stanna här", 15],
      ["Andas ut längre", 20],
      ["Var sitter elden i kroppen?", 20],
      ["Låt flammorna sjunka till glöd", 30],
      ["Svara från glöden — inte elden", 35],
    ],
    closing: "Glöd är fortfarande het. Den brinner bara inte upp rummet.",
    metaphor: { intro: "Ilska är eld. Vi släcker den inte — vi väntar tills den blir glöd.", illustration: "ember" },
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
      ["Rött: stanna helt", 20],
      ["Gult: vad känns under ilskan?", 30],
      ["Gult: vad är du rädd för?", 30],
      ["Grönt: välj nästa handling", 30],
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
      ["Var sitter ilskan i kroppen?", 40],
      ["Vad hände precis innan?", 50],
      ["Vad gjorde ont — inte bara fel?", 60],
      ["Vad behövde du som du inte fick?", 60],
      ["Andas. Det får göra ont.", 60],
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
      ["Lägg telefonen ner", 10],
      ["Andas ut", 10],
      ["Vill du säga det här om en timme?", 20],
      ["Om ja: säg det", 10],
      ["Om nej: skriv en mjukare version", 10],
    ],
    closing: "Inget skickat i affekt. Du tackar dig själv imorgon.",
  },

  // ── ARBETSDAG (worklife) ─────────────────────────────────
  {
    id: "innan-arbetsdagen-borjar",
    title: "Innan arbetsdagen börjar",
    short: "Två minuter innan inkorgen.",
    category: "worklife",
    kind: "short",
    minutes: 2,
    animation: "focus-lens",
    metric: "fokus",
    steps: [
      ["Vad är dagens en viktiga sak?", 30],
      ["Vad får vänta?", 30],
      ["Vad får du säga nej till idag?", 30],
      ["Andas in", 4],
      ["Andas ut", 8],
      ["Öppna datorn nu.", 18],
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
    animation: "anchor-drop",
    metric: "stress",
    steps: [
      ["Stå upp om du kan", 10],
      ["Släpp axlarna", 10],
      ["Tre långa utandningar", 30],
      ["Vad behöver nästa möte av dig?", 10],
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
    animation: "mailbox",
    metric: "stress",
    steps: [
      ["Vad blev klart idag?", 30],
      ["Vad är imorgons första sak?", 30],
      ["Lägg den i lådan märkt 'imorgon'", 30],
      ["Stäng datorn — fysiskt eller mentalt", 30],
      ["Andas ut längre än du andas in", 40],
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
    animation: "sorting-shelf",
    metric: "stress",
    steps: [
      ["Stäng inkorgen ett ögonblick", 15],
      ["Vad är akut idag — på riktigt?", 25],
      ["Vad är akut för någon annan?", 25],
      ["Vad kan vänta till imorgon?", 25],
      ["Öppna inkorgen — gör en sak", 30],
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
    animation: "anchor-drop",
    metric: "stress",
    steps: [
      ["Stanna utanför ett ögonblick", 15],
      ["Släpp dagens lista", 20],
      ["Vad behöver du vara när du går in?", 30],
      ["En lång utandning", 20],
      ["Gå in.", 15],
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
