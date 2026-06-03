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
  | "pulse";

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
}

export const CATEGORY_LABELS: Record<Category, string> = {
  calm: "Andning",
  stress: "Stress",
  sleep: "Sömn",
  anxiety: "Ångest",
  focus: "Fokus",
  compassion: "Självmedkänsla",
  recovery: "Snabb hjälp",
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
    id: "reset",
    title: "Reset",
    short: "En snabb omstart för kropp och huvud.",
    category: "stress",
    categoryLabel: "Stress",
    minutes: 3,
    animation: "reset-shapes",
    metric: "kroppsspänning",
    steps: [
      { label: "Släpp ner axlarna", seconds: 20 },
      { label: "Ta ett djupt andetag", seconds: 20 },
      { label: "Andas ut genom munnen", seconds: 20 },
      { label: "Lägg märke till kroppen", seconds: 30 },
      { label: "Lägg märke till tankarna", seconds: 30 },
      { label: "Kom tillbaka hit", seconds: 30 },
    ],
    closing: "Bra. Du gjorde bokstavligen ingenting i tre minuter. Starkt jobbat.",
  },
  {
    id: "tankar-som-trafik",
    title: "Tankar som trafik",
    short: "Låt tankar och känslor passera utan att hoppa in i varje bil.",
    category: "anxiety",
    categoryLabel: "Mindfulness",
    minutes: 5,
    animation: "passing-thoughts",
    metric: "oro",
    microcopy: "Tankarna får passera. De behöver inte få parkeringstillstånd.",
    steps: [
      { label: "Se tanken", seconds: 60 },
      { label: "Namnge den tyst", seconds: 60 },
      { label: "Låt den passera", seconds: 90 },
      { label: "Kom tillbaka till andetaget", seconds: 90 },
    ],
    closing: "Tankarna fick passera. Du behövde inte följa med.",
  },
  {
    id: "kroppen-forst",
    title: "Kroppen först",
    short: "En lugn skanning från huvud till fot.",
    category: "anxiety",
    categoryLabel: "Ångest",
    minutes: 4,
    animation: "body-scan",
    metric: "kroppsspänning",
    steps: [
      { label: "Känn fötterna", seconds: 40 },
      { label: "Känn stolen eller golvet", seconds: 40 },
      { label: "Lägg märke till käken", seconds: 40 },
      { label: "Släpp axlarna lite", seconds: 40 },
      { label: "Andas ut längre än du andas in", seconds: 80 },
    ],
    closing: "Ångesten fick följa med, men den fick inte köra bilen.",
  },
  {
    id: "fokus-utan-panik",
    title: "Fokus utan panik",
    short: "En sak i taget. Resten får vänta.",
    category: "focus",
    categoryLabel: "Fokus",
    minutes: 4,
    animation: "box-breath",
    metric: "fokus",
    steps: [
      { label: "Andas in", seconds: 4 },
      { label: "Håll", seconds: 4 },
      { label: "Andas ut", seconds: 4 },
      { label: "Håll", seconds: 4 },
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
    id: "sov-mjukare",
    title: "Sov mjukare",
    short: "En lugn landning mot sömn.",
    category: "sleep",
    categoryLabel: "Sömn",
    minutes: 8,
    animation: "sleep-waves",
    metric: "trötthet",
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
    id: "sjalvmedkansla",
    title: "Självmedkänsla för folk som tycker det låter töntigt",
    short: "Ett varmt avbrott. Inget tönt här inne.",
    category: "compassion",
    categoryLabel: "Självmedkänsla",
    minutes: 5,
    animation: "compassion-heart",
    metric: "stress",
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
    id: "akut-paus",
    title: "Akut paus",
    short: "60 sekunder. Bara stanna.",
    category: "recovery",
    categoryLabel: "Snabb hjälp",
    minutes: 1,
    animation: "pulse",
    metric: "stress",
    steps: [
      { label: "Stanna", seconds: 10 },
      { label: "Andas in", seconds: 5 },
      { label: "Andas ut", seconds: 10 },
      { label: "Se dig omkring", seconds: 15 },
      { label: "Nämn tre saker du ser", seconds: 20 },
    ],
    closing: "Du stannade. Det räknas.",
  },
];

export const getExercise = (id: string) => EXERCISES.find((e) => e.id === id);
