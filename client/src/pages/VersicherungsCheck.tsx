import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';
import {
  ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, RotateCcw, Phone, MessageCircle,
  User, Users, UsersRound, Smile, Building, Building2, Home, Car, CarFront, Zap, X,
  Briefcase, BriefcaseBusiness, Landmark, GraduationCap, Sunrise, CheckCircle2, Info,
  HelpCircle, ClipboardCheck, ClipboardList, type LucideIcon
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; icon: LucideIcon }[];
}

const questions: Question[] = [
  {
    id: 'lebenssituation',
    question: 'Wie ist Ihre aktuelle Lebenssituation?',
    options: [
      { label: 'Single / Alleinstehend', value: 'single', icon: User },
      { label: 'Paar ohne Kinder', value: 'paar', icon: Users },
      { label: 'Familie mit Kindern', value: 'familie', icon: UsersRound },
      { label: 'Senior / Rentner', value: 'senior', icon: Smile },
    ]
  },
  {
    id: 'wohnsituation',
    question: 'Wie wohnen Sie?',
    options: [
      { label: 'Mietwohnung', value: 'miete', icon: Building },
      { label: 'Eigentumswohnung', value: 'eigentum_wohnung', icon: Building2 },
      { label: 'Eigenes Haus', value: 'haus', icon: Home },
      { label: 'Bei den Eltern / WG', value: 'eltern', icon: Users },
    ]
  },
  {
    id: 'auto',
    question: 'Besitzen Sie ein Fahrzeug?',
    options: [
      { label: 'Ja, ein Auto', value: 'auto', icon: Car },
      { label: 'Ja, mehrere Fahrzeuge', value: 'mehrere', icon: CarFront },
      { label: 'Ja, Motorrad / Roller', value: 'zweirad', icon: Zap },
      { label: 'Nein, kein Fahrzeug', value: 'kein', icon: X },
    ]
  },
  {
    id: 'beruf',
    question: 'Wie ist Ihre berufliche Situation?',
    options: [
      { label: 'Angestellt', value: 'angestellt', icon: Briefcase },
      { label: 'Selbstständig / Freiberuflich', value: 'selbststaendig', icon: BriefcaseBusiness },
      { label: 'Beamter', value: 'beamter', icon: Landmark },
      { label: 'Student / Azubi', value: 'student', icon: GraduationCap },
      { label: 'Nicht berufstätig / Rentner', value: 'nicht_berufstaetig', icon: Sunrise },
    ]
  },
  {
    id: 'vorsorge',
    question: 'Haben Sie bereits für das Alter vorgesorgt?',
    options: [
      { label: 'Ja, ausreichend', value: 'ja', icon: CheckCircle2 },
      { label: 'Teilweise, aber unsicher', value: 'teilweise', icon: Info },
      { label: 'Nein, noch nicht', value: 'nein', icon: X },
      { label: 'Weiß ich nicht genau', value: 'unsicher', icon: HelpCircle },
    ]
  },
  {
    id: 'bestehend',
    question: 'Welche Versicherungen haben Sie bereits?',
    options: [
      { label: 'Haftpflicht & Hausrat', value: 'basis', icon: ClipboardCheck },
      { label: 'Mehrere (Kfz, Haftpflicht etc.)', value: 'mehrere', icon: ClipboardList },
      { label: 'Nur Kfz-Versicherung', value: 'nur_kfz', icon: Car },
      { label: 'Keine / Weiß nicht', value: 'keine', icon: HelpCircle },
    ]
  },
];

interface Recommendation {
  name: string;
  priority: 'hoch' | 'mittel' | 'niedrig';
  reason: string;
  link: string;
}

function getRecommendations(answers: Record<string, string>): Recommendation[] {
  const recs: Recommendation[] = [];

  if (!['basis', 'mehrere'].includes(answers.bestehend || '')) {
    recs.push({ name: 'Privathaftpflicht', priority: 'hoch', reason: 'Die wichtigste Versicherung überhaupt – schützt Sie vor existenzbedrohenden Schadenersatzforderungen.', link: '/versicherung/haftpflicht' });
  }

  if (['miete', 'eigentum_wohnung', 'haus'].includes(answers.wohnsituation || '')) {
    recs.push({ name: 'Hausratversicherung', priority: 'hoch', reason: 'Schützt Ihr gesamtes Hab und Gut gegen Einbruch, Feuer, Wasser und Sturm.', link: '/versicherung/hausrat' });
  }

  if (answers.wohnsituation === 'haus' || answers.wohnsituation === 'eigentum_wohnung') {
    recs.push({ name: 'Wohngebäudeversicherung', priority: 'hoch', reason: 'Unverzichtbar für Immobilienbesitzer – schützt Ihre größte Investition.', link: '/versicherung/wohngebaeude' });
  }

  if (['auto', 'mehrere', 'zweirad'].includes(answers.auto || '')) {
    recs.push({ name: 'Kfz-Versicherung', priority: 'hoch', reason: 'Gesetzliche Pflicht und wichtiger Schutz für Ihr Fahrzeug.', link: '/versicherung/kfz' });
  }

  if (['angestellt', 'selbststaendig', 'student'].includes(answers.beruf || '')) {
    recs.push({ name: 'Berufsunfähigkeitsversicherung', priority: 'hoch', reason: 'Sichert Ihr Einkommen ab – jeder Vierte wird im Laufe seines Lebens berufsunfähig.', link: '/leben-vorsorge' });
  }

  recs.push({ name: 'Rechtsschutzversicherung', priority: 'mittel', reason: 'Schützt Sie vor hohen Anwalts- und Gerichtskosten im Streitfall.', link: '/versicherung/rechtsschutz' });

  if (answers.lebenssituation === 'familie') {
    recs.push({ name: 'Risikolebensversicherung', priority: 'hoch', reason: 'Schützt Ihre Familie finanziell im schlimmsten Fall.', link: '/leben-vorsorge' });
    recs.push({ name: 'Unfallversicherung (Familie)', priority: 'mittel', reason: 'Zusätzlicher Schutz für die ganze Familie bei Unfällen im Alltag und Freizeit.', link: '/leben-vorsorge' });
  }

  recs.push({ name: 'Zahnzusatzversicherung', priority: 'mittel', reason: 'ERGO Testsieger – SEHR GUT (0,5). Spart hohe Zahnarztkosten.', link: '/versicherung/zahnzusatz' });

  if (['nein', 'unsicher', 'teilweise'].includes(answers.vorsorge || '')) {
    recs.push({ name: 'Private Altersvorsorge', priority: 'hoch', reason: 'Die gesetzliche Rente reicht oft nicht – sorgen Sie jetzt vor.', link: '/leben-vorsorge' });
  }

  return recs;
}

export default function VersicherungsCheck() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showFunnel, setShowFunnel] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    trackEvent('check_answer', { question: questionId, answer: value });

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => {
        setShowResult(true);
        trackConversion();
      }, 300);
    }
  };

  const recommendations = getRecommendations(answers);
  const hochCount = recommendations.filter(r => r.priority === 'hoch').length;
  const progress = showResult ? 100 : Math.round((currentStep / questions.length) * 100);

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const priorityConfig = {
    hoch: { chip: 'ergo-chip ergo-chip--coral', icon: AlertTriangle, label: 'Dringend empfohlen' },
    mittel: { chip: 'ergo-chip ergo-chip--yellow', icon: CheckCircle, label: 'Empfehlenswert' },
    niedrig: { chip: 'ergo-chip ergo-chip--green', icon: CheckCircle, label: 'Optional' },
  };

  const whatsappNumber = "15566771019";

  return (
    <>
      <SEO
        title="Versicherungscheck – Bin ich richtig versichert? | ERGO Agentur Stübe"
        description="Kostenloser Versicherungscheck in 2 Minuten. Finden Sie heraus, welche Versicherungen Ihnen fehlen. Persönliche Empfehlung von ERGO Berater Morino Stübe."
        keywords="Versicherungscheck, Versicherung prüfen, welche Versicherung brauche ich, Versicherungslücken, ERGO Ganderkesee"
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

          <div className="text-center mb-8">
            <p className="ergo-eyebrow">Kostenloser Versicherungscheck</p>
            <h1 className="text-[30px] md:text-[40px] mb-2">
              Bin ich richtig versichert?
            </h1>
            <p className="text-ergo-stone text-sm md:text-base">
              6 kurze Fragen – Ihre persönliche Empfehlung in 2 Minuten
            </p>
          </div>

          <div className="w-full bg-ergo-fog rounded-full h-2 mb-8">
            <div
              className="bg-ergo-red h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!showResult ? (
            <div className="ergo-card p-6 md:p-8">
              <p className="text-xs text-ergo-mute mb-2 font-semibold">Frage {currentStep + 1} von {questions.length}</p>
              <h2 className="text-lg md:text-xl mb-6">
                {questions[currentStep].question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentStep].options.map((option) => {
                  const OptionIcon = option.icon;
                  const selected = answers[questions[currentStep].id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                      className={`ergo-option flex items-center gap-4 p-4 text-left min-h-[56px] ${selected ? 'selected' : ''}`}
                    >
                      <span className="ergo-icon-disc w-10 h-10 shrink-0">
                        <OptionIcon className="w-4 h-4" />
                      </span>
                      <span className="font-medium text-ergo-ink">{option.label}</span>
                      <ChevronRight className="w-5 h-5 text-ergo-mute ml-auto shrink-0" />
                    </button>
                  );
                })}
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-ergo-mute hover:text-ergo-stone font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Zurück
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="ergo-card p-6 md:p-8 mb-6">
                <div className="text-center mb-6">
                  <div className={`mb-3 ${
                    hochCount >= 3 ? 'ergo-chip ergo-chip--coral' : hochCount >= 1 ? 'ergo-chip ergo-chip--yellow' : 'ergo-chip ergo-chip--green'
                  }`}>
                    {hochCount >= 3 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {hochCount >= 3 ? `${hochCount} dringende Empfehlungen` : hochCount >= 1 ? `${hochCount} wichtige Empfehlung${hochCount > 1 ? 'en' : ''}` : 'Sie sind gut aufgestellt!'}
                  </div>
                  <h2 className="text-xl md:text-2xl mb-2">
                    Ihre persönliche Auswertung
                  </h2>
                  <p className="text-ergo-stone text-sm">
                    Basierend auf Ihren Angaben empfehlen wir folgende Versicherungen:
                  </p>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, i) => {
                    const config = priorityConfig[rec.priority];
                    const Icon = config.icon;
                    return (
                      <Link key={i} href={rec.link}>
                        <div className="ergo-tile flex items-start gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer">
                          <span className="ergo-icon-disc w-10 h-10 shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                              <span className="font-sans font-bold text-ergo-ink text-sm sm:text-base">{rec.name}</span>
                              <span className={`${config.chip} self-start text-xs`}>{config.label}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-ergo-stone leading-relaxed">{rec.reason}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 shrink-0 text-ergo-mute mt-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="ergo-section--red rounded-lg p-6 text-center mb-6">
                <h3 className="text-lg mb-2">Kostenlose persönliche Beratung</h3>
                <p className="text-sm text-white/90 mb-4">
                  Ich analysiere Ihre Versicherungen und zeige Ihnen, wie Sie bis zu 15% mit dem Bündelnachlass sparen können.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setShowFunnel(true); trackEvent('check_to_funnel'); }}
                    className="ergo-btn ergo-btn--inverted"
                  >
                    <Phone className="w-4 h-4" /> Jetzt beraten lassen
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich habe gerade den Versicherungscheck auf Ihrer Seite gemacht und hätte gerne eine persönliche Beratung.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ergo-btn ergo-btn--whatsapp"
                  >
                    <MessageCircle className="w-4 h-4" /> Per WhatsApp
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button onClick={reset} className="inline-flex items-center gap-2 text-ergo-mute hover:text-ergo-stone text-sm font-medium">
                  <RotateCcw className="w-4 h-4" /> Check wiederholen
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-ergo-mute mt-8">
            Dieser Check ersetzt keine individuelle Beratung. Für eine umfassende Analyse kontaktieren Sie uns persönlich.
          </p>
        </div>
      </div>

      {showFunnel && <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />}
    </>
  );
}
