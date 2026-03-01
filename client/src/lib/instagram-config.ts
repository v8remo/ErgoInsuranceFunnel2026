// ERGO Instagram Master Config 2026
// Brand constants, topic templates, and content generation

export const ERGO = {
  primary: '#EE0138',
  gradientFrom: '#EE0138',
  gradientTo: '#cc0030',
  gradientAngle: 135,
  background: '#FFFFFF',
  textDark: '#1a1a1a',
  textMedium: '#444444',
  accentBg: '#FFF0F3',
  fontHeadline: "'Montserrat', 'Inter', sans-serif",
  fontBody: "'Inter', 'Montserrat', sans-serif",
  logoText: 'ERGO',
  logoWeight: 900,
  logoSpacing: '8px',
  agency: 'Agentur Morino Stübe',
  region: 'Oldenburg · Delmenhorst · Ganderkesee',
};

export const FORMATS = {
  feed: { width: 1080, height: 1350, label: 'Feed Post (4:5)', ratio: '4:5' },
  story: { width: 1080, height: 1920, label: 'Story (9:16)', ratio: '9:16' },
} as const;

export type FormatKey = keyof typeof FORMATS;

export type HookType = 'schock' | 'angst' | 'fehler' | 'neugier' | 'kontrast';

export const HOOK_LABELS: Record<HookType, string> = {
  schock: 'Schock (Zahlen)',
  angst: 'Angst (Was passiert wenn...)',
  fehler: 'Fehler (Du machst es falsch)',
  neugier: 'Neugier (Storytelling)',
  kontrast: 'Kontrast (Vorher vs. Nachher)',
};

export interface SlideData {
  type: 'hook' | 'context' | 'problem' | 'consequence' | 'emotion' | 'explanation' | 'solution' | 'branding' | 'cta' | 'save';
  label: string;
  headline?: string;
  subtext?: string;
  bullets?: string[];
  quote?: string;
  number?: string;
  numberLabel?: string;
  ctaText?: string;
  ctaKeyword?: string;
}

export interface StoryFrame {
  type: 'hook' | 'fact' | 'explain' | 'poll' | 'tip' | 'cta' | 'share';
  label: string;
  bgColor: 'red' | 'white';
  headline: string;
  subtext?: string;
  pollQuestion?: string;
  pollOptions?: [string, string];
  bullets?: string[];
}

export interface TopicTemplate {
  id: string;
  name: string;
  icon: string;
  seasonal?: string;
  hooks: Record<HookType, string>;
  storySetup: string;
  problem: string;
  consequence: string;
  consequenceNumber: string;
  consequenceLabel: string;
  emotionalQuote: string;
  explanationBullets: string[];
  solutionSteps: string[];
  ctaKeyword: string;
  ctaAutoresponder: string;
  caption: string;
  hashtags: string[];
  heygenScript: string;
  postingDay: string;
  postingTime: string;
  storyFrames: StoryFrame[];
}

export const TOPICS: TopicTemplate[] = [
  {
    id: 'haftpflicht',
    name: 'Haftpflicht-Fails',
    icon: '💥',
    hooks: {
      schock: '8 € gespart.\n50.000 € Schaden.',
      angst: 'Wenn DAS bei dir passiert,\nzahlst du alles selbst.',
      fehler: 'Du sparst an der\nfalschen Stelle.',
      neugier: 'Dieser Fall hat mich\nsprachlos gemacht.',
      kontrast: '500 € gespart.\n50.000 € verloren.',
    },
    storySetup: 'Ein Kunde, 28, wollte sparen.\nHat seine Haftpflicht gekündigt.\n„Brauche ich nicht", hat er gesagt.',
    problem: 'Sein Kind hat beim Spielen\nein parkendes Auto beschädigt.\nLack, Delle, Seitenspiegel.',
    consequence: 'Die Rechnung kam.',
    consequenceNumber: '47.000 €',
    consequenceLabel: 'Schaden. Aus eigener Tasche.',
    emotionalQuote: '„Ich dachte, sowas passiert\nnur anderen."',
    explanationBullets: [
      'Haftpflicht kostet ca. 5–8 € im Monat',
      'Deckt Schäden in Millionenhöhe ab',
      'Ohne zahlt man ALLES selbst',
    ],
    solutionSteps: [
      'Haftpflicht abschließen oder prüfen',
      'Deckungssumme mind. 10 Mio. €',
      'Familienmitglieder mitversichern',
    ],
    ctaKeyword: 'CHECK',
    ctaAutoresponder: 'Danke! Ich melde mich innerhalb von 24h bei dir.',
    caption: `8 € gespart. 50.000 € Schaden. 😔

Ein Kunde hat seine Haftpflicht gekündigt. „Brauche ich nicht." Drei Monate später: Sein Kind beschädigt ein parkendes Auto.

Die Rechnung? 47.000 €. Aus eigener Tasche.

Eine Haftpflicht kostet weniger als ein Kaffee pro Woche. Und kann dich vor dem finanziellen Ruin schützen.

Schick das deinen Eltern. Ernsthaft.

Schreib mir CHECK — ich schau mir das kostenlos an.

#haftpflicht #versicherung #ergo #oldenburg #finanziellesicherheit`,
    hashtags: ['#haftpflicht', '#versicherung', '#ergo', '#oldenburg', '#finanziellesicherheit'],
    heygenScript: `Acht Euro gespart. Fünfzigtausend Euro Schaden.

Ein Kunde von mir, 28 Jahre alt, hat vor ein paar Monaten seine Haftpflichtversicherung gekündigt. „Brauche ich nicht", hat er gesagt. Will sparen.

Drei Monate später: Sein Kind spielt draußen, rennt gegen ein parkendes Auto. Lack kaputt, Delle drin, Seitenspiegel ab.

Die Rechnung? Siebenundvierzigtausend Euro. Und ohne Haftpflicht zahlt er das komplett aus eigener Tasche.

Wisst ihr, was eine Haftpflicht kostet? Fünf bis acht Euro im Monat. Das ist weniger als ein Kaffee pro Woche.

Wenn du keine Haftpflicht hast, oder nicht weißt, ob deine noch aktuell ist — schreib mir einfach CHECK per DM. Ich schau mir das kostenlos an.`,
    postingDay: 'Dienstag',
    postingTime: '18:00–19:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Wusstest du das?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '47.000 €', subtext: 'Schaden ohne Haftpflicht' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Eine Haftpflicht kostet 5–8 € im Monat', subtext: 'Und schützt dich vor Schäden in Millionenhöhe' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Hast du eine Haftpflicht?', pollQuestion: 'Hast du eine Haftpflichtversicherung?', pollOptions: ['Ja, klar!', 'Nein / weiß nicht'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'Drei Dinge die du checken solltest:', bullets: ['Haftpflicht vorhanden?', 'Deckungssumme mind. 10 Mio. €?', 'Familie mitversichert?'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir CHECK', subtext: 'Ich prüfe deine Absicherung kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Teile das mit jemandem,\nden du schützen willst.' },
    ],
  },
  {
    id: 'elementar',
    name: 'Elementarschäden',
    icon: '🌊',
    seasonal: 'Frühling / Unwetter-Saison',
    hooks: {
      schock: 'Dein Keller läuft voll.\nUnd jetzt?',
      angst: 'Dein Haus brennt.\nUnd du bist nicht versichert.',
      fehler: 'Diesen Fehler machen\n80 % aller Hausbesitzer.',
      neugier: 'Was mir letzte Woche\npassiert ist, glaubst du nicht.',
      kontrast: 'Zwei Familien.\nGleiche Situation.\nKomplett anderes Ende.',
    },
    storySetup: 'Letzten Sommer. Starkregen.\nEine Familie in Delmenhorst.\nDer Keller stand in 20 Minuten unter Wasser.',
    problem: 'Heizung kaputt. Möbel zerstört.\nSchimmel an den Wänden.\nDie ganze Familie musste raus.',
    consequence: 'Der Schaden war enorm.',
    consequenceNumber: '85.000 €',
    consequenceLabel: 'Und keine Elementarversicherung.',
    emotionalQuote: '„Wir haben alles verloren.\nUnd keiner hilft uns."',
    explanationBullets: [
      'Nur 50 % der Häuser sind elementarversichert',
      'Starkregen trifft JEDE Region',
      'Wohngebäudeversicherung deckt das NICHT automatisch',
    ],
    solutionSteps: [
      'Elementarschutz prüfen lassen',
      'Wohngebäude + Hausrat absichern',
      'Rückstausicherung installieren',
    ],
    ctaKeyword: 'HAUS',
    ctaAutoresponder: 'Gute Entscheidung! Schick mir kurz deine PLZ und ob du Eigentümer bist.',
    caption: `Dein Keller läuft voll. Und jetzt? 🌊

Letzten Sommer: Starkregen in Delmenhorst. 20 Minuten — und der Keller einer Familie stand unter Wasser.

85.000 € Schaden. Keine Elementarversicherung. Niemand zahlt.

Nur 50 % aller Häuser in Deutschland sind gegen Elementarschäden versichert. Gehört deins dazu?

Schick das deinen Eltern. Die sollten das wissen.

Schreib mir HAUS — ich prüfe das für dich.

#elementarversicherung #hochwasser #ergo #delmenhorst #versicherung`,
    hashtags: ['#elementarversicherung', '#hochwasser', '#ergo', '#delmenhorst', '#versicherung'],
    heygenScript: `Dein Keller läuft voll. In zwanzig Minuten. Und dann?

Letzten Sommer — Starkregen in Delmenhorst. Eine Familie ruft mich an. Keller unter Wasser. Heizung kaputt. Möbel zerstört. Schimmel an den Wänden.

Fünfundachtzigtausend Euro Schaden. Und wisst ihr was? Keine Elementarversicherung. Die normale Wohngebäudeversicherung deckt das nicht ab.

Das Krasse ist: Nur fünfzig Prozent aller Häuser in Deutschland sind gegen Elementarschäden versichert. Obwohl Starkregen mittlerweile überall passiert.

Wenn du ein Haus hast — oder deine Eltern — schreib mir einfach HAUS per DM. Ich prüfe das kostenlos für dich.`,
    postingDay: 'Donnerstag',
    postingTime: '12:00–13:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Ist dein Haus geschützt?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '85.000 €', subtext: 'Schaden durch Starkregen' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Nur 50 % sind versichert', subtext: 'Die Wohngebäudeversicherung deckt Elementar NICHT automatisch ab' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Hast du Elementarschutz?', pollQuestion: 'Ist dein Haus gegen Starkregen versichert?', pollOptions: ['Ja!', 'Nein / Keine Ahnung'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'So schützt du dein Haus:', bullets: ['Elementarschutz prüfen', 'Wohngebäude + Hausrat absichern', 'Rückstausicherung installieren'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir HAUS', subtext: 'Ich prüfe deine Absicherung kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Schick das deinen Eltern.\nErnsthaft.' },
    ],
  },
  {
    id: 'bu',
    name: 'Berufsunfähigkeit',
    icon: '🛡️',
    hooks: {
      schock: 'Jeder 4. wird\nberufsunfähig.\nJeder 4.',
      angst: 'Du verlierst deinen Job.\nUnd dann?',
      fehler: 'Du denkst, du bist\nversichert.\nBist du aber nicht.',
      neugier: 'Drei Worte.\nUnd die Frau fing\nan zu weinen.',
      kontrast: 'Mit Versicherung: kurzer Anruf.\nOhne: Privatinsolvenz.',
    },
    storySetup: 'Ein Kunde, 43, Handwerker.\n20 Jahre auf dem Bau.\nBandscheibenvorfall. Von heute auf morgen.',
    problem: 'Konnte nicht mehr arbeiten.\nKein Einkommen. Laufende Kredite.\nFamilie mit zwei Kindern.',
    consequence: 'Was bleibt ohne BU?',
    consequenceNumber: '1.200 €',
    consequenceLabel: 'Erwerbsminderungsrente. Statt 3.400 € netto.',
    emotionalQuote: '„Ich weiß nicht, wie ich meine\nKinder ernähren soll."',
    explanationBullets: [
      'Jeder 4. wird vor der Rente berufsunfähig',
      'Der Staat zahlt maximal 1.200 € Erwerbsminderungsrente',
      'Psychische Erkrankungen sind Ursache Nr. 1',
    ],
    solutionSteps: [
      'BU-Versicherung abschließen (je jünger, desto günstiger)',
      'Mindestens 75 % des Nettoeinkommens absichern',
      'Keine Wartezeiten oder Ausschlüsse akzeptieren',
    ],
    ctaKeyword: 'SCHUTZ',
    ctaAutoresponder: 'Ich schau mir das an. Wie alt bist du und was machst du beruflich?',
    caption: `Jeder 4. wird berufsunfähig. Jeder 4. 😡

Ein Kunde von mir, Handwerker, 43 Jahre alt. Bandscheibenvorfall. Von heute auf morgen konnte er nicht mehr arbeiten.

Sein Einkommen? Weg. Seine Kredite? Laufen weiter. Die staatliche Hilfe? 1.200 € Erwerbsminderungsrente.

Eine BU-Versicherung hätte ihm 2.800 € im Monat gesichert. Er hatte keine.

Wie sieht es bei dir aus? Bist du abgesichert?

Schreib mir SCHUTZ — ich schau mir das kostenlos an.

#berufsunfähigkeit #buversicherung #ergo #ganderkesee #absicherung`,
    hashtags: ['#berufsunfähigkeit', '#buversicherung', '#ergo', '#ganderkesee', '#absicherung'],
    heygenScript: `Jeder Vierte wird berufsunfähig. Jeder Vierte!

Ich hatte letztens einen Kunden in der Beratung. Dreiundvierzig Jahre alt, Handwerker, zwanzig Jahre auf dem Bau. Bandscheibenvorfall. Von heute auf morgen konnte er nicht mehr arbeiten.

Und wisst ihr, was der Staat ihm zahlt? Zwölfhundert Euro Erwerbsminderungsrente. Vorher hatte er dreitausendvierhundert Euro netto.

Laufende Kredite. Zwei Kinder. Und kein Einkommen mehr.

Eine Berufsunfähigkeitsversicherung hätte ihm zweitausendachthundert Euro im Monat gesichert. Er hatte keine. Weil er dachte, das passiert ihm nicht.

Wenn du dir unsicher bist, ob du abgesichert bist — schreib mir SCHUTZ per DM. Ich schau mir das kostenlos an.`,
    postingDay: 'Mittwoch',
    postingTime: '17:00–18:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Kannst du dir das leisten?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: 'Jeder 4.', subtext: 'wird berufsunfähig' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Der Staat zahlt nur 1.200 €', subtext: 'Erwerbsminderungsrente — reicht das für deine Familie?' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Hast du eine BU?', pollQuestion: 'Hast du eine Berufsunfähigkeitsversicherung?', pollOptions: ['Ja!', 'Nein / weiß nicht'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'Das solltest du beachten:', bullets: ['Je jünger, desto günstiger', 'Mind. 75 % vom Netto absichern', 'Keine Ausschlüsse akzeptieren'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir SCHUTZ', subtext: 'Ich prüfe deine Absicherung kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Teile das mit jemandem,\nden du schützen willst.' },
    ],
  },
  {
    id: 'enkeltrick',
    name: 'Enkeltrick / Betrug',
    icon: '🚨',
    hooks: {
      schock: '5.000 € weg.\nAn einem Nachmittag.',
      angst: 'Ein Anruf.\nUnd alles ist weg.',
      fehler: 'Deine Haftpflicht ist von 2015?\nDann hast du ein Problem.',
      neugier: 'Ich muss dir was erzählen.\nDas lässt mich nicht los.',
      kontrast: 'Mit Versicherung: kurzer Anruf.\nOhne: 5.000 € weg.',
    },
    storySetup: 'Eine Kundin, 72 Jahre alt.\nLebt allein. Bekommt einen Anruf.\n„Oma, ich hatte einen Unfall. Ich brauche sofort Geld."',
    problem: 'Sie ging zur Bank.\nHob 5.000 € ab.\nÜbergab das Geld an einen Fremden.',
    consequence: 'Das Geld war weg.',
    consequenceNumber: '5.000 €',
    consequenceLabel: 'Ersparnisse. Unwiederbringlich.',
    emotionalQuote: '„Ich wollte doch nur\nmeinem Enkel helfen."',
    explanationBullets: [
      'Über 60.000 Betrugsversuche pro Jahr in Deutschland',
      'Durchschnittlicher Schaden: 5.000–50.000 €',
      'Opfer sind oft ältere, alleinstehende Menschen',
    ],
    solutionSteps: [
      'Familie informieren und sensibilisieren',
      'Bei Anrufen immer auflegen und zurückrufen',
      'Rechtsschutzversicherung prüfen',
    ],
    ctaKeyword: 'BETRUG',
    ctaAutoresponder: 'Ich schick dir eine Checkliste, wie du dich schützen kannst.',
    caption: `5.000 € weg. An einem Nachmittag. 😔

Eine Kundin, 72, bekommt einen Anruf: „Oma, ich hatte einen Unfall. Ich brauche sofort Geld."

Sie ging zur Bank. Hob 5.000 € ab. Übergab alles an einen Fremden.

Es war nicht ihr Enkel. Es war ein Betrüger. Das Geld ist weg.

Über 60.000 solcher Betrugsversuche gibt es jedes Jahr. Schick das deinen Großeltern. Ernsthaft.

Schreib mir BETRUG — ich schicke dir eine Checkliste.

#enkeltrick #betrug #ergo #oldenburg #schutz`,
    hashtags: ['#enkeltrick', '#betrug', '#ergo', '#oldenburg', '#schutz'],
    heygenScript: `Fünftausend Euro weg. An einem Nachmittag.

Eine Kundin von mir, zweiundsiebzig Jahre alt, lebt allein. Bekommt einen Anruf. „Oma, ich hatte einen Unfall. Ich brauche sofort Geld. Bitte hilf mir."

Sie ist zur Bank gegangen, hat fünftausend Euro abgehoben und das Geld einem Fremden gegeben.

Es war nicht ihr Enkel. Es war ein Betrüger.

Wisst ihr, wie oft das passiert? Über sechzigtausend Betrugsversuche pro Jahr in Deutschland. Und der durchschnittliche Schaden liegt zwischen fünf- und fünfzigtausend Euro.

Bitte — schickt dieses Video euren Großeltern. Euren Eltern. Jedem, den ihr schützen wollt.

Und wenn ihr eine Checkliste haben wollt, wie man sich davor schützt — schreibt mir BETRUG per DM.`,
    postingDay: 'Montag',
    postingTime: '10:00–11:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Kennst du den Enkeltrick?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '60.000+', subtext: 'Betrugsversuche pro Jahr' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'So funktioniert der Trick:', subtext: 'Ein Anruf, eine falsche Geschichte, Druck — und das Geld ist weg.' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Kennt deine Oma den Enkeltrick?', pollQuestion: 'Hast du mit deiner Familie darüber gesprochen?', pollOptions: ['Ja!', 'Nein, noch nicht'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'So schützt du deine Familie:', bullets: ['Immer auflegen und zurückrufen', 'Nie Geld an Fremde übergeben', 'Familie regelmäßig informieren'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir BETRUG', subtext: 'Ich schicke dir eine Checkliste.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Schick das deiner Oma.\nErnsthaft.' },
    ],
  },
  {
    id: 'rechtsschutz',
    name: 'Rechtsschutz-Fälle',
    icon: '⚖️',
    hooks: {
      schock: 'Der Anwalt kostet 3.000 €.\nDie du nicht hast.',
      angst: 'Du wirst verklagt.\nKannst du dir einen\nAnwalt leisten?',
      fehler: 'Du denkst, du brauchst\nkeinen Rechtsschutz.\nBis du ihn brauchst.',
      neugier: 'Was mir letzte Woche\npassiert ist, glaubst du nicht.',
      kontrast: 'Mit Rechtsschutz: Anruf beim Anwalt.\nOhne: 15.000 € Prozesskosten.',
    },
    storySetup: 'Ein Kunde bekommt eine Kündigung.\nNach 12 Jahren im Unternehmen.\nOhne Vorwarnung. Ohne Abfindung.',
    problem: 'Er wollte sich wehren.\nAber ein Anwalt kostet Geld.\nArbeitsgericht? Noch teurer.',
    consequence: 'Ohne Rechtsschutz:',
    consequenceNumber: '15.000 €',
    consequenceLabel: 'Anwalts- und Gerichtskosten.',
    emotionalQuote: '„Ich hatte Recht.\nAber ich konnte es mir\nnicht leisten."',
    explanationBullets: [
      'Ein Arbeitsrechtsprozess kostet 5.000–20.000 €',
      'Ohne Rechtsschutz trägst du das volle Risiko',
      'Auch im Miet- und Verkehrsrecht kann es teuer werden',
    ],
    solutionSteps: [
      'Rechtsschutzversicherung abschließen',
      'Arbeitsrecht + Mietrecht + Verkehrsrecht abdecken',
      'Wartezeiten beachten (meist 3 Monate)',
    ],
    ctaKeyword: 'CHECK',
    ctaAutoresponder: 'Danke! Ich melde mich innerhalb von 24h bei dir.',
    caption: `Der Anwalt kostet 3.000 €. Die du nicht hast. 😡

Ein Kunde wird nach 12 Jahren gekündigt. Ohne Vorwarnung. Ohne Abfindung. Er wollte sich wehren — aber ein Arbeitsrechtsprozess kostet bis zu 15.000 €.

Ohne Rechtsschutz hatte er keine Chance.

Recht haben und Recht bekommen sind zwei verschiedene Dinge. Ohne Geld für einen Anwalt verlierst du — auch wenn du im Recht bist.

Bist du abgesichert?

Schreib mir CHECK — ich prüfe das für dich.

#rechtsschutz #anwalt #ergo #delmenhorst #versicherung`,
    hashtags: ['#rechtsschutz', '#anwalt', '#ergo', '#delmenhorst', '#versicherung'],
    heygenScript: `Der Anwalt kostet dreitausend Euro. Die du nicht hast.

Ein Kunde von mir, zwölf Jahre in seinem Unternehmen. Bekommt von heute auf morgen die Kündigung. Ohne Vorwarnung. Ohne Abfindung.

Er wollte sich wehren. Aber wisst ihr, was ein Arbeitsrechtsprozess kostet? Fünf- bis zwanzigtausend Euro. Anwalt, Gericht, Gutachter.

Ohne Rechtsschutzversicherung trägst du das volle Risiko. Und dann überlegst du dir zweimal, ob du dich wehrst — auch wenn du im Recht bist.

Recht haben und Recht bekommen — das sind leider zwei komplett verschiedene Dinge.

Wenn du wissen willst, ob du abgesichert bist — schreib mir CHECK per DM.`,
    postingDay: 'Freitag',
    postingTime: '11:00–12:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Kannst du dir Recht leisten?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '15.000 €', subtext: 'kostet ein Arbeitsrechtsprozess' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Recht haben ≠ Recht bekommen', subtext: 'Ohne Rechtsschutz trägst du die Kosten selbst' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Hast du Rechtsschutz?', pollQuestion: 'Hast du eine Rechtsschutzversicherung?', pollOptions: ['Ja!', 'Nein / weiß nicht'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'Das sollte abgedeckt sein:', bullets: ['Arbeitsrecht', 'Mietrecht', 'Verkehrsrecht'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir CHECK', subtext: 'Ich prüfe deine Absicherung kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Teile das mit jemandem,\nder das wissen sollte.' },
    ],
  },
  {
    id: 'hausrat',
    name: 'Hausrat-Mythen',
    icon: '🏠',
    hooks: {
      schock: 'Deine Hausrat deckt\ndas NICHT ab.',
      angst: 'Einbruch. Alles weg.\nUnd deine Versicherung\nzahlt nicht.',
      fehler: 'Deine Haftpflicht ist von 2015?\nDann hast du ein Problem.',
      neugier: 'Dieser Fall hat mich\nsprachlos gemacht.',
      kontrast: 'Mit Versicherung: kurzer Anruf.\nOhne: 30.000 € Verlust.',
    },
    storySetup: 'Ein Paar kommt aus dem Urlaub.\nDie Wohnung wurde aufgebrochen.\nLaptop, Schmuck, Bargeld — alles weg.',
    problem: 'Sie rufen ihre Versicherung an.\nUnd dann der Schock:\n„Bargeld über 1.000 € ist nicht gedeckt."',
    consequence: 'Was die Versicherung nicht zahlte:',
    consequenceNumber: '12.000 €',
    consequenceLabel: 'wegen veralteter Deckung.',
    emotionalQuote: '„Wir dachten, wir wären\nabgesichert. Waren wir nicht."',
    explanationBullets: [
      'Viele Hausratversicherungen sind veraltet',
      'Bargeld, Fahrräder, Elektronik oft unterversichert',
      'Deckungssumme muss zum aktuellen Wert passen',
    ],
    solutionSteps: [
      'Hausratversicherung aktualisieren',
      'Deckungssumme an aktuellen Besitz anpassen',
      'Fahrrad- und Elektronikschutz prüfen',
    ],
    ctaKeyword: 'CHECK',
    ctaAutoresponder: 'Danke! Ich melde mich innerhalb von 24h bei dir.',
    caption: `Deine Hausrat deckt das NICHT ab. 🔥

Ein Paar kommt aus dem Urlaub. Wohnung aufgebrochen. Laptop, Schmuck, Bargeld — alles weg.

Sie rufen ihre Versicherung an. „Bargeld über 1.000 € ist nicht gedeckt." 12.000 € Verlust — obwohl sie versichert waren.

Wann hast du deine Hausrat zuletzt geprüft?

Speicher dir das. Du wirst es brauchen.

Schreib mir CHECK — ich schau mir das kostenlos an.

#hausratversicherung #einbruch #ergo #ganderkesee #versicherung`,
    hashtags: ['#hausratversicherung', '#einbruch', '#ergo', '#ganderkesee', '#versicherung'],
    heygenScript: `Deine Hausrat deckt das nicht ab.

Ein Paar von mir kommt aus dem Urlaub. Wohnungstür aufgebrochen. Laptop weg, Schmuck weg, Bargeld weg.

Sie rufen ihre Versicherung an. Und dann der Schock: Bargeld über tausend Euro? Nicht gedeckt. Fahrrad draußen geklaut? Nicht gedeckt.

Zwölftausend Euro Verlust — obwohl sie eine Hausratversicherung hatten. Aber die war von zweitausendachtzehn und nie aktualisiert.

Wisst ihr, wann die meisten merken, dass ihre Versicherung nicht reicht? Wenn es zu spät ist.

Wann hast du deine Hausrat zuletzt geprüft? Wenn du es nicht weißt — schreib mir CHECK per DM.`,
    postingDay: 'Samstag',
    postingTime: '10:00–11:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Weißt du, was NICHT\nabgedeckt ist?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '12.000 €', subtext: 'Verlust trotz Versicherung' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Viele Policen sind veraltet', subtext: 'Bargeld, Fahrräder, Elektronik — oft nicht ausreichend gedeckt' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Wann zuletzt geprüft?', pollQuestion: 'Wann hast du deine Hausrat zuletzt gecheckt?', pollOptions: ['Letztes Jahr', 'Keine Ahnung'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'Das solltest du prüfen:', bullets: ['Deckungssumme aktuell?', 'Fahrrad mitversichert?', 'Elektronik ausreichend?'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir CHECK', subtext: 'Ich prüfe deine Absicherung kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Speicher dir das.\nDu wirst es brauchen.' },
    ],
  },
  {
    id: 'kuendigung',
    name: 'Versicherung kündigen',
    icon: '✂️',
    hooks: {
      schock: 'Du sparst 8 €.\nUnd riskierst alles.',
      angst: 'Du kündigst deine Versicherung.\nUnd dann passiert es.',
      fehler: 'Du sparst an der\nfalschen Stelle.',
      neugier: 'Ich muss dir was erzählen.\nDas lässt mich nicht los.',
      kontrast: '96 € im Jahr gespart.\n50.000 € verloren.',
    },
    storySetup: 'Ein Kunde will sparen.\nKündigt seine Haftpflicht, seinen Rechtsschutz.\n„Brauche ich eh nie", sagt er.',
    problem: 'Sechs Monate später:\nEin Wasserschaden in seiner Mietwohnung.\nDer Vermieter will Schadensersatz.',
    consequence: 'Ohne Haftpflicht:',
    consequenceNumber: '28.000 €',
    consequenceLabel: 'Schadensersatz aus eigener Tasche.',
    emotionalQuote: '„Ich wollte nur sparen.\nJetzt bin ich verschuldet."',
    explanationBullets: [
      'Viele kündigen Versicherungen um Geld zu sparen',
      'Der Schaden im Ernstfall ist 100x höher als die Ersparnis',
      'Besser: Tarife optimieren statt blind kündigen',
    ],
    solutionSteps: [
      'Versicherungen PRÜFEN statt kündigen',
      'Tarife vergleichen und optimieren',
      'Kostenlose Beratung nutzen',
    ],
    ctaKeyword: 'CHECK',
    ctaAutoresponder: 'Danke! Ich melde mich innerhalb von 24h bei dir.',
    caption: `Du sparst 8 €. Und riskierst alles. 😡

Ein Kunde kündigt seine Haftpflicht. „Brauche ich eh nie." Sechs Monate später: Wasserschaden in der Mietwohnung. Vermieter will 28.000 € Schadensersatz.

96 € im Jahr gespart. 28.000 € verloren.

Spar nicht an der falschen Stelle. Lass deine Versicherungen lieber prüfen und optimieren.

Schick das jemandem, der gerade „Versicherungen kündigen" googelt.

Schreib mir CHECK — ich optimiere das kostenlos.

#versicherung #sparen #ergo #oldenburg #finanziellesicherheit`,
    hashtags: ['#versicherung', '#sparen', '#ergo', '#oldenburg', '#finanziellesicherheit'],
    heygenScript: `Acht Euro gespart. Und alles riskiert.

Ein Kunde von mir wollte sparen. Verständlich, oder? Hat seine Haftpflicht gekündigt. Seinen Rechtsschutz auch. „Brauche ich eh nie", hat er gesagt.

Sechs Monate später: Wasserschaden in seiner Mietwohnung. Der Vermieter will Schadensersatz. Achtundzwanzigtausend Euro.

Sechsundneunzig Euro im Jahr gespart. Achtundzwanzigtausend Euro verloren.

Leute, kündigt nicht einfach eure Versicherungen, nur um zu sparen. Lasst sie prüfen. Oft kann man optimieren, ohne den Schutz zu verlieren.

Schreibt mir CHECK per DM — ich schau mir das kostenlos für euch an.`,
    postingDay: 'Dienstag',
    postingTime: '19:00–20:00 Uhr',
    storyFrames: [
      { type: 'hook', label: 'Hook', bgColor: 'red', headline: 'Willst du wirklich\nkündigen?' },
      { type: 'fact', label: 'Fakt', bgColor: 'red', headline: '96 € gespart\n28.000 € verloren', subtext: '' },
      { type: 'explain', label: 'Erklärung', bgColor: 'white', headline: 'Kündigen ≠ Sparen', subtext: 'Der Schaden im Ernstfall ist 100x höher als die Ersparnis' },
      { type: 'poll', label: 'Umfrage', bgColor: 'white', headline: 'Hast du schon mal gekündigt?', pollQuestion: 'Hast du schon mal eine Versicherung gekündigt, um zu sparen?', pollOptions: ['Ja', 'Nein'] },
      { type: 'tip', label: 'Tipp', bgColor: 'white', headline: 'Besser als kündigen:', bullets: ['Tarife vergleichen', 'Leistungen optimieren', 'Kostenlose Beratung nutzen'] },
      { type: 'cta', label: 'CTA', bgColor: 'white', headline: 'Schreib mir CHECK', subtext: 'Ich optimiere deine Versicherungen kostenlos.' },
      { type: 'share', label: 'Teilen', bgColor: 'red', headline: 'Schick das jemandem,\nder gerade kündigen will.' },
    ],
  },
];

export function generateSlidesFromTopic(topic: TopicTemplate, hookType: HookType): SlideData[] {
  return [
    {
      type: 'hook',
      label: 'Slide 1 — Hook',
      headline: topic.hooks[hookType],
    },
    {
      type: 'context',
      label: 'Slide 2 — Kontext',
      headline: 'Stell dir vor...',
      subtext: topic.storySetup,
    },
    {
      type: 'problem',
      label: 'Slide 3 — Problem',
      headline: 'Das Problem',
      subtext: topic.problem,
    },
    {
      type: 'consequence',
      label: 'Slide 4 — Konsequenz',
      headline: topic.consequence,
      number: topic.consequenceNumber,
      numberLabel: topic.consequenceLabel,
    },
    {
      type: 'emotion',
      label: 'Slide 5 — Emotion',
      quote: topic.emotionalQuote,
    },
    {
      type: 'explanation',
      label: 'Slide 6 — Erklärung',
      headline: 'Warum passiert das?',
      bullets: topic.explanationBullets,
    },
    {
      type: 'solution',
      label: 'Slide 7 — Lösung',
      headline: 'Was du tun kannst:',
      bullets: topic.solutionSteps,
    },
    {
      type: 'branding',
      label: 'Slide 8 — Branding',
    },
    {
      type: 'cta',
      label: 'Slide 9 — CTA',
      ctaText: `Schreib ${topic.ctaKeyword} per DM`,
      subtext: 'Ich prüfe deine Absicherung kostenlos.',
      ctaKeyword: topic.ctaKeyword,
    },
    {
      type: 'save',
      label: 'Slide 10 — Speichern',
      headline: 'Speichern für später',
      subtext: 'Du wirst es brauchen.',
    },
  ];
}
