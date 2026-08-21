import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent, getLeadValue } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";
import { X, CheckCircle, Phone, Clock, Calculator, Handshake, Shield, Check, ChevronLeft } from "lucide-react";
import type { InsertLead } from "@shared/schema";
import morinoImage from "@assets/optimized/morino_small.webp";

interface InsuranceFunnelProps {
  insuranceType: string;
  onClose: () => void;
}

interface FormData {
  age: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specificData: Record<string, any>;
}

export default function InsuranceFunnel({ insuranceType, onClose }: InsuranceFunnelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    specificData: {}
  });
  const { toast } = useToast();

  const insurance = insuranceConfig[insuranceType as keyof typeof insuranceConfig];

  // Submit lead mutation
  const submitMutation = useMutation({
    mutationFn: async (leadData: InsertLead) => {
      if (import.meta.env.DEV) console.log("Submitting lead data:", leadData);
      const response = await apiRequest("POST", "/api/leads", leadData);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (import.meta.env.DEV) console.log("Lead successfully created:", data);
      trackEvent("lead_generated", {
        insurance_type: insuranceType,
        lead_value: getLeadValue(insuranceType)
      });
      setCurrentStep(4);

      toast({
        title: "Anfrage erfolgreich übermittelt!",
        description: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      });

      // Auto close after 8 seconds
      setTimeout(() => {
        onClose();
      }, 8000);
    },
    onError: (error) => {
      if (import.meta.env.DEV) console.error("Lead submission error:", error);
      toast({
        title: "Fehler beim Senden",
        description: "Ihre Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  });

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep === 1) {
        // Check if this insurance has questions, if not skip to step 3
        if (insurance?.questions && insurance.questions.length > 0) {
          setCurrentStep(2);
        } else {
          setCurrentStep(3);
        }
        trackEvent("funnel_step_completed", {
          insurance_type: insuranceType,
          step: currentStep
        });
      } else if (currentStep === 2) {
        setCurrentStep(3);
        trackEvent("funnel_step_completed", {
          insurance_type: insuranceType,
          step: currentStep
        });
      } else if (currentStep === 3) {
        // Submit the form after step 3 (contact information)
        submitForm();
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 3) {
      // Check if previous step should be 2 or 1
      if (insurance?.questions && insurance.questions.length > 0) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.age !== "";
      case 2:
        if (!insurance?.questions || insurance.questions.length === 0) return true;
        return insurance.questions.every(question => {
          const value = formData.specificData[question.name];
          return value !== undefined && value !== "" && value !== null;
        });
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.location;
      default:
        return true;
    }
  };

  const submitForm = () => {
    if (import.meta.env.DEV) console.log("submitForm called with formData:", formData);

    const leadData: InsertLead = {
      insuranceType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      age: formData.age,
      specificData: formData.specificData,
      status: "new",
      source: "website_funnel"
    };

    if (import.meta.env.DEV) console.log("About to submit leadData:", leadData);
    submitMutation.mutate(leadData);
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateSpecificData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specificData: { ...prev.specificData, [key]: value }
    }));
  };

  const progress = (currentStep / 4) * 100;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!insurance) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-ergo-dark/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-[0_8px_24px_rgba(38,38,38,0.14)] max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ergo-line p-4 sm:p-6 rounded-t-lg z-10">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl leading-tight">{insurance.title}</h2>
              <p className="text-sm sm:text-base text-ergo-stone mt-1">Nur noch wenige Schritte zu Ihrem persönlichen Angebot</p>
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
        <div className="p-4 sm:p-6">

          {/* Step 1: Age Selection */}
          {currentStep === 1 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <insurance.icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Wie alt sind Sie? (Bestimmt Ihren Sofort-Rabatt)
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  <strong>Jüngere zahlen weniger!</strong> Ihr Alter bestimmt den Startpreis Ihrer Versicherung
                </p>
              </div>

              <div className="space-y-3">
                {["18-30 Jahre", "31-45 Jahre", "46-60 Jahre", "Über 60 Jahre"].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => updateFormData({ age: age })}
                    className={`ergo-option w-full p-4 text-center font-semibold text-base ${
                      formData.age === age ? 'selected text-ergo-red' : 'text-ergo-ink'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Specific Questions */}
          {currentStep === 2 && insurance.questions && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <insurance.icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Personalisierung für maximale Ersparnis
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  <strong>Ihre Antworten bestimmen Ihren individuellen Preis!</strong> Ehrliche Angaben = niedrigere Beiträge
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {insurance.questions.map((question, index) => (
                  <div key={index}>
                    <h4 className="font-sans font-bold text-base sm:text-lg text-ergo-ink mb-3 sm:mb-4">
                      {question.question}
                    </h4>

                    {question.type === "radio" && (
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateSpecificData(question.name, option)}
                            className={`ergo-option w-full p-4 text-left font-medium text-base ${
                              formData.specificData[question.name] === option ? 'selected text-ergo-red' : 'text-ergo-ink'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {question.type === "select" && (
                      <div className="space-y-3">
                        {question.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateSpecificData(question.name, option)}
                            className={`ergo-option w-full p-4 text-left font-medium text-base ${
                              formData.specificData[question.name] === option ? 'selected text-ergo-red' : 'text-ergo-ink'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {question.type === "checkbox" && (
                      <div className="space-y-3">
                        {question.options.map((option) => {
                          const isSelected = (formData.specificData[question.name] || []).includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                const current = formData.specificData[question.name] || [];
                                const updated = isSelected
                                  ? current.filter((item: string) => item !== option)
                                  : [...current, option];
                                updateSpecificData(question.name, updated);
                              }}
                              className={`ergo-option w-full p-4 text-left font-medium text-base flex items-center ${
                                isSelected ? 'selected text-ergo-red' : 'text-ergo-ink'
                              }`}
                            >
                              <span className={`mr-3 w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'border-ergo-check bg-ergo-check' : 'border-ergo-line bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <span className="ergo-icon-disc mx-auto mb-3 sm:mb-4">
                  <Phone className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl mb-2">
                  Sichern Sie sich Ihr Angebot (Kostenlos & Unverbindlich)
                </h3>
                <p className="text-sm sm:text-base text-ergo-stone">
                  <strong>Garantiert:</strong> Rückmeldung binnen 4 Stunden - auch samstags!
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold text-ergo-ink mb-2 block">Vorname*</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData({ firstName: e.target.value })}
                      placeholder="Ihr Vorname"
                      className="text-base p-4 border border-ergo-line rounded"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold text-ergo-ink mb-2 block">Nachname*</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData({ lastName: e.target.value })}
                      placeholder="Ihr Nachname"
                      className="text-base p-4 border border-ergo-line rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-ergo-ink mb-2 block">E-Mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="ihre@email.de"
                    className="text-base p-4 border border-ergo-line rounded"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-ergo-ink mb-2 block">Telefon*</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    placeholder="0171 1234567"
                    className="text-base p-4 border border-ergo-line rounded"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-semibold text-ergo-ink mb-2 block">PLZ & Ort*</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    placeholder="z.B. 10115 Berlin"
                    className="text-base p-4 border border-ergo-line rounded"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="fade-in text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-ergo-check mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl mb-2">
                Vielen Dank!
              </h3>
              <p className="text-sm sm:text-base text-ergo-stone mb-6 sm:mb-8">
                Ihre Anfrage wurde erfolgreich übermittelt
              </p>

              <div className="ergo-card p-4 sm:p-6 mb-4 sm:mb-6 text-left">
                <h4 className="font-sans font-bold text-ergo-ink mb-3 sm:mb-4 text-sm sm:text-base">Was passiert jetzt?</h4>
                <div className="space-y-2 sm:space-y-3 text-ergo-ink text-sm sm:text-base">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 text-ergo-check" />
                    <span>Wir melden uns innerhalb von 24 Stunden</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 text-ergo-check" />
                    <span>Sie erhalten Ihr persönliches Angebot</span>
                  </div>
                  <div className="flex items-center">
                    <Handshake className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 text-ergo-check" />
                    <span>Kostenlose & unverbindliche Beratung</span>
                  </div>
                </div>
              </div>

              {/* Expert Contact Section */}
              <div className="bg-ergo-gray rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white border-2 border-ergo-red">
                      <img
                        src={morinoImage}
                        alt="Morino Stübe - Ihr Experte"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-sans font-bold text-ergo-ink mb-1">Morino Stübe</h4>
                    <p className="text-sm text-ergo-red font-bold mb-2">Ihr Versicherungsexperte</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-ergo-ink">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-ergo-red" />
                        <span>Zertifiziert</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-ergo-red" />
                        <span>10+ Jahre</span>
                      </div>
                    </div>
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
                "Berechnung..."
              ) : currentStep === 3 ? (
                "ANGEBOT ANFORDERN"
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
