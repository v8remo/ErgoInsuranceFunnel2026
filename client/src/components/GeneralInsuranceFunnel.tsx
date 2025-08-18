import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { X, Phone, Mail, Shield, Home, Car, Heart, Gavel, Smile } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { trackEvent } from '@/lib/analytics';

interface GeneralInsuranceFunnelProps {
  onClose: () => void;
}

interface FormData {
  age: string;
  interests: string[];
  existingInsurances: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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

export default function GeneralInsuranceFunnel({ onClose }: GeneralInsuranceFunnelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    interests: [],
    existingInsurances: [],
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
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
          insuranceType: 'general_consultation',
          age: data.age,
          interests: data.interests,
          existingInsurances: data.existingInsurances,
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
        return formData.firstName && formData.lastName && formData.email && formData.phone;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-ergo-gray px-4 sm:px-6 py-4 sm:py-5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-ergo-dark leading-tight">ERGO Versicherungsberatung</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Kostenlose Analyse & 15% Bündelnachlass</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0 p-2">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2">
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
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-ergo-red mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Wie alt sind Sie?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Ihr Alter hilft uns, die passenden ERGO-Produkte für Sie zu finden
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {['18-29 Jahre', '30-39 Jahre', '40-49 Jahre', '50-59 Jahre', '60+ Jahre'].map((age) => (
                  <Button
                    key={age}
                    variant={formData.age === age ? "default" : "outline"}
                    className={`p-4 h-auto text-left ${
                      formData.age === age 
                        ? "bg-ergo-red text-white" 
                        : "border-gray-300 hover:border-ergo-red hover:text-ergo-red"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, age }))}
                  >
                    <div>
                      <div className="font-semibold">{age}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {age === '18-29 Jahre' && 'Günstige Einstiegstarife'}
                        {age === '30-39 Jahre' && 'Familie & Beruf absichern'}
                        {age === '40-49 Jahre' && 'Optimaler Schutz'}
                        {age === '50-59 Jahre' && 'Altersvorsorge wichtig'}
                        {age === '60+ Jahre' && 'Spezielle Senioren-Tarife'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Insurance Interest Selection */}
          {currentStep === 2 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-ergo-red mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Welche Versicherungen interessieren Sie?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Wählen Sie alle ERGO-Produkte aus, für die Sie sich interessieren
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(insuranceCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="border rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <category.icon className="w-5 h-5 text-ergo-red mr-2" />
                      <h4 className="font-semibold text-ergo-dark">{category.title}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.products.map((product) => (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          className={`text-left h-auto p-3 ${
                            formData.interests.includes(product.id)
                              ? "bg-ergo-red text-white border-ergo-red"
                              : "border-gray-300 hover:border-ergo-red hover:text-ergo-red"
                          }`}
                          onClick={() => toggleInterest(product.id)}
                        >
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs opacity-75 mt-1">{product.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>15% Bündelnachlass:</strong> Bei 5 oder mehr ERGO-Versicherungen erhalten Sie automatisch 15% Rabatt!
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-ergo-red mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Ihre Kontaktdaten
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Für Ihr kostenloses Angebot und die persönliche Beratung
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Vorname *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Ihr Vorname"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nachname *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Ihr Nachname"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-Mail-Adresse *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ihre.email@beispiel.de"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefonnummer *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="01234 567890"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Kostenlos & unverbindlich:</strong> Sie erhalten eine kostenlose Analyse Ihrer bestehenden Verträge plus Optimierungsvorschläge.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smile className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-ergo-dark mb-4">
                Vielen Dank für Ihr Interesse!
              </h3>
              <p className="text-gray-600 mb-6">
                Ihre Anfrage wurde erfolgreich übermittelt. Morino Stübe wird sich binnen 24 Stunden bei Ihnen melden.
              </p>
              
              <div className="bg-ergo-gray rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-ergo-dark mb-4">Ihre nächsten Schritte:</h4>
                <div className="text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-sm">Kostenlose Analyse Ihrer bestehenden Verträge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-sm">Persönliche Beratung zu ERGO-Produkten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-ergo-red text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-sm">Angebot mit 15% Bündelnachlass (ab 5 Versicherungen)</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Haben Sie Fragen? Rufen Sie uns gerne an:</p>
                <a 
                  href="tel:015566771019" 
                  className="inline-flex items-center text-ergo-red font-semibold text-lg hover:text-red-700"
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
          <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg sm:rounded-b-xl gap-3 sm:gap-4">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="order-2 sm:order-1 text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4"
              >
                ← Zurück
              </Button>
            )}
            
            <Button
              onClick={nextStep}
              disabled={!validateCurrentStep() || submitMutation.isPending}
              className="order-1 sm:order-2 bg-ergo-red hover:bg-ergo-red-hover text-white text-sm sm:text-base px-4 py-3 sm:px-6 sm:py-4 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              {submitMutation.isPending ? (
                "⏳ Wird übermittelt..."
              ) : currentStep === 3 ? (
                "💰 KOSTENLOSE BERATUNG ANFORDERN"
              ) : (
                `Weiter (${currentStep + 1}/4)`
              )}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}