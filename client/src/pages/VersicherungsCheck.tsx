import { useState } from 'react';
import { Link } from 'wouter';
import SEO from '@/components/SEO';
import FunnelOverlay from '@/components/FunnelOverlay';
import { trackEvent, trackConversion } from '@/lib/analytics';
import '@/styles/funnel.css';
import { Shield, ChevronRight, CheckCircle, AlertTriangle, XCircle, RotateCcw, Phone, MessageCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; icon?: string }[];
}

const questions: Question[] = [
  {
    id: 'lebenssituation',
    question: 'Wie ist Ihre aktuelle Lebenssituation?',
    options: [
      { label: 'Single / Alleinstehend', value: 'single', icon: '👤' },
      { label: 'Paar ohne Kinder', value: 'paar', icon: '👫' },
      { label: 'Familie mit Kindern', value: 'familie', icon: '👨‍👩‍👧‍👦' },
      { label: 'Senior / Rentner', value: 'senior', icon: '🧓' },
    ]
  },
  {
    id: 'wohnsituation',
    question: 'Wie wohnen Sie?',
    options: [
      { label: 'Mietwohnung', value: 'miete', icon: '🏢' },
      { label: 'Eigentumswohnung', value: 'eigentum_wohnung', icon: '🏠' },
      { label: 'Eigenes Haus', value: 'haus', icon: '🏡' },
      { label: 'Bei den Eltern / WG', value: 'eltern', icon: '🏘️' },
    ]
  },
  {
    id: 'auto',
    question: 'Besitzen Sie ein Fahrzeug?',
    options: [
      { label: 'Ja, ein Auto', value: 'auto', icon: '🚗' },
      { label: 'Ja, mehrere Fahrzeuge', value: 'mehrere', icon: '🚗🚗' },
      { label: 'Ja, Motorrad / Roller', value: 'zweirad', icon: '🏍️' },
      { label: 'Nein, kein Fahrzeug', value: 'kein', icon: '🚶' },
    ]
  },
  {
    id: 'beruf',
    question: 'Wie ist Ihre berufliche Situation?',
    options: [
      { label: 'Angestellt', value: 'angestellt', icon: '💼' },
      { label: 'Selbstständig / Freiberuflich', value: 'selbststaendig', icon: '🏪' },
      { label: 'Beamter', value: 'beamter', icon: '🏛️' },
      { label: 'Student / Azubi', value: 'student', icon: '🎓' },
      { label: 'Nicht berufstätig / Rentner', value: 'nicht_berufstaetig', icon: '🌿' },
    ]
  },
  {
    id: 'vorsorge',
    question: 'Haben Sie bereits für das Alter vorgesorgt?',
    options: [
      { label: 'Ja, ausreichend', value: 'ja', icon: '✅' },
      { label: 'Teilweise, aber unsicher', value: 'teilweise', icon: '🤔' },
      { label: 'Nein, noch nicht', value: 'nein', icon: '❌' },
      { label: 'Weiß ich nicht genau', value: 'unsicher', icon: '❓' },
    ]
  },
  {
    id: 'bestehend',
    question: 'Welche Versicherungen haben Sie bereits?',
    options: [
      { label: 'Haftpflicht & Hausrat', value: 'basis', icon: '📋' },
      { label: 'Mehrere (Kfz, Haftpflicht etc.)', value: 'mehrere', icon: '📑' },
      { label: 'Nur Kfz-Versicherung', value: 'nur_kfz', icon: '🚗' },
      { label: 'Keine / Weiß nicht', value: 'keine', icon: '🤷' },
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
    hoch: { color: 'text-red-600 bg-red-50 border-red-200', icon: AlertTriangle, label: 'Dringend empfohlen' },
    mittel: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: CheckCircle, label: 'Empfehlenswert' },
    niedrig: { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle, label: 'Optional' },
  };

  const whatsappNumber = "15566771019";

  return (
    <>
      <SEO
        title="Versicherungscheck – Bin ich richtig versichert? | ERGO Agentur Stübe"
        description="Kostenloser Versicherungscheck in 2 Minuten. Finden Sie heraus, welche Versicherungen Ihnen fehlen. Persönliche Empfehlung von ERGO Berater Morino Stübe."
        keywords="Versicherungscheck, Versicherung prüfen, welche Versicherung brauche ich, Versicherungslücken, ERGO Ganderkesee"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-14">

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-ergo-red/10 text-ergo-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Kostenloser Versicherungscheck
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Bin ich richtig versichert?
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              6 kurze Fragen – Ihre persönliche Empfehlung in 2 Minuten
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-ergo-red h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!showResult ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
              <p className="text-xs text-gray-400 mb-2 font-semibold">Frage {currentStep + 1} von {questions.length}</p>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                {questions[currentStep].question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all min-h-[56px] ${
                      answers[questions[currentStep].id] === option.value
                        ? 'border-ergo-red bg-red-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{option.icon}</span>
                    <span className="font-medium text-gray-800">{option.label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto shrink-0" />
                  </button>
                ))}
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mt-4 text-sm text-gray-400 hover:text-gray-600 font-medium"
                >
                  ← Zurück
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-3 ${
                    hochCount >= 3 ? 'bg-red-100 text-red-700' : hochCount >= 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {hochCount >= 3 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {hochCount >= 3 ? `${hochCount} dringende Empfehlungen` : hochCount >= 1 ? `${hochCount} wichtige Empfehlung${hochCount > 1 ? 'en' : ''}` : 'Sie sind gut aufgestellt!'}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Ihre persönliche Auswertung
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Basierend auf Ihren Angaben empfehlen wir folgende Versicherungen:
                  </p>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, i) => {
                    const config = priorityConfig[rec.priority];
                    const Icon = config.icon;
                    return (
                      <Link key={i} href={rec.link}>
                        <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${config.color} cursor-pointer hover:shadow-md transition-shadow`}>
                          <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{rec.name}</span>
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80">{config.label}</span>
                            </div>
                            <p className="text-sm text-gray-600">{rec.reason}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 shrink-0 text-gray-400 mt-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#003781] to-[#005ab4] rounded-2xl p-6 text-white text-center mb-6">
                <h3 className="text-lg font-bold mb-2">Kostenlose persönliche Beratung</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Ich analysiere Ihre Versicherungen und zeige Ihnen, wie Sie bis zu 15% mit dem Bündelnachlass sparen können.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => { setShowFunnel(true); trackEvent('check_to_funnel'); }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#003781] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors min-h-[48px]"
                  >
                    <Phone className="w-4 h-4" /> Jetzt beraten lassen
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hallo Herr Stübe, ich habe gerade den Versicherungscheck auf Ihrer Seite gemacht und hätte gerne eine persönliche Beratung.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25d366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1da851] transition-colors min-h-[48px]"
                  >
                    <MessageCircle className="w-4 h-4" /> Per WhatsApp
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button onClick={reset} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium">
                  <RotateCcw className="w-4 h-4" /> Check wiederholen
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            Dieser Check ersetzt keine individuelle Beratung. Für eine umfassende Analyse kontaktieren Sie uns persönlich.
          </p>
        </div>
      </div>

      {showFunnel && <FunnelOverlay isOpen={showFunnel} onClose={() => setShowFunnel(false)} />}
    </>
  );
}
