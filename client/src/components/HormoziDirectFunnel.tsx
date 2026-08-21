import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Phone, Shield, Home, Car, Star, Check, CheckCircle2, Lock, FileText, MessageCircle,
  Scale, SmilePlus, Briefcase, Building2, HeartHandshake, GraduationCap, Sunrise
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackEvent, trackConversion } from '@/lib/analytics';

interface FormData {
  age: string;
  interests: string[];
  existingInsurances: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
}

export default function HormoziDirectFunnel() {
  // SEO Tags direkt eingebettet
  useEffect(() => {
    document.title = "ERGO Versicherungsberatung - Kostenlose Analyse | Morino Stübe";

    // Meta Description - rechtlich korrekt
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Kostenlose Versicherungsberatung & unverbindliche Analyse Ihrer bestehenden Verträge. ERGO-Berater Morino Stübe - Ganderkesee. Jetzt Beratungstermin anfragen.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // Keywords - rechtlich unbedenklich
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'ERGO Versicherungsberatung, kostenlose Analyse, Morino Stübe, Ganderkesee, Versicherungsmakler, unverbindlich');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // Open Graph - seriös
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'ERGO Versicherungsberatung - Kostenlose Analyse');
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Kostenlose und unverbindliche Versicherungsberatung von Ihrem ERGO-Berater in Ganderkesee.');
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
  }, []);

  // FORMULAR ALS ERSTES - Rechtskonforme Lead-Erfassung
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    interests: [],
    existingInsurances: [],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: ''
  });

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          insuranceType: 'general_consultation',
          age: data.age,
          specificData: {
            interests: data.interests,
            existingInsurances: data.existingInsurances
          },
          source: 'hormozi_direct_funnel'
        })
      });
      if (!response.ok) throw new Error('Failed to submit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setCurrentStep(4);

      // Google Ads Conversion Tracking - Lead generiert
      trackConversion();

      // Analytics Event
      trackEvent('hormozi_lead_generated', {
        interests: formData.interests,
        existing_insurances: formData.existingInsurances,
        age_group: formData.age,
        source: 'hormozi_direct_funnel',
        value: totalSavings
      });
    }
  });

  const progress = (currentStep / 4) * 100;

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      trackEvent('hormozi_funnel_step_completed', { step: currentStep, savings: totalSavings });
    } else {
      submitMutation.mutate(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.age !== '';
      case 2:
        return formData.interests.length > 0;
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.location;
      default:
        return true;
    }
  };

  const toggleInterest = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(productId)
        ? prev.interests.filter(id => id !== productId)
        : [...prev.interests, productId]
    }));
  };

  // Realistische Ersparnisberechnung basierend auf echten ERGO-Preisen 2025
  const savingsPerProduct = {
    haftpflicht: 81,
    hausrat: 149,
    wohngebaeude: 192,
    rechtsschutz: 161,
    zahnzusatz: 157,
    berufsunfaehigkeit: 528,
    kfz_haftpflicht: 384,
    lebensversicherung: 384
  };

  const currentSavings = formData.interests.reduce((total, productId) => {
    return total + (savingsPerProduct[productId as keyof typeof savingsPerProduct] || 150);
  }, 0);

  const bundleBonus = formData.interests.length >= 5 ? Math.round(currentSavings * 0.15) : 0;
  const totalSavings = currentSavings + bundleBonus;

  return (
    <div className="min-h-screen bg-white">

      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8 max-w-full sm:max-w-4xl">
        {/* DIREKTER FUNNEL - GLEICH GANZ OBEN */}
        <div className="ergo-card overflow-hidden mx-1 sm:mx-0">
          {/* HEADER */}
          <div className="bg-ergo-red text-white p-4 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl text-white mb-3 sm:mb-4 leading-tight">
              Kostenlose Versicherungsberatung anfragen
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-3 sm:mb-4">
              Füllen Sie das Formular aus für Ihre unverbindliche Beratung
            </p>

            {/* RECHTLICHER HINWEIS */}
            <div className="border border-white/40 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
              <div className="text-white font-bold mb-2">Rechtliche Hinweise:</div>
              <div className="text-white/90 text-left space-y-1">
                <div>• Kostenlose und unverbindliche Beratung</div>
                <div>• Keine automatischen Vertragsabschlüsse</div>
                <div>• Widerrufsrecht gemäß § 8 VVG</div>
                <div>• Vermittlung erfolgt als gebundener Versicherungsvertreter der ERGO</div>
              </div>
            </div>
          </div>

          {/* FORMULAR FORTSCHRITT */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-ergo-gray border-b border-ergo-line">
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm sm:text-base font-bold text-ergo-ink mb-3 gap-2 sm:gap-0">
              <span>Schritt {currentStep} von 4</span>
              <span className="text-ergo-red">{Math.round(progress)}% abgeschlossen</span>
            </div>
            <div className="w-full h-2 bg-ergo-fog rounded-full overflow-hidden">
              <div
                className="h-2 bg-ergo-red rounded-full transition-all duration-500"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>

          {/* STEP CONTENT */}
          <div className="p-3 sm:p-8">

            {/* STEP 1: AGE SELECTION */}
            {currentStep === 1 && (
              <div>
                {/* Persönlicher Berater */}
                <div className="ergo-card p-6 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                      alt="Morino Stübe - Ihr ERGO Berater"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white border border-ergo-line"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-sans font-bold text-ergo-ink mb-1">Morino Stübe</h3>
                      <p className="text-ergo-red font-semibold mb-2">Ihr persönlicher ERGO-Berater</p>
                      <p className="text-sm text-ergo-stone">Zertifiziert • 3 Jahre Erfahrung • Über 500 zufriedene Kunden</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="ergo-chip ergo-chip--rose mb-6">
                    Schritt 1: Sparen Sie bis zu 847€ pro Jahr!
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 leading-tight">
                    In welcher Altersgruppe befinden Sie sich?
                  </h3>
                  <p className="text-ergo-stone text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                    Ihre Altersgruppe bestimmt Ihre <span className="font-bold text-ergo-red">maximalen Sparpotentiale</span>
                  </p>

                  {/* VALUE PROPOSITION BY AGE */}
                  <div className="bg-ergo-gray border border-ergo-line rounded-lg p-3 sm:p-6 mb-6 sm:mb-8">
                    <div className="text-ergo-ink font-bold text-base sm:text-lg mb-3 sm:mb-4">Je nach Alter sparen Sie unterschiedlich viel:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="bg-white border border-ergo-line p-2 sm:p-3 rounded-lg">18-29: Bis zu <span className="font-bold text-ergo-red">423€/Jahr</span></div>
                      <div className="bg-white border border-ergo-line p-2 sm:p-3 rounded-lg">30-39: Bis zu <span className="font-bold text-ergo-red">687€/Jahr</span></div>
                      <div className="bg-white border-2 border-ergo-red p-2 sm:p-3 rounded-lg">40-49: Bis zu <span className="font-bold text-ergo-red">847€/Jahr</span></div>
                      <div className="bg-white border border-ergo-line p-2 sm:p-3 rounded-lg">50-59: Bis zu <span className="font-bold text-ergo-red">734€/Jahr</span></div>
                      <div className="bg-white border border-ergo-line p-2 sm:p-3 rounded-lg">60+: Bis zu <span className="font-bold text-ergo-red">567€/Jahr</span></div>
                    </div>
                  </div>
                </div>

                {/* ALTERSGRUPPEN-AUSWAHL */}
                <div className="space-y-2 sm:space-y-4">
                  {[
                    {age: '18-29 Jahre', savings: '423€', desc: 'Günstige Einstiegstarife', icon: GraduationCap, highlight: false},
                    {age: '30-39 Jahre', savings: '687€', desc: 'Familie & Beruf absichern', icon: Briefcase, highlight: false},
                    {age: '40-49 Jahre', savings: '847€', desc: 'Maximale Ersparnisse', icon: Star, highlight: true},
                    {age: '50-59 Jahre', savings: '734€', desc: 'Altersvorsorge optimieren', icon: Home, highlight: false},
                    {age: '60+ Jahre', savings: '567€', desc: 'Senioren-Vorteile nutzen', icon: Sunrise, highlight: false}
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    const selected = formData.age === item.age;
                    return (
                      <button
                        type="button"
                        key={item.age}
                        className={`ergo-option w-full p-3 sm:p-5 text-left ${selected ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, age: item.age }));
                          // Haptisches Feedback für mobile
                          if (navigator.vibrate) navigator.vibrate(50);
                        }}
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <div className="flex items-center gap-4">
                            <span className="ergo-icon-disc w-10 h-10">
                              <ItemIcon className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="font-sans font-bold text-base sm:text-xl text-ergo-ink mb-1">{item.age}</div>
                              <div className="text-xs sm:text-sm text-ergo-stone font-medium">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-base sm:text-xl text-ergo-red">-{item.savings}</div>
                            <div className="text-xs text-ergo-mute">pro Jahr</div>
                          </div>
                        </div>
                        {selected && (
                          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-ergo-red">
                            <Check className="w-4 h-4" /> Ausgewählt – weiter zu den Versicherungen
                          </div>
                        )}
                        {item.highlight && !selected && (
                          <div className="mt-3 text-center">
                            <span className="ergo-chip ergo-chip--yellow">Meistgewählt – beste Ersparnisse</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* TRUST */}
                <div className="mt-8 text-center bg-ergo-gray border border-ergo-line rounded-lg p-4">
                  <div className="text-ergo-ink font-bold">
                    Über <span className="text-ergo-red">500 zufriedene Kunden</span> vertrauen auf die persönliche Beratung
                  </div>
                  <div className="text-sm text-ergo-stone mt-1">
                    Antwort innerhalb von 24 Stunden
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: INSURANCE SELECTION */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="ergo-chip ergo-chip--rose mb-6">
                    Schritt 2: Wählen Sie Ihre Ersparnisse aus!
                  </div>

                  <h3 className="text-2xl sm:text-3xl mb-4 leading-tight">
                    Bei welchen Versicherungen wollen Sie sparen?
                  </h3>
                  <p className="text-ergo-stone text-base sm:text-lg mb-6 leading-relaxed">
                    Jede Versicherung = Mehr Ersparnis. <span className="font-semibold text-ergo-red">5+ Versicherungen = 15% EXTRA Rabatt!</span>
                  </p>
                </div>

                {/* VERSICHERUNGSAUSWAHL */}
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { id: "haftpflicht", name: "Haftpflicht", price: "ab 5,26€", oldPrice: "12€", savings: "bis zu 81€", urgent: "PFLICHT!", icon: Shield },
                    { id: "hausrat", name: "Hausrat", price: "ab 12,58€", oldPrice: "25€", savings: "bis zu 149€", urgent: "Preise steigen!", icon: Home },
                    { id: "wohngebaeude", name: "Wohngebäude", price: "ab 28,99€", oldPrice: "45€", savings: "bis zu 192€", urgent: "Elementarschäden!", icon: Building2 },
                    { id: "rechtsschutz", name: "Rechtsschutz", price: "ab 11,60€", oldPrice: "25€", savings: "bis zu 161€", urgent: "Kosten steigen!", icon: Scale },
                    { id: "zahnzusatz", name: "Zahnzusatz", price: "ab 21,95€", oldPrice: "35€", savings: "bis zu 157€", urgent: "Zuschuss sinkt!", icon: SmilePlus },
                    { id: "berufsunfaehigkeit", name: "Berufsunfähigkeit", price: "ab 45€", oldPrice: "89€", savings: "bis zu 528€", urgent: "Jeder 4. betroffen!", icon: Briefcase },
                    { id: "kfz_haftpflicht", name: "Kfz-Haftpflicht", price: "ab 35€", oldPrice: "67€", savings: "bis zu 384€", urgent: "PFLICHT!", icon: Car },
                    { id: "lebensversicherung", name: "Lebensversicherung", price: "ab 35€", oldPrice: "67€", savings: "bis zu 384€", urgent: "Zins sinkt!", icon: HeartHandshake }
                  ].map((product) => {
                    const ProductIcon = product.icon;
                    const selected = formData.interests.includes(product.id);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        className={`ergo-option w-full text-left p-3 sm:p-5 ${selected ? 'selected' : ''}`}
                        onClick={() => {
                          toggleInterest(product.id);
                          // Haptisches Feedback für mobile
                          if (navigator.vibrate) navigator.vibrate(50);
                        }}
                      >
                        <div className="flex items-start gap-2 sm:gap-4">
                          {/* Icon & Checkbox */}
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <span className="ergo-icon-disc w-10 h-10">
                              <ProductIcon className="w-4 h-4" />
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selected
                                ? "bg-ergo-red border-ergo-red text-white"
                                : "border-ergo-line bg-white"
                            }`}>
                              {selected && <Check className="w-3 h-3" />}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-sans font-bold text-sm sm:text-base md:text-lg text-ergo-ink truncate">{product.name}</h4>
                                <div className="text-sm mt-1 text-ergo-stone">
                                  {product.urgent}
                                </div>
                              </div>
                              <div className="text-right ml-3 flex-shrink-0">
                                <div className="font-bold text-xs sm:text-base md:text-lg text-ergo-red">{product.price}</div>
                                <div className="text-xs text-ergo-mute line-through">{product.oldPrice}</div>
                                <div className="text-xs sm:text-sm font-medium text-ergo-check">
                                  {product.savings}/Jahr
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selected && (
                          <div className="mt-2 sm:mt-3 bg-ergo-red-light text-ergo-red px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-medium text-center">
                            Ausgewählt - {product.savings}/Jahr gespart
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* LIVE BUNDLE CALCULATOR */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-8 ergo-card">
                  <div className="text-center">
                    <h4 className="text-lg sm:text-xl mb-3 sm:mb-4">Ihr Sparfortschritt</h4>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-ergo-red mb-3 sm:mb-4">
                      bis zu {totalSavings}€ pro Jahr
                    </div>

                    {formData.interests.length >= 5 ? (
                      <div className="inline-block bg-ergo-check text-white px-6 py-3 rounded-lg font-semibold text-lg mb-6">
                        15% Bündelnachlass aktiviert! +{bundleBonus}€ Bonus
                      </div>
                    ) : (
                      <div className="inline-block bg-ergo-yellow text-ergo-ink px-6 py-3 rounded-lg font-medium text-base mb-6">
                        Noch {5 - formData.interests.length} Versicherung(en) für 15% Extra-Bonus
                      </div>
                    )}

                    <div className="text-base text-ergo-ink font-medium space-y-1">
                      <div>{formData.interests.length} von 8 Versicherungen ausgewählt</div>
                      <div className="text-sm text-ergo-stone">Echte ERGO-Preise mit authentischen Ersparnissen</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT FORM */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-6 sm:mb-8">
                  <div className="ergo-chip ergo-chip--rose mb-4 sm:mb-6">
                    Schritt 3: Ersparnisse sichern!
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 leading-tight">
                    Sichern Sie sich JETZT Ihre bis zu {totalSavings}€ Ersparnis!
                  </h3>
                  <p className="text-ergo-stone text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                    Für Ihr kostenloses Angebot und die persönliche Beratung
                  </p>

                  {/* Persönlicher Berater für Vertrauen */}
                  <div className="ergo-card p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                        alt="Morino Stübe - Ihr ERGO Berater"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white border border-ergo-line"
                      />
                      <div className="text-center sm:text-left">
                        <h4 className="text-lg font-sans font-bold text-ergo-ink mb-1">Ich bin Morino Stübe</h4>
                        <p className="text-ergo-red font-semibold mb-2">Ihr persönlicher Berater bei ERGO</p>
                        <p className="text-sm text-ergo-stone">
                          Ich rufe Sie heute noch zurück für Ihre kostenlose Versicherungsanalyse!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FINAL VALUE REMINDER */}
                  <div className="bg-ergo-red-light border border-ergo-red/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-ergo-red mb-2">
                      Sie sparen: bis zu {totalSavings}€ pro Jahr
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-ergo-ink">
                      Das sind bis zu {Math.round(totalSavings / 12)}€ weniger pro Monat!
                    </div>
                    {bundleBonus > 0 && (
                      <div className="text-ergo-check font-bold mt-2">
                        + {bundleBonus}€ EXTRA durch 15% Bündelnachlass
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm sm:text-base font-semibold">Vorname *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Ihr Vorname"
                        className="mt-1 sm:mt-2 text-base sm:text-lg p-3 sm:p-4 rounded border border-ergo-line focus:border-ergo-red h-11 sm:h-auto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm sm:text-base font-semibold">Nachname *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Ihr Nachname"
                        className="mt-1 sm:mt-2 text-base sm:text-lg p-3 sm:p-4 rounded border border-ergo-line focus:border-ergo-red h-11 sm:h-auto"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base font-semibold">E-Mail-Adresse *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="ihre.email@beispiel.de"
                        className="mt-1 sm:mt-2 text-base sm:text-lg p-3 sm:p-4 rounded border border-ergo-line focus:border-ergo-red h-11 sm:h-auto"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm sm:text-base font-semibold">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="01234 567890"
                        className="mt-1 sm:mt-2 text-base sm:text-lg p-3 sm:p-4 rounded border border-ergo-line focus:border-ergo-red h-11 sm:h-auto"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm sm:text-base font-semibold">Wohnort *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="z.B. Ganderkesee"
                      className="mt-1 sm:mt-2 text-base sm:text-lg p-3 sm:p-4 rounded border border-ergo-line focus:border-ergo-red h-11 sm:h-auto w-full"
                    />
                  </div>
                </div>

                {/* FINAL GUARANTEE */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 ergo-card">
                  <div className="text-center">
                    <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-ergo-check mx-auto mb-3 sm:mb-4" />
                    <h4 className="text-lg sm:text-xl font-sans font-bold text-ergo-ink mb-4">
                      100% KOSTENLOS & UNVERBINDLICH
                    </h4>
                    <ul className="ergo-check-list inline-block text-left text-sm sm:text-base text-ergo-ink font-medium">
                      <li>Kostenlose Analyse Ihrer bestehenden Verträge</li>
                      <li>Persönliche Beratung ohne Verpflichtung</li>
                      <li>Garantierte Ersparnisse oder Geld zurück</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS PAGE */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                <span className="ergo-icon-disc w-20 h-20 mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </span>
                <h3 className="text-3xl sm:text-4xl mb-6">
                  GLÜCKWUNSCH!
                </h3>
                <div className="text-2xl font-bold text-ergo-red mb-4">
                  Sie haben bis zu {totalSavings}€ pro Jahr gesichert!
                </div>
                <p className="text-ergo-stone text-lg mb-8">
                  Morino Stübe wird sich binnen 24 Stunden bei Ihnen melden und Ihre Ersparnisse finalisieren.
                </p>

                <div className="ergo-card p-6 sm:p-8 mb-8 text-left">
                  <h4 className="text-xl mb-6">Ihre nächsten Schritte:</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-ergo-red text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">1</div>
                      <span className="text-base sm:text-lg font-medium text-ergo-ink">Kostenlose Analyse Ihrer bestehenden Verträge</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-ergo-red text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">2</div>
                      <span className="text-base sm:text-lg font-medium text-ergo-ink">Persönliche Beratung zu ERGO-Produkten</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-ergo-red text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">3</div>
                      <span className="text-base sm:text-lg font-medium text-ergo-ink">Angebot mit bis zu {totalSavings}€ Ersparnis pro Jahr</span>
                    </div>
                  </div>
                </div>

                <div className="bg-ergo-gray border border-ergo-line rounded-lg p-6">
                  <p className="text-ergo-ink text-lg mb-4 font-bold">Fragen? Kontaktieren Sie uns:</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <a
                      href="tel:015566771019"
                      className="ergo-btn ergo-btn--secondary"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="truncate">015566771019</span>
                    </a>
                    <a
                      href="https://wa.me/4915566771019?text=Hallo! Ich habe mich für die ERGO-Versicherungsanalyse angemeldet und möchte meine Ersparnisse besprechen."
                      target="_blank"
                      className="ergo-btn ergo-btn--whatsapp"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp Beratung
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* NAVIGATION */}
          {currentStep < 4 && (
            <div className="bg-ergo-gray px-4 sm:px-8 py-6 sm:py-8 border-t border-ergo-line">
              <div className="flex flex-col gap-3 sm:gap-4 items-stretch sm:items-center justify-center max-w-xs sm:max-w-md mx-auto px-2">

                <button
                  type="button"
                  onClick={() => {
                    nextStep();
                    // Haptisches Feedback für mobile
                    if (navigator.vibrate) navigator.vibrate(100);
                  }}
                  disabled={!validateCurrentStep() || submitMutation.isPending}
                  className="ergo-btn ergo-btn--primary w-full"
                >
                  {submitMutation.isPending ? (
                    "WIRD GESICHERT..."
                  ) : currentStep === 3 ? (
                    <span className="block">
                      <span className="hidden sm:inline">JETZT bis zu {totalSavings}€ SPAREN & ANGEBOT SICHERN!</span>
                      <span className="sm:hidden">{totalSavings}€ SPAREN!</span>
                    </span>
                  ) : currentStep === 1 ? (
                    <span className="block">
                      <span className="hidden sm:inline">ZU DEN VERSICHERUNGEN</span>
                      <span className="sm:hidden">WEITER</span>
                    </span>
                  ) : (
                    <span className="block">
                      <span className="hidden sm:inline">KONTAKTDATEN EINGEBEN ({totalSavings}€ Ersparnis!)</span>
                      <span className="sm:hidden">KONTAKT EINGEBEN</span>
                    </span>
                  )}
                </button>

                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="ergo-btn ergo-btn--tertiary ergo-btn--sm w-full order-last sm:order-first"
                  >
                    Zurück
                  </button>
                )}
              </div>

              {/* TRUST-ZEILE */}
              <div className="text-center mt-4 sm:mt-6">
                <div className="text-sm text-ergo-stone font-medium">
                  Antwort innerhalb von 24 Stunden
                </div>
                <div className="text-xs text-ergo-mute mt-1 sm:mt-2 flex items-center justify-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1"><Lock className="w-3 h-3" /> SSL-verschlüsselt</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" /> DSGVO-konform</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> Kostenlose Beratung</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* INFORMATIONEN UNTER DEM FUNNEL */}
        <div className="text-center mt-8 mb-8">
          <p className="ergo-eyebrow">ERGO Versicherungsberatung - Morino Stübe, Ganderkesee</p>

          <h1 className="text-[30px] md:text-[40px] mb-4 sm:mb-6 leading-tight px-2">
            Kostenlose Versicherungsberatung<br/>
            <span className="text-ergo-red">& unverbindliche Analyse</span>
          </h1>

          {/* VALUE PROPOSITION */}
          <div className="ergo-card p-4 sm:p-8 mb-4 sm:mb-8 mx-1 sm:mx-0">
            <ul className="ergo-check-list inline-block text-left text-base sm:text-lg text-ergo-ink font-medium mb-4 sm:mb-6">
              <li>Kostenlose Beratung und Analyse Ihrer bestehenden Verträge</li>
              <li>Unverbindliches Angebot für ERGO-Versicherungen</li>
              <li>Kompetente Beratung von Ihrem zertifizierten ERGO-Berater</li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="bg-ergo-gray rounded-lg p-4 sm:p-6">
                <span className="ergo-icon-disc mx-auto mb-2 sm:mb-3">
                  <Shield className="w-5 h-5" />
                </span>
                <div className="text-base sm:text-lg font-sans font-bold text-ergo-ink">Kostenlos</div>
                <div className="text-sm sm:text-base text-ergo-stone">Beratung & Analyse</div>
              </div>
              <div className="bg-ergo-gray rounded-lg p-4 sm:p-6">
                <span className="ergo-icon-disc mx-auto mb-2 sm:mb-3">
                  <Star className="w-5 h-5" />
                </span>
                <div className="text-base sm:text-lg font-sans font-bold text-ergo-ink">Unverbindlich</div>
                <div className="text-sm sm:text-base text-ergo-stone">Keine Verpflichtungen</div>
              </div>
              <div className="bg-ergo-gray rounded-lg p-4 sm:p-6">
                <span className="ergo-icon-disc mx-auto mb-2 sm:mb-3">
                  <Phone className="w-5 h-5" />
                </span>
                <div className="text-base sm:text-lg font-sans font-bold text-ergo-ink">Persönlich</div>
                <div className="text-sm sm:text-base text-ergo-stone">Vor Ort Beratung</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
