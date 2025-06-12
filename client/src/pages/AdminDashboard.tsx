import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { 
  Users, 
  TrendingUp, 
  Percent, 
  Clock,
  Download,
  Eye,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  Image,
  FileText,
  Settings
} from "lucide-react";
import type { Lead, Content } from "@shared/schema";

interface DashboardStats {
  totalLeads: number;
  weeklyLeads: number;
  conversionRate: number;
  openLeads: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [filterInsurance, setFilterInsurance] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("leads");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication mutation
  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        trackEvent("admin_login");
        toast({
          title: "Erfolgreich angemeldet",
          description: "Willkommen im Admin Dashboard"
        });
      }
    },
    onError: () => {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Falsches Passwort",
        variant: "destructive"
      });
    }
  });

  // Dashboard stats query
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated
  });

  // Leads query with filters
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads", filterInsurance, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterInsurance !== "all") params.set("insuranceType", filterInsurance);
      if (filterStatus !== "all") params.set("status", filterStatus);
      
      const response = await apiRequest("GET", `/api/leads?${params.toString()}`);
      return response.json();
    },
    enabled: isAuthenticated
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Status aktualisiert",
        description: "Der Lead-Status wurde erfolgreich geändert"
      });
    }
  });

  // Export CSV mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/leads/export/csv");
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      trackEvent("leads_exported");
      toast({
        title: "Export erfolgreich",
        description: "Die Leads wurden als CSV-Datei heruntergeladen"
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  const handleStatusUpdate = (leadId: number, newStatus: string) => {
    updateLeadMutation.mutate({ id: leadId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "Neu", className: "bg-yellow-100 text-yellow-800" },
      contacted: { label: "Kontaktiert", className: "bg-blue-100 text-blue-800" },
      qualified: { label: "Qualifiziert", className: "bg-green-100 text-green-800" },
      converted: { label: "Abgeschlossen", className: "bg-green-100 text-green-800" },
      lost: { label: "Verloren", className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getInsuranceBadge = (type: string) => {
    const colors = {
      hausrat: "bg-blue-100 text-blue-800",
      haftpflicht: "bg-green-100 text-green-800", 
      wohngebaeude: "bg-purple-100 text-purple-800",
      rechtsschutz: "bg-orange-100 text-orange-800",
      zahnzusatz: "bg-pink-100 text-pink-800"
    };
    
    const typeNames = {
      hausrat: "Hausrat",
      haftpflicht: "Haftpflicht",
      wohngebaeude: "Wohngebäude", 
      rechtsschutz: "Rechtsschutz",
      zahnzusatz: "Zahnzusatz"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {typeNames[type as keyof typeof typeNames] || type}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ergo-gray-light flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="bg-ergo-red text-white rounded-t-lg">
            <CardTitle className="text-center text-white">
              ERGO Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ergo-dark mb-2">
                  Passwort
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin-Passwort eingeben"
                  required
                  className="border-gray-300 focus:border-ergo-red focus:ring-ergo-red"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-ergo-red hover:bg-ergo-red-hover text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ergo-gray-light">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-ergo-red">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-ergo-dark">ERGO Admin Dashboard</h1>
              <p className="text-ergo-dark-light">Leads verwalten und Inhalte bearbeiten</p>
            </div>
          </div>
          
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Select value={filterInsurance} onValueChange={setFilterInsurance}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Versicherung filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Versicherungen</SelectItem>
                  <SelectItem value="hausrat">Hausratversicherung</SelectItem>
                  <SelectItem value="haftpflicht">Haftpflichtversicherung</SelectItem>
                  <SelectItem value="wohngebaeude">Wohngebäudeversicherung</SelectItem>
                  <SelectItem value="rechtsschutz">Rechtsschutzversicherung</SelectItem>
                  <SelectItem value="zahnzusatz">Zahnzusatzversicherung</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportMutation.isPending ? "Exportiere..." : "Export CSV"}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Gesamt Leads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Diese Woche</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.weeklyLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Percent className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Offen</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.openLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Lade Leads...</div>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Keine Leads gefunden</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versicherung</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontakt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Alter: {lead.age}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getInsuranceBadge(lead.insuranceType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="text-ergo-red hover:underline">
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center mb-1">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="text-ergo-red hover:underline">
                              {lead.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-gray-600">{lead.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(lead.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Neu</SelectItem>
                              <SelectItem value="contacted">Kontaktiert</SelectItem>
                              <SelectItem value="qualified">Qualifiziert</SelectItem>
                              <SelectItem value="converted">Abgeschlossen</SelectItem>
                              <SelectItem value="lost">Verloren</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Management Section */}
        <Card className="bg-white shadow-lg border-t-4 border-ergo-red">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 text-ergo-red mr-2" />
              Content Management
            </CardTitle>
            <p className="text-ergo-dark-light">Bearbeiten Sie Bilder und Texte für alle Versicherungsseiten</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {[
                { 
                  id: "hausrat", 
                  name: "Hausratversicherung", 
                  currentImage: "https://images.unsplash.com/photo-1556909045-f7de0ad5eab5?w=400&h=250&fit=crop&q=80",
                  description: "Schutz für Ihr Hab und Gut. Absicherung gegen Einbruch, Feuer, Wasser und Sturm.",
                  price: "ab 15€/Monat"
                },
                { 
                  id: "haftpflicht", 
                  name: "Haftpflichtversicherung", 
                  currentImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&q=80",
                  description: "Schutz vor existenzbedrohenden Schadenersatzforderungen. Ein Muss für jeden.",
                  price: "ab 8€/Monat"
                },
                { 
                  id: "wohngebaeude", 
                  name: "Wohngebäudeversicherung", 
                  currentImage: "/attached_assets/wohngebaeudeversicherung.dam_1749718195826.jpg",
                  description: "Für den wichtigsten Ort der Welt: Ihr Zuhause. Mit der \"Haus-zurück-Garantie\" bekommen Sie die Kosten für die Wiederherstellung in einen neuwertigen Zustand zu aktuellen Preisen erstattet.",
                  price: "z.B. 28,99€/Monat"
                },
                { 
                  id: "rechtsschutz", 
                  name: "Rechtsschutzversicherung", 
                  currentImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=250&fit=crop&q=80",
                  description: "Durchsetzen Ihres Rechts ohne finanzielle Sorgen. Anwalts- und Gerichtskosten abgedeckt.",
                  price: "ab 18€/Monat"
                },
                { 
                  id: "zahnzusatz", 
                  name: "Zahnzusatzversicherung", 
                  currentImage: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&h=250&fit=crop&q=80",
                  description: "Für schöne und gesunde Zähne. Ohne Wartezeit und mit Sofortleistung.",
                  price: "ab 10€/Monat"
                }
              ].map((insurance) => (
                <Card key={insurance.id} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-ergo-dark">{insurance.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Image className="w-4 h-4 inline mr-1" />
                          Aktuelles Bild
                        </label>
                        <div className="mb-4">
                          <img 
                            src={insurance.currentImage} 
                            alt={insurance.name}
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                        <Input 
                          placeholder="Neue Bild-URL eingeben"
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Empfohlene Größe: 400x250px
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            Titel
                          </label>
                          <Input 
                            defaultValue={insurance.name}
                            placeholder="Versicherungstitel"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Beschreibung
                          </label>
                          <textarea 
                            className="w-full p-3 border border-gray-300 rounded-md resize-none"
                            rows={3}
                            placeholder="Beschreibung der Versicherung"
                            defaultValue={insurance.description}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preis
                          </label>
                          <Input 
                            placeholder="ab 10€/Monat"
                            defaultValue={insurance.price}
                          />
                        </div>
                        
                        <Button className="bg-ergo-red hover:bg-ergo-red-hover text-white w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Änderungen speichern
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
