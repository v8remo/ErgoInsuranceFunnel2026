import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, Shield, Star, CheckCircle, MapPin, MessageSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackEvent, trackConversion } from '@/lib/analytics';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  insuranceType: string;
  message: string;
}

export default function ProfessionalErgoLanding() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    insuranceType: 'general_consultation',
    message: ''
  });

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          age: '30-50 Jahre', // Default für professionelle Anfragen
          specificData: { 
            interests: [data.insuranceType], 
            message: data.message 
          },
          source: 'professional_landing'
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Anfrage');
      }

      return response.json();
    },
    onSuccess: () => {
      trackEvent('lead_form_completed', {
        source: 'professional_landing',
        insurance_type: formData.insuranceType
      });
      trackConversion();
      
      // Reset form und zeige Erfolgsmeldung
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', 
        location: '', insuranceType: 'general_consultation', message: ''
      });
      setShowForm(false);
      
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const whatsappNumber = "01556677101"; // Morino Stübe's WhatsApp
  const whatsappMessage = encodeURIComponent(
    "Hallo Herr Stübe, ich interessiere mich für eine persönliche Beratung zu meinen Versicherungen. Können wir einen Termin vereinbaren?"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* 1. HERO-BEREICH */}
        <div className="text-center mb-12">
          <div className="bg-ergo-red text-white px-6 py-3 rounded-lg inline-block font-bold mb-6 text-lg">
            ERGO Versicherungsfachmann • Ganderkesee
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Ihre ERGO Agentur in Ganderkesee –<br/>
            <span className="text-ergo-red">Persönliche Beratung rund um Ihre Absicherung</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Unabhängig davon, ob es um Kfz, Zahnzusatz, Wohngebäude oder Haftpflicht geht – 
            wir beraten Sie individuell und transparent.
          </p>
          
          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={() => {
                setShowForm(true);
                trackEvent('cta_beratung_clicked', { source: 'hero_section' });
              }}
              className="bg-ergo-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Jetzt Beratung anfragen
            </Button>
            
            <Button
              onClick={() => {
                window.open(`https://wa.me/49${whatsappNumber.replace(/^0/, '')}?text=${whatsappMessage}`, '_blank');
                trackEvent('whatsapp_clicked', { source: 'hero_section' });
                trackConversion();
              }}
              variant="outline"
              className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Direkt über WhatsApp schreiben
            </Button>
          </div>
        </div>

        {/* 2. VERTRAUEN AUFBAUEN */}
        <Card className="mb-12 shadow-lg border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img 
                  src="/attached_assets/089-Ti9r4yWZjrM_1756458595368.jpeg"
                  alt="Morino Stübe - ERGO Versicherungsfachmann"
                  className="w-32 h-32 rounded-full object-cover border-4 border-ergo-red shadow-lg"
                />
              </div>
              
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Morino Stübe
                </h2>
                <p className="text-ergo-red font-semibold text-lg mb-3">
                  ERGO Versicherungsfachmann
                </p>
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  Mit über 3 Jahren Erfahrung in der Versicherungsbranche berate ich Sie kompetent 
                  und verständlich zu allen Fragen rund um Ihre Absicherung.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-ergo-red" />
                    Registriert im Vermittlerregister unter der Nr. D-W0MK-P4H7T-35
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    ERGO als starker Partner seit 1906
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <img 
                  src="https://www.ergo.de/o/ergo-theme/images/logos/ergo-logo.svg" 
                  alt="ERGO Logo"
                  className="h-16 w-auto"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. LEISTUNGEN (BULLET-POINTS) */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Ihre Vorteile bei der ERGO Agentur Stübe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Individuelle Beratung zu allen relevanten Versicherungen</h3>
                    <p className="text-gray-600">Kfz, Haftpflicht, Hausrat, Wohngebäude, Rechtsschutz, Zahnzusatz, Berufsunfähigkeit und Lebensversicherung</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Transparente Gegenüberstellung von Leistungen & Beiträgen</h3>
                    <p className="text-gray-600">Klare Vergleiche und verständliche Erklärungen aller Tarifoptionen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Unterstützung im Schadenfall – persönlich & direkt vor Ort</h3>
                    <p className="text-gray-600">Schnelle Hilfe und persönliche Betreuung wenn Sie uns brauchen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Moderne digitale Beratung per WhatsApp, Telefon oder Video</h3>
                    <p className="text-gray-600">Flexible Beratungstermine, die zu Ihrem Zeitplan passen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 4. RECHTSSICHERER LEAD-MAGNET */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Persönlicher Bedarfs-Check
            </h2>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
              Wir prüfen mit Ihnen gemeinsam, ob Ihre Absicherung noch zu Ihrer Lebenssituation passt. 
              Unverbindlich und kostenfrei.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-6">
              <Button
                onClick={() => {
                  setShowForm(true);
                  trackEvent('lead_magnet_clicked', { source: 'bedarfs_check' });
                }}
                className="bg-ergo-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Jetzt Bedarfs-Check anfordern
              </Button>
            </div>
            
            <div className="text-sm text-gray-600 space-x-4">
              <span>🔒 Datenschutz nach DSGVO</span>
              <span>•</span>
              <span>📋 Unverbindlich & kostenfrei</span>
              <span>•</span>
              <span>⭐ Persönliche Beratung vor Ort</span>
            </div>
          </CardContent>
        </Card>

        {/* BERATUNGSFORMULAR */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Beratungsanfrage</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-semibold">Vorname *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Ihr Vorname"
                        className="mt-1 p-3 border-2 border-gray-300 focus:border-ergo-red"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-semibold">Nachname *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Ihr Nachname"
                        className="mt-1 p-3 border-2 border-gray-300 focus:border-ergo-red"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">E-Mail-Adresse *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="ihre.email@beispiel.de"
                        className="mt-1 p-3 border-2 border-gray-300 focus:border-ergo-red"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold">Telefonnummer *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="01234 567890"
                        className="mt-1 p-3 border-2 border-gray-300 focus:border-ergo-red"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-sm font-semibold">Wohnort *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="z.B. Ganderkesee"
                      className="mt-1 p-3 border-2 border-gray-300 focus:border-ergo-red"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="insuranceType" className="text-sm font-semibold">Beratungsschwerpunkt</Label>
                    <select
                      id="insuranceType"
                      value={formData.insuranceType}
                      onChange={(e) => setFormData(prev => ({ ...prev, insuranceType: e.target.value }))}
                      className="mt-1 w-full p-3 border-2 border-gray-300 focus:border-ergo-red rounded-md"
                    >
                      <option value="general_consultation">Allgemeine Beratung</option>
                      <option value="kfz">Kfz-Versicherung</option>
                      <option value="haftpflicht">Haftpflichtversicherung</option>
                      <option value="hausrat">Hausratversicherung</option>
                      <option value="wohngebaeude">Wohngebäudeversicherung</option>
                      <option value="rechtsschutz">Rechtsschutzversicherung</option>
                      <option value="zahnzusatz">Zahnzusatzversicherung</option>
                      <option value="berufsunfaehigkeit">Berufsunfähigkeitsversicherung</option>
                      <option value="lebensversicherung">Lebensversicherung</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-semibold">Nachricht (optional)</Label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Teilen Sie uns mit, womit wir Ihnen helfen können..."
                      className="mt-1 w-full p-3 border-2 border-gray-300 focus:border-ergo-red rounded-md"
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full bg-ergo-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
                  >
                    {submitMutation.isPending ? "Wird gesendet..." : "Beratungsanfrage senden"}
                  </Button>
                  
                  <div className="text-xs text-gray-600 text-center">
                    Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer 
                    <a href="/datenschutz" className="text-ergo-red hover:underline ml-1">Datenschutzerklärung</a> zu.
                  </div>
                </form>
                
                {submitMutation.isSuccess && (
                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                    <h4 className="text-green-800 font-bold mb-2">✅ Vielen Dank für Ihre Anfrage!</h4>
                    <p className="text-green-700">Ich melde mich schnellstmöglich bei Ihnen zurück.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}