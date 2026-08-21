import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Phone, Mail, Shield, Home, Car, Heart, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackEvent } from '@/lib/analytics';

interface GeneralInsuranceFunnelProps {
  onClose: () => void;
  directAccess?: boolean;
}

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

const insuranceCategories = {
  sach: {
    title: "Sachversicherungen",
    icon: Home,
    products: [
      { id: "hausrat", name: "Hausratversicherung", description: "Schutz für Ihr Hab und Gut" },
      { id: "haftpflicht", name: "Haftpflichtversicherung", description: "Absicherung gegen Schadensersatzansprüche" },
      { id: "wohngebaeude", name: "Wohngebäudeversicherung", description: "Schutz für Ihr Eigenheim" },
      { id: "rechtsschutz", name: "Rechtsschutzversicherung", description: "Rechtliche Absicherung" },
      { id: "fahrrad", name: "Fahrradversicherung", description: "Schutz für Ihr Fahrrad" },
      { id: "reise", name: "Reiseversicherung", description: "Sicher unterwegs" }
    ]
  },
  leben: {
    title: "Lebensversicherungen",
    icon: Heart,
    products: [
      { id: "berufsunfaehigkeit", name: "Berufsunfähigkeitsversicherung", description: "Einkommensschutz bei Berufsunfähigkeit" },
      { id: "lebensversicherung", name: "Lebensversicherung", description: "Vorsorge für die Familie" },
      { id: "risikolebensversicherung", name: "Risikolebensversicherung", description: "Absicherung der Hinterbliebenen" },
      { id: "rentenversicherung", name: "Private Rentenversicherung", description: "Zusätzliche Altersvorsorge" },
      { id: "unfallversicherung", name: "Unfallversicherung", description: "Schutz bei Unfällen" },
      { id: "krankenversicherung", name: "Private Krankenversicherung", description: "Gesundheitsvorsorge" },
      { id: "zahnzusatz", name: "Zahnzusatzversicherung", description: "Zusätzlicher Zahnschutz" }
    ]
  },
  kraftfahrt: {
    title: "Kraftfahrtversicherungen",
    icon: Car,
    products: [
      { id: "kfz_haftpflicht", name: "Kfz-Haftpflichtversicherung", description: "Gesetzlich vorgeschrieben" },
      { id: "vollkasko", name: "Vollkaskoversicherung", description: "Umfassender Schutz" },
      { id: "teilkasko", name: "Teilkaskoversicherung", description: "Basis-Schutz für Ihr Fahrzeug" },
      { id: "motorrad", name: "Motorradversicherung", description: "Schutz für Zweiräder" },
      { id: "wohnmobil", name: "Wohnmobilversicherung", description: "Schutz für Reisemobile" }
    ]
  }
};

export default function GeneralInsuranceFunnel({ onClose, directAccess = false }: GeneralInsuranceFunnelProps) {
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
          source: 'general_funnel'
        })
      });
      if (!response.ok) throw new Error('Failed to submit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setCurrentStep(4);
      trackEvent('general_lead_generated', {
        interests: formData.interests,
        existing_insurances: formData.existingInsurances,
        age_group: formData.age,
        source: 'general_funnel'
      });
    }
  });

  const progress = (currentStep / 4) * 100;

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      trackEvent('general_funnel_step_completed', { step: currentStep });
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

  const toggleExistingInsurance = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      existingInsurances: prev.existingInsurances.includes(productId)
        ? prev.existingInsurances.filter(id => id !== productId)
        : [...prev.existingInsurances, productId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-ergo-dark/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-[0_8px_24px_rgba(38,38,38,0.14)] max-w-2xl w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 border-b border-ergo-line">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl leading-tight">ERGO Versicherungsberatung</h2>
              <p className="text-sm sm:text-base text-ergo-stone mt-1">Kostenlose Analyse & 15% Bündelnachlass</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Schließen"
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-ergo-mute hover:bg-ergo-fog transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-ergo-mute mb-2">
              <span>Schritt {currentStep} von 4</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">

          {/* Step 1: Age Selection */}
          {currentStep === 1 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Wie alt sind Sie?
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  Ihr Alter hilft uns, die passenden ERGO-Produkte für Sie zu finden
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {['18-29 Jahre', '30-39 Jahre', '40-49 Jahre', '50-59 Jahre', '60+ Jahre'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`ergo-option p-4 text-left ${formData.age === age ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, age }))}
                  >
                    <div>
                      <div className={`font-semibold ${formData.age === age ? 'text-ergo-red' : 'text-ergo-ink'}`}>{age}</div>
                      <div className="text-xs mt-1 text-ergo-mute">
                        {age === '18-29 Jahre' && 'Günstige Einstiegstarife'}
                        {age === '30-39 Jahre' && 'Familie & Beruf absichern'}
                        {age === '40-49 Jahre' && 'Optimaler Schutz'}
                        {age === '50-59 Jahre' && 'Altersvorsorge wichtig'}
                        {age === '60+ Jahre' && 'Spezielle Senioren-Tarife'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Insurance Interest Selection */}
          {currentStep === 2 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <Shield className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Welche Versicherungen interessieren Sie?
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  Wählen Sie alle ERGO-Produkte aus, für die Sie sich interessieren
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(insuranceCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="ergo-card p-4">
                    <div className="flex items-center mb-4">
                      <category.icon className="w-5 h-5 text-ergo-red mr-2" />
                      <h4 className="font-sans font-bold text-ergo-ink">{category.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.products.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className={`ergo-option text-left p-3 ${formData.interests.includes(product.id) ? 'selected' : ''}`}
                          onClick={() => toggleInterest(product.id)}
                        >
                          <div>
                            <div className={`font-medium text-sm ${formData.interests.includes(product.id) ? 'text-ergo-red' : 'text-ergo-ink'}`}>{product.name}</div>
                            <div className="text-xs text-ergo-mute mt-1">{product.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-ergo-red-light border border-ergo-line rounded-lg">
                <p className="text-sm text-ergo-ink">
                  <strong className="text-ergo-red">15% Bündelnachlass:</strong> Bei 5 oder mehr ERGO-Versicherungen erhalten Sie automatisch 15% Rabatt!
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <Mail className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Ihre Kontaktdaten
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  Für Ihr kostenloses Angebot und die persönliche Beratung
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold text-ergo-ink">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Ihr Vorname"
                      className="mt-1 border border-ergo-line rounded"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold text-ergo-ink">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Ihr Nachname"
                      className="mt-1 border border-ergo-line rounded"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-ergo-ink">E-Mail-Adresse *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ihre.email@beispiel.de"
                    className="mt-1 border border-ergo-line rounded"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-ergo-ink">Telefonnummer *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="01234 567890"
                    className="mt-1 border border-ergo-line rounded"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-semibold text-ergo-ink">Wohnort *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="z.B. Ganderkesee"
                    className="mt-1 border border-ergo-line rounded"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-ergo-gray border border-ergo-line rounded-lg">
                <p className="text-sm text-ergo-ink">
                  <strong>Kostenlos & unverbindlich:</strong> Sie erhalten eine kostenlose Analyse Ihrer bestehenden Verträge plus Optimierungsvorschläge.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-ergo-check mx-auto mb-6" />
              <h3 className="text-xl mb-4">
                Vielen Dank für Ihr Interesse!
              </h3>
              <p className="text-ergo-stone mb-6">
                Ihre Anfrage wurde erfolgreich übermittelt. Morino Stübe wird sich binnen 24 Stunden bei Ihnen melden.
              </p>

              <div className="ergo-card p-6 mb-6">
                <h4 className="font-sans font-bold text-ergo-ink mb-4">Ihre nächsten Schritte:</h4>
                <div className="text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
                    <span className="text-sm text-ergo-ink">Kostenlose Analyse Ihrer bestehenden Verträge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
                    <span className="text-sm text-ergo-ink">Persönliche Beratung zu ERGO-Produkten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
                    <span className="text-sm text-ergo-ink">Angebot mit 15% Bündelnachlass (ab 5 Versicherungen)</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-ergo-stone mb-4">Haben Sie Fragen? Rufen Sie uns gerne an:</p>
                <a
                  href="tel:015566771019"
                  className="inline-flex items-center text-ergo-red font-bold text-lg hover:text-ergo-red-hover"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  015566771019
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center p-4 sm:p-6 border-t border-ergo-line bg-ergo-gray rounded-b-lg gap-3 sm:gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="order-2 sm:order-1 inline-flex items-center justify-center gap-1 text-sm sm:text-base font-semibold text-ergo-stone hover:text-ergo-ink px-4 py-3 sm:px-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Zurück
              </button>
            )}

            <button
              type="button"
              onClick={nextStep}
              disabled={!validateCurrentStep() || submitMutation.isPending}
              className="ergo-btn ergo-btn--primary order-1 sm:order-2 w-full sm:w-auto"
            >
              {submitMutation.isPending ? (
                "Wird übermittelt..."
              ) : currentStep === 3 ? (
                "KOSTENLOSE BERATUNG ANFORDERN"
              ) : (
                `Weiter (${currentStep + 1}/4)`
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
