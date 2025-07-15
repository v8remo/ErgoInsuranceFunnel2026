import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { insuranceConfig } from "@/lib/insurance-config";
import { X, CheckCircle, Phone, Clock, Calculator, Handshake, Shield } from "lucide-react";
import type { InsertLead } from "@shared/schema";
import morinoImage from "@assets/089-Ti9r4yWZjrM.jpeg";

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
      console.log("Submitting lead data:", leadData);
      const response = await apiRequest("POST", "/api/leads", leadData);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Lead successfully created:", data);
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
      console.error("Lead submission error:", error);
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
    console.log("submitForm called with formData:", formData);
    
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

    console.log("About to submit leadData:", leadData);
    submitMutation.mutate(leadData);
  };

  const getLeadValue = (type: string) => {
    const values = {
      hausrat: 50,
      haftpflicht: 40,
      wohngebaeude: 100,
      rechtsschutz: 60,
      zahnzusatz: 45
    };
    return values[type as keyof typeof values] || 50;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 rounded-t-lg sm:rounded-t-xl">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-ergo-dark leading-tight">{insurance.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Nur noch wenige Schritte zu Ihrem persönlichen Angebot</p>
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
        <div className="p-4 sm:p-6">
          
          {/* Step 1: Age Selection */}
          {currentStep === 1 && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <insurance.icon className="w-8 h-8 sm:w-12 sm:h-12 text-ergo-red mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Wie alt sind Sie ungefähr?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Für eine genaue Beitragsberechnung geben Sie bitte Ihr Alter an
                </p>
              </div>
              
              <RadioGroup
                value={formData.age}
                onValueChange={(value) => updateFormData({ age: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {["18-30 Jahre", "31-45 Jahre", "46-60 Jahre", "Über 60 Jahre"].map((age) => (
                  <div key={age} className="flex items-center space-x-3">
                    <RadioGroupItem value={age} id={age} className="flex-shrink-0" />
                    <Label 
                      htmlFor={age}
                      className="flex-1 cursor-pointer border-2 border-gray-200 rounded-lg p-3 sm:p-4 text-center text-sm sm:text-base hover:border-ergo-red transition-colors"
                    >
                      {age}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Specific Questions */}
          {currentStep === 2 && insurance.questions && (
            <div className="fade-in">
              <div className="text-center mb-6 sm:mb-8">
                <insurance.icon className="w-8 h-8 sm:w-12 sm:h-12 text-ergo-red mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Weitere Angaben
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Damit wir Ihnen das passende Angebot erstellen können
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {insurance.questions.map((question, index) => (
                  <div key={index}>
                    <h4 className="text-base sm:text-lg font-semibold text-ergo-dark mb-3 sm:mb-4">
                      {question.question}
                    </h4>
                    
                    {question.type === "radio" && (
                      <RadioGroup
                        value={formData.specificData[question.name] || ""}
                        onValueChange={(value) => updateSpecificData(question.name, value)}
                        className="space-y-2"
                      >
                        {question.options.map((option) => (
                          <div key={option} className="flex items-center space-x-3">
                            <RadioGroupItem value={option} id={option} className="flex-shrink-0" />
                            <Label htmlFor={option} className="cursor-pointer flex-1 p-3 border border-gray-200 rounded-lg text-sm sm:text-base hover:border-ergo-red transition-colors">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {question.type === "select" && (
                      <Select
                        value={formData.specificData[question.name] || ""}
                        onValueChange={(value) => updateSpecificData(question.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Bitte wählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {question.type === "checkbox" && (
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={(formData.specificData[question.name] || []).includes(option)}
                              onCheckedChange={(checked) => {
                                const current = formData.specificData[question.name] || [];
                                const updated = checked
                                  ? [...current, option]
                                  : current.filter((item: string) => item !== option);
                                updateSpecificData(question.name, updated);
                              }}
                            />
                            <Label htmlFor={option} className="cursor-pointer flex-1 p-3 border border-gray-200 rounded-lg hover:border-ergo-red transition-colors">
                              {option}
                            </Label>
                          </div>
                        ))}
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
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-ergo-red-light rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-ergo-red" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                  Ihre Kontaktdaten
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Wir melden uns innerhalb von 24 Stunden bei Ihnen
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">Vorname*</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData({ firstName: e.target.value })}
                      placeholder="Ihr Vorname"
                      className="mt-1 text-base"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Nachname*</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData({ lastName: e.target.value })}
                      placeholder="Ihr Nachname"
                      className="mt-1 text-base"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">E-Mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="ihre@email.de"
                    className="mt-1 text-base"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Telefon*</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                    placeholder="0171 1234567"
                    className="mt-1 text-base"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-sm font-medium">PLZ & Ort*</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    placeholder="z.B. 10115 Berlin"
                    className="mt-1 text-base"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="fade-in text-center">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-ergo-dark mb-2">
                Vielen Dank!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Ihre Anfrage wurde erfolgreich übermittelt
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h4 className="font-semibold text-green-800 mb-3 sm:mb-4 text-sm sm:text-base">Was passiert jetzt?</h4>
                <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span>Wir melden uns innerhalb von 24 Stunden</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span>Sie erhalten Ihr persönliches Angebot</span>
                  </div>
                  <div className="flex items-center">
                    <Handshake className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span>Kostenlose & unverbindliche Beratung</span>
                  </div>
                </div>
              </div>

              {/* Expert Contact Section */}
              <div className="bg-ergo-gray border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-lg">
                      <img 
                        src={morinoImage} 
                        alt="Morino Stübe - Ihr Experte" 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-semibold text-ergo-dark mb-1">Morino Stübe</h4>
                    <p className="text-sm text-ergo-red mb-2">Ihr Versicherungsexperte</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs">
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
          <div className="flex justify-between items-center p-4 sm:p-6 border-t bg-gray-50 rounded-b-lg sm:rounded-b-xl gap-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`text-sm sm:text-base ${currentStep === 1 ? "invisible" : ""}`}
            >
              Zurück
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={!validateCurrentStep() || submitMutation.isPending}
              className="bg-ergo-red hover:bg-ergo-red-hover text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0"
            >
              {submitMutation.isPending ? (
                "Wird gesendet..."
              ) : currentStep === 3 ? (
                "Angebot anfordern"
              ) : (
                "Weiter"
              )}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
