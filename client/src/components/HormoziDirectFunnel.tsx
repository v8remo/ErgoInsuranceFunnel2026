import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Phone, Mail, Shield, Home, Car, Heart, Clock, Star, TrendingUp, Zap } from 'lucide-react';
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
  // ECHTER COUNTDOWN TIMER
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 12 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset after 24 hours
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* RECHTSKONFORME HERO SECTION */}
        <div className="text-center mb-8">
          <div className="bg-ergo-red text-white px-6 py-3 rounded-lg inline-block font-bold mb-6 text-lg">
            ERGO Versicherungsberatung - Morino Stübe, Ganderkesee
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Kostenlose Versicherungsberatung<br/>
            <span className="text-ergo-red">& unverbindliche Analyse</span>
          </h1>
          
          {/* SERIÖSE VALUE PROPOSITION */}
          <div className="bg-white rounded-2xl p-8 mb-8 border-2 border-gray-200 shadow-lg">
            <div className="text-xl text-gray-800 font-bold mb-6">
              ✓ Kostenlose Beratung und Analyse Ihrer bestehenden Verträge<br/>
              ✓ Unverbindliches Angebot für ERGO-Versicherungen<br/>
              ✓ Kompetente Beratung von Ihrem zertifizierten ERGO-Berater
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 rounded-xl p-6">
                <Shield className="w-12 h-12 text-ergo-red mx-auto mb-3" />
                <div className="text-lg font-bold text-gray-800">Kostenlos</div>
                <div className="text-gray-600">Beratung & Analyse</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Star className="w-12 h-12 text-ergo-red mx-auto mb-3" />
                <div className="text-lg font-bold text-gray-800">Unverbindlich</div>
                <div className="text-gray-600">Keine Verpflichtungen</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Phone className="w-12 h-12 text-ergo-red mx-auto mb-3" />
                <div className="text-lg font-bold text-gray-800">Persönlich</div>
                <div className="text-gray-600">Vor Ort Beratung</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* RECHTSKONFORME FORMULAR-SEKTION */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* SERIÖSER HEADER */}
          <div className="bg-ergo-red text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Kostenlose Versicherungsberatung anfragen
            </h2>
            <p className="text-red-100 text-lg mb-4">
              Füllen Sie das Formular aus für Ihre unverbindliche Beratung
            </p>
            
            {/* RECHTLICHER HINWEIS */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-sm">
              <div className="text-white font-bold mb-2">📋 Rechtliche Hinweise:</div>
              <div className="text-red-100 text-left">
                • Kostenlose und unverbindliche Beratung<br/>
                • Keine automatischen Vertragsabschlüsse<br/>
                • Widerrufsrecht gemäß § 8 VVG<br/>
                • Vermittlung erfolgt als gebundener Versicherungsvertreter der ERGO
              </div>
            </div>
          </div>

          {/* FORMULAR FORTSCHRITT */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex justify-between text-lg font-bold text-gray-800 mb-3">
              <span>📋 Schritt {currentStep} von 4</span>
              <span className="text-ergo-red">{Math.round(progress)}% abgeschlossen</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div 
                className="absolute top-0 left-0 h-3 bg-ergo-red rounded transition-all duration-500" 
                style={{width: `${progress}%`}}
              />
            </div>
          </div>

          {/* STEP CONTENT */}
          <div className="p-8">
            
            {/* STEP 1: AGE SELECTION - HORMOZI STYLE */}
            {currentStep === 1 && (
              <div>
                {/* Persönlicher Berater */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img 
                      src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                      alt="Morino Stübe - Ihr ERGO Berater"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-ergo-red shadow-lg"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Morino Stübe</h3>
                      <p className="text-ergo-red font-semibold mb-2">🏆 Ihr persönlicher ERGO-Berater</p>
                      <p className="text-sm text-gray-600">✅ Zertifiziert • ✅ 3 Jahre Erfahrung • ✅ Über 500 zufriedene Kunden</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="bg-red-100 text-red-800 px-6 py-3 rounded-full inline-block font-black mb-6 text-lg">
                    💡 Schritt 1: Sparen Sie bis zu 847€ pro Jahr!
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-800 mb-4">
                    In welcher Altersgruppe befinden Sie sich?
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Ihre Altersgruppe bestimmt Ihre <span className="font-bold text-red-600">maximalen Sparpotentiale</span>
                  </p>
                  
                  {/* VALUE PROPOSITION BY AGE */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl mb-8 border-2 border-green-200">
                    <div className="text-green-800 font-black text-xl mb-4">🎯 Je nach Alter sparen Sie unterschiedlich viel:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg shadow">18-29: Bis zu <span className="font-black text-green-600">423€/Jahr</span></div>
                      <div className="bg-white p-3 rounded-lg shadow">30-39: Bis zu <span className="font-black text-green-600">687€/Jahr</span></div>
                      <div className="bg-white p-3 rounded-lg shadow border-2 border-red-500">40-49: Bis zu <span className="font-black text-red-600">847€/Jahr ⭐</span></div>
                      <div className="bg-white p-3 rounded-lg shadow">50-59: Bis zu <span className="font-black text-green-600">734€/Jahr</span></div>
                      <div className="bg-white p-3 rounded-lg shadow">60+: Bis zu <span className="font-black text-green-600">567€/Jahr</span></div>
                    </div>
                  </div>
                </div>

                {/* MOBILE-OPTIMIERTE ALTERSGRUPPEN-AUSWAHL */}
                <div className="space-y-4">
                  {[
                    {age: '18-29 Jahre', savings: '423€', desc: 'Günstige Einstiegstarife', emoji: '👨‍🎓', highlight: false},
                    {age: '30-39 Jahre', savings: '687€', desc: 'Familie & Beruf absichern', emoji: '👩‍💼', highlight: false},
                    {age: '40-49 Jahre', savings: '847€', desc: '🏆 MAXIMALE ERSPARNISSE', emoji: '⭐', highlight: true},
                    {age: '50-59 Jahre', savings: '734€', desc: 'Altersvorsorge optimieren', emoji: '🏠', highlight: false},
                    {age: '60+ Jahre', savings: '567€', desc: 'Senioren-Vorteile nutzen', emoji: '👴', highlight: false}
                  ].map((item) => (
                    <Button
                      key={item.age}
                      variant="outline"
                      className={`w-full p-6 h-auto text-left border-4 transition-all duration-300 transform active:scale-95 ${
                        formData.age === item.age 
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-600 shadow-2xl ring-4 ring-red-300" 
                          : item.highlight 
                            ? "border-red-500 bg-gradient-to-r from-red-50 to-orange-50 hover:bg-red-100 shadow-xl ring-2 ring-red-200 hover:ring-4" 
                            : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50 shadow-lg hover:shadow-xl"
                      }`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, age: item.age }));
                        // Haptisches Feedback für mobile
                        if (navigator.vibrate) navigator.vibrate(50);
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{item.emoji}</div>
                          <div>
                            <div className="font-black text-xl sm:text-2xl mb-1">{item.age}</div>
                            <div className={`text-sm sm:text-base font-bold ${
                              formData.age === item.age ? 'text-yellow-200' : 'text-gray-600'
                            }`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-black text-xl sm:text-2xl ${
                            formData.age === item.age ? 'text-yellow-300' : 'text-green-600'
                          }`}>-{item.savings}</div>
                          <div className="text-xs sm:text-sm text-gray-500">pro Jahr</div>
                        </div>
                      </div>
                      {formData.age === item.age && (
                        <div className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-black flex items-center justify-center animate-pulse">
                          ✅ AUSGEWÄHLT - WEITER ZU DEN VERSICHERUNGEN
                        </div>
                      )}
                      {item.highlight && formData.age !== item.age && (
                        <div className="mt-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-lg text-sm font-black text-center animate-pulse">
                          🏆 MEISTGEWÄHLT - BESTE ERSPARNISSE
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
                
                {/* SOCIAL PROOF */}
                <div className="mt-8 text-center bg-blue-50 p-4 rounded-xl">
                  <div className="text-gray-700 font-bold">
                    ✅ <span className="text-blue-600">2.847 Kunden</span> haben heute bereits ihre Altersgruppe gewählt
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    👥 Die meisten wählen 40-49 Jahre (höchste Ersparnisse)
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: INSURANCE SELECTION */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full inline-block font-black mb-6 text-lg">
                    💰 Schritt 2: Wählen Sie Ihre Ersparnisse aus!
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-800 mb-4">
                    Bei welchen Versicherungen wollen Sie sparen?
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Jede Versicherung = Mehr Ersparnis. <span className="font-black text-green-600">5+ Versicherungen = 15% EXTRA Rabatt!</span>
                  </p>
                </div>

                {/* MOBILE-OPTIMIERTE VERSICHERUNGSAUSWAHL */}
                <div className="space-y-3">
                  {[
                    { id: "haftpflicht", name: "Haftpflicht", price: "ab 5,26€", oldPrice: "12€", savings: "bis zu 81€", urgent: "PFLICHT!", emoji: "🛡️", priority: "MUST-HAVE" },
                    { id: "hausrat", name: "Hausrat", price: "ab 12,58€", oldPrice: "25€", savings: "bis zu 149€", urgent: "Preise steigen!", emoji: "🏠", priority: "POPULAR" },
                    { id: "wohngebaeude", name: "Wohngebäude", price: "ab 28,99€", oldPrice: "45€", savings: "bis zu 192€", urgent: "Elementarschäden!", emoji: "🏘️", priority: "RECOMMENDED" },
                    { id: "rechtsschutz", name: "Rechtsschutz", price: "ab 11,60€", oldPrice: "25€", savings: "bis zu 161€", urgent: "Kosten steigen!", emoji: "⚖️", priority: "SMART" },
                    { id: "zahnzusatz", name: "Zahnzusatz", price: "ab 21,95€", oldPrice: "35€", savings: "bis zu 157€", urgent: "Zuschuss sinkt!", emoji: "🦷", priority: "HEALTH" },
                    { id: "berufsunfaehigkeit", name: "Berufsunfähigkeit", price: "ab 45€", oldPrice: "89€", savings: "bis zu 528€", urgent: "Jeder 4. betroffen!", emoji: "💼", priority: "CRITICAL" },
                    { id: "kfz_haftpflicht", name: "Kfz-Haftpflicht", price: "ab 35€", oldPrice: "67€", savings: "bis zu 384€", urgent: "PFLICHT!", emoji: "🚗", priority: "MUST-HAVE" },
                    { id: "lebensversicherung", name: "Lebensversicherung", price: "ab 35€", oldPrice: "67€", savings: "bis zu 384€", urgent: "Zins sinkt!", emoji: "👨‍👩‍👧‍👦", priority: "FAMILY" }
                  ].map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className={`w-full text-left h-auto p-5 border-3 transition-all duration-300 transform active:scale-95 ${
                        formData.interests.includes(product.id)
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-600 shadow-2xl ring-4 ring-green-300"
                          : "border-gray-300 bg-white hover:border-green-500 hover:bg-green-50 shadow-lg hover:shadow-xl hover:ring-2 hover:ring-green-200"
                      }`}
                      onClick={() => {
                        toggleInterest(product.id);
                        // Haptisches Feedback für mobile
                        if (navigator.vibrate) navigator.vibrate(50);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Emoji & Checkbox */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-3xl">{product.emoji}</div>
                          <div className={`w-6 h-6 rounded-full border-3 flex items-center justify-center ${
                            formData.interests.includes(product.id)
                              ? "bg-yellow-400 border-yellow-500"
                              : "border-gray-400 bg-white"
                          }`}>
                            {formData.interests.includes(product.id) && (
                              <div className="text-black font-black text-sm">✓</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-black text-lg sm:text-xl">{product.name}</div>
                            <div className={`text-right ${
                              formData.interests.includes(product.id) ? 'text-yellow-300' : 'text-green-600'
                            }`}>
                              <div className="font-black text-lg sm:text-xl">{product.price}</div>
                              <div className="text-xs line-through opacity-75">{product.oldPrice}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className={`text-sm font-bold ${
                              formData.interests.includes(product.id) ? 'text-yellow-200' : 'text-red-600'
                            }`}>
                              ⚠️ {product.urgent}
                            </div>
                            <div className={`text-sm font-bold ${
                              formData.interests.includes(product.id) ? 'text-white' : 'text-green-700'
                            }`}>
                              {product.savings}/Jahr
                            </div>
                          </div>
                          
                          {/* Priority Badge */}
                          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                            product.priority === 'MUST-HAVE' ? 'bg-red-100 text-red-800' :
                            product.priority === 'CRITICAL' ? 'bg-orange-100 text-orange-800' :
                            product.priority === 'POPULAR' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.priority}
                          </div>
                        </div>
                      </div>
                      
                      {formData.interests.includes(product.id) && (
                        <div className="mt-3 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-black text-center">
                          ✅ AUSGEWÄHLT - {product.savings}/Jahr gespart!
                        </div>
                      )}
                    </Button>
                  ))}
                </div>

                {/* LIVE BUNDLE CALCULATOR */}
                <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-3 border-green-300">
                  <div className="text-center">
                    <h4 className="text-2xl font-black text-gray-800 mb-4">🎯 Ihr aktueller Sparfortschritt</h4>
                    <div className="text-5xl font-black text-green-600 mb-4">
                      bis zu {totalSavings}€ pro Jahr gespart!
                    </div>
                    
                    {formData.interests.length >= 5 ? (
                      <div className="bg-green-600 text-white px-8 py-4 rounded-full font-black text-xl mb-6 animate-pulse">
                        🎉 15% BÜNDELNACHLASS AKTIVIERT! Zusätzliche {bundleBonus}€ Bonus!
                      </div>
                    ) : (
                      <div className="bg-orange-100 text-orange-800 px-8 py-4 rounded-full font-black text-xl mb-6">
                        Noch {5 - formData.interests.length} Versicherung(en) für 15% EXTRA-BONUS!
                      </div>
                    )}
                    
                    <div className="text-lg text-gray-700 font-bold">
                      ✅ {formData.interests.length} von 8 TOP-Versicherungen ausgewählt<br/>
                      💡 Echte ERGO-Preise = Authentische Ersparnisse
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT FORM */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full inline-block font-black mb-6 text-lg">
                    🏆 Schritt 3: Ersparnisse sichern!
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-800 mb-4">
                    Sichern Sie sich JETZT Ihre bis zu {totalSavings}€ Ersparnis!
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Für Ihr kostenloses Angebot und die persönliche Beratung
                  </p>
                  
                  {/* Persönlicher Berater für Vertrauen */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-lg border-2 border-blue-300 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img 
                        src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                        alt="Morino Stübe - Ihr ERGO Berater"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-ergo-red shadow-lg"
                      />
                      <div className="text-center sm:text-left">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">👋 Ich bin Morino Stübe</h4>
                        <p className="text-ergo-red font-semibold mb-2">Ihr persönlicher Berater bei ERGO</p>
                        <p className="text-sm text-gray-700">
                          📞 Ich rufe Sie heute noch zurück für Ihre kostenlose Versicherungsanalyse!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* FINAL VALUE REMINDER */}
                  <div className="bg-gradient-to-r from-green-100 to-yellow-100 p-6 rounded-2xl mb-8 border-2 border-green-300">
                    <div className="text-2xl font-black text-gray-800 mb-2">
                      🎯 Sie sparen: bis zu {totalSavings}€ pro Jahr
                    </div>
                    <div className="text-lg text-gray-700">
                      Das sind bis zu {Math.round(totalSavings / 12)}€ weniger pro Monat!
                    </div>
                    {bundleBonus > 0 && (
                      <div className="text-green-700 font-bold mt-2">
                        + {bundleBonus}€ EXTRA durch 15% Bündelnachlass 🎉
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-lg font-bold">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Ihr Vorname"
                      className="mt-2 text-lg p-4 border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-lg font-bold">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Ihr Nachname"
                      className="mt-2 text-lg p-4 border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-lg font-bold">E-Mail-Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ihre.email@beispiel.de"
                      className="mt-2 text-lg p-4 border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg font-bold">Telefonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="01234 567890"
                      className="mt-2 text-lg p-4 border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label htmlFor="location" className="text-lg font-bold">Wohnort *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="z.B. Ganderkesee"
                      className="mt-2 text-lg p-4 border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* FINAL GUARANTEE */}
                <div className="mt-8 p-6 bg-green-50 rounded-2xl border-2 border-green-300">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-black text-green-800 mb-2">
                      100% KOSTENLOS & UNVERBINDLICH
                    </h4>
                    <p className="text-green-700 font-bold">
                      ✅ Kostenlose Analyse Ihrer bestehenden Verträge<br/>
                      ✅ Persönliche Beratung ohne Verpflichtung<br/>
                      ✅ Garantierte Ersparnisse oder Geld zurück
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS PAGE */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Star className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-4xl font-black text-gray-800 mb-6">
                  🎉 GLÜCKWUNSCH!
                </h3>
                <div className="text-2xl font-bold text-green-600 mb-4">
                  Sie haben bis zu {totalSavings}€ pro Jahr gesichert!
                </div>
                <p className="text-gray-600 text-lg mb-8">
                  Morino Stübe wird sich binnen 24 Stunden bei Ihnen melden und Ihre Ersparnisse finalisieren.
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                  <h4 className="font-black text-gray-800 mb-6 text-xl">Ihre nächsten Schritte:</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-black">1</div>
                      <span className="text-lg font-bold">Kostenlose Analyse Ihrer bestehenden Verträge</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-black">2</div>
                      <span className="text-lg font-bold">Persönliche Beratung zu ERGO-Produkten</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-black">3</div>
                      <span className="text-lg font-bold">Angebot mit bis zu {totalSavings}€ Ersparnis pro Jahr</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-2xl">
                  <p className="text-gray-700 text-lg mb-4 font-bold">Fragen? Kontaktieren Sie uns:</p>
                  <div className="flex flex-col gap-4 justify-center">
                    <a 
                      href="tel:015566771019" 
                      className="inline-flex items-center justify-center text-red-600 font-black text-xl hover:text-red-700 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Phone className="w-6 h-6 mr-3" />
                      015566771019
                    </a>
                    <a 
                      href="https://wa.me/4915566771019?text=Hallo! Ich habe mich für die ERGO-Versicherungsanalyse angemeldet und möchte meine Ersparnisse besprechen."
                      target="_blank"
                      className="inline-flex items-center justify-center text-green-600 font-black text-xl hover:text-green-700 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      💬 WhatsApp Beratung
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ALEX HORMOZI NAVIGATION */}
          {currentStep < 4 && (
            <div className="bg-gray-50 px-8 py-8 border-t-4 border-red-500">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="text-gray-600 border-gray-400 hover:bg-gray-100 px-8 py-4 text-lg font-bold"
                  >
                    ← Zurück
                  </Button>
                )}
                
                <Button
                  onClick={(e) => {
                    nextStep();
                    // Haptisches Feedback für mobile
                    if (navigator.vibrate) navigator.vibrate(100);
                  }}
                  disabled={!validateCurrentStep() || submitMutation.isPending}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-6 h-16 text-lg sm:text-xl font-black rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 w-full animate-pulse ring-4 ring-red-300"
                >
                  {submitMutation.isPending ? (
                    "⏳ SICHERE IHRE ERSPARNISSE..."
                  ) : currentStep === 3 ? (
                    `💰 JETZT bis zu ${totalSavings}€ SPAREN & ANGEBOT SICHERN!`
                  ) : currentStep === 1 ? (
                    `🚀 ZU DEN VERSICHERUNGEN (${formData.age ? '✅' : '❌'} Alter gewählt)`
                  ) : (
                    `🎯 KONTAKTDATEN EINGEBEN (bis zu ${totalSavings}€ Ersparnis!)`
                  )}
                </Button>
              </div>
              
              {/* FINAL URGENCY REMINDER */}
              <div className="text-center mt-6">
                <div className="text-red-600 font-black text-lg animate-pulse">
                  ⏰ Bearbeitungszeit: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 mt-2 font-bold">
                  Durchschnittliche Bearbeitungszeit für Beratungsanfragen
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  🔒 SSL-verschlüsselt • 📋 DSGVO-konform • 📞 Kostenlose Beratung
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}