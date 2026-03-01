import { useState, useEffect, useRef } from "react";
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
  Settings,
  Upload,
  Trash2,
  ArrowLeft,
  LogOut,
  Lock,
  Instagram
} from "lucide-react";
import type { Lead, Content, Submission } from "@shared/schema";

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
  const [filterSubmissionType, setFilterSubmissionType] = useState<string>("all");
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});
  const [contentData, setContentData] = useState<{[key: string]: {title: string, description: string, price: string}}>({});
  const [savingContent, setSavingContent] = useState<{[key: string]: boolean}>({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
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

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/api/admin/change-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setShowPasswordChange(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Passwort erfolgreich geändert",
          description: "Ihr neues Passwort wurde gespeichert"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Passwort-Änderung fehlgeschlagen",
        description: error.message || "Fehler beim Ändern des Passworts",
        variant: "destructive"
      });
    }
  });

  // Dashboard stats query
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated
  });

  // Content query to load existing content
  const { data: existingContent } = useQuery<Content[]>({
    queryKey: ["/api/content"],
    enabled: isAuthenticated
  });

  // Initialize content data when existing content loads
  useEffect(() => {
    if (existingContent) {
      const contentMap: {[key: string]: {title: string, description: string, price: string}} = {};
      const imageMap: {[key: string]: string} = {};
      
      existingContent.forEach((content: Content) => {
        if (content.type === "insurance") {
          let price = "";
          try {
            const metadata = (content as any).metadata;
            if (metadata) {
              if (typeof metadata === 'string') {
                price = JSON.parse(metadata).price || "";
              } else if (typeof metadata === 'object' && metadata.price) {
                price = metadata.price;
              }
            }
          } catch (error) {
            console.warn('Error parsing metadata for content:', content.identifier, error);
            price = "";
          }
          
          contentMap[content.identifier] = {
            title: content.title,
            description: content.description,
            price: price
          };
          if (content.imageUrl) {
            imageMap[content.identifier] = content.imageUrl;
          }
        }
      });
      
      setContentData(contentMap);
      setImageUrls(imageMap);
    }
  }, [existingContent]);

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

  // Delete lead mutation
  const deleteMutation = useMutation({
    mutationFn: async (leadId: number) => {
      const response = await apiRequest("DELETE", `/api/leads/${leadId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      trackEvent("lead_deleted");
      toast({
        title: "Lead gelöscht",
        description: "Der Lead wurde erfolgreich gelöscht"
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Lead konnte nicht gelöscht werden",
        variant: "destructive"
      });
    }
  });

  const handleDeleteLead = (leadId: number) => {
    if (confirm("Sind Sie sicher, dass Sie diesen Lead löschen möchten?")) {
      deleteMutation.mutate(leadId);
    }
  };

  const { data: submissionsData = [], isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions", filterSubmissionType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterSubmissionType !== "all") params.set("type", filterSubmissionType);
      const response = await apiRequest("GET", `/api/submissions?${params.toString()}`);
      return response.json();
    },
    enabled: isAuthenticated
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const response = await apiRequest("PATCH", `/api/submissions/${id}`, { status, notes });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({ title: "Status aktualisiert" });
    }
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/submissions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({ title: "Eintrag gelöscht" });
    }
  });

  const getSubmissionTypeBadge = (type: string) => {
    const config: Record<string, { label: string; className: string }> = {
      dokument: { label: "Dokument", className: "bg-blue-100 text-blue-800" },
      schaden: { label: "Schaden", className: "bg-red-100 text-red-800" },
      kennzeichen: { label: "Kennzeichen", className: "bg-purple-100 text-purple-800" },
      rechnung: { label: "Rechnung", className: "bg-amber-100 text-amber-800" },
      rueckruf: { label: "Rückruf", className: "bg-green-100 text-green-800" },
    };
    const c = config[type] || { label: type, className: "bg-gray-100 text-gray-800" };
    return <Badge className={c.className}>{c.label}</Badge>;
  };

  const getSubmissionStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      neu: { label: "Neu", className: "bg-yellow-100 text-yellow-800" },
      bearbeitung: { label: "In Bearbeitung", className: "bg-blue-100 text-blue-800" },
      erledigt: { label: "Erledigt", className: "bg-green-100 text-green-800" },
    };
    const c = config[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge className={c.className}>{c.label}</Badge>;
  };

  // Image upload functionality
  const handleImageUpload = async (file: File, insuranceId: string) => {
    setUploadingImages(prev => ({ ...prev, [insuranceId]: true }));
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setImageUrls(prev => ({ ...prev, [insuranceId]: result.imageUrl }));
        toast({
          title: "Bild hochgeladen",
          description: "Das Bild wurde erfolgreich hochgeladen"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Upload fehlgeschlagen",
        description: "Das Bild konnte nicht hochgeladen werden",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(prev => ({ ...prev, [insuranceId]: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, insuranceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile, insuranceId);
    } else {
      toast({
        title: "Ungültiger Dateityp",
        description: "Bitte laden Sie nur Bilddateien hoch",
        variant: "destructive"
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, insuranceId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, insuranceId);
    }
  };

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async ({ insuranceId, data }: { insuranceId: string, data: any }) => {
      // Check if content already exists
      const existingItem = existingContent?.find((c: Content) => c.identifier === insuranceId && c.type === "insurance");
      
      const contentPayload = {
        type: "insurance",
        identifier: insuranceId,
        title: data.title,
        description: data.description,
        imageUrl: imageUrls[insuranceId] || data.currentImage,
        metadata: JSON.stringify({ price: data.price })
      };

      if (existingItem) {
        // Update existing content
        const response = await apiRequest("PUT", `/api/content/${existingItem.id}`, contentPayload);
        return response.json();
      } else {
        // Create new content
        const response = await apiRequest("POST", "/api/content", contentPayload);
        return response.json();
      }
    },
    onSuccess: (data, variables) => {
      setSavingContent(prev => ({ ...prev, [variables.insuranceId]: false }));
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Änderungen wurden in der Datenbank gespeichert"
      });
    },
    onError: (error, variables) => {
      setSavingContent(prev => ({ ...prev, [variables.insuranceId]: false }));
      toast({
        title: "Speichern fehlgeschlagen",
        description: "Die Änderungen konnten nicht gespeichert werden",
        variant: "destructive"
      });
    }
  });

  const handleSaveContent = (insuranceId: string, insuranceData: any) => {
    setSavingContent(prev => ({ ...prev, [insuranceId]: true }));
    
    const formData = contentData[insuranceId] || {};
    const dataToSave = {
      title: formData.title || insuranceData.name,
      description: formData.description || insuranceData.description,
      price: formData.price || insuranceData.price,
      currentImage: insuranceData.currentImage
    };
    
    saveContentMutation.mutate({ insuranceId, data: dataToSave });
  };

  const handleContentChange = (insuranceId: string, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [insuranceId]: {
        ...prev[insuranceId],
        [field]: value
      }
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwörter stimmen nicht überein",
        description: "Bitte überprüfen Sie die Eingabe",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Passwort zu kurz",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein",
        variant: "destructive"
      });
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword,
      newPassword
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setActiveTab("leads");
    setShowPasswordChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({
      title: "Erfolgreich abgemeldet",
      description: "Sie wurden vom Admin Dashboard abgemeldet"
    });
  };

  const handleBackToHome = () => {
    window.location.href = "/";
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
      <div className="min-h-screen bg-ergo-gray-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="bg-ergo-red text-white rounded-t-lg">
            <CardTitle className="text-center text-white text-lg sm:text-xl">
              ERGO Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
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
                  className="border-gray-300 focus:border-ergo-red focus:ring-ergo-red text-base"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-ergo-red hover:bg-ergo-red-hover text-white text-sm sm:text-base py-2 sm:py-3"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Startseite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ergo-gray-light">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border-t-4 border-ergo-red">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-ergo-dark">ERGO Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-ergo-dark-light">Leads verwalten und Inhalte bearbeiten</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBackToHome}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(true)}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Passwort ändern
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Abmelden
              </Button>
            </div>
          </div>
          
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              { key: "leads", label: "Leads", icon: Users },
              { key: "anfragen", label: "Kundenanfragen", icon: FileText },
              { key: "content", label: "Inhalte", icon: Settings },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-ergo-red text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.key === "anfragen" && submissionsData.filter(s => s.status === "neu").length > 0 && (
                  <span className="bg-white text-ergo-red text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {submissionsData.filter(s => s.status === "neu").length}
                  </span>
                )}
              </button>
            ))}
            <a
              href="/admin/instagram"
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 ml-auto border border-dashed border-gray-300 hover:border-pink-400 hover:text-pink-600"
            >
              <Instagram className="w-4 h-4" />
              Instagram Generator
            </a>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-gray-600">Gesamt Leads</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-gray-600">Diese Woche</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.weeklyLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                    <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-gray-600">Offen</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.openLeads}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
        <>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Select value={filterInsurance} onValueChange={setFilterInsurance}>
              <SelectTrigger className="w-full sm:w-48">
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
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              {exportMutation.isPending ? "Exportiere..." : "Export CSV"}
            </Button>
          </div>
        </div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
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
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteLead(lead.id)}
                              disabled={deleteMutation.isPending}
                              className="px-3 py-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        </>
        )}

        {/* Submissions/Anfragen Tab */}
        {activeTab === "anfragen" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardTitle>Kundenanfragen</CardTitle>
              <Select value={filterSubmissionType} onValueChange={setFilterSubmissionType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Typ filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="dokument">Dokumente</SelectItem>
                  <SelectItem value="schaden">Schaden</SelectItem>
                  <SelectItem value="kennzeichen">Kennzeichen</SelectItem>
                  <SelectItem value="rechnung">Rechnungen</SelectItem>
                  <SelectItem value="rueckruf">Rückrufe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="text-center py-8 text-gray-500">Lade Anfragen...</div>
            ) : submissionsData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Keine Anfragen gefunden</div>
            ) : (
              <div className="space-y-3">
                {submissionsData.map((sub) => (
                  <div key={sub.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSubmissionTypeBadge(sub.type)}
                        {getSubmissionStatusBadge(sub.status)}
                        <span className="text-xs text-gray-400">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleString("de-DE") : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={sub.status}
                          onValueChange={(val) => updateSubmissionMutation.mutate({ id: sub.id, status: val })}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="neu">Neu</SelectItem>
                            <SelectItem value="bearbeitung">In Bearbeitung</SelectItem>
                            <SelectItem value="erledigt">Erledigt</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => {
                            if (confirm("Eintrag wirklich löschen?")) deleteSubmissionMutation.mutate(sub.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name: </span>
                        <span>{sub.customerName || "-"}</span>
                      </div>
                      {sub.customerEmail && (
                        <div>
                          <span className="font-medium text-gray-700">E-Mail: </span>
                          <a href={`mailto:${sub.customerEmail}`} className="text-ergo-red hover:underline">{sub.customerEmail}</a>
                        </div>
                      )}
                      {sub.customerPhone && (
                        <div>
                          <span className="font-medium text-gray-700">Telefon: </span>
                          <a href={`tel:${sub.customerPhone}`} className="text-ergo-red hover:underline">{sub.customerPhone}</a>
                        </div>
                      )}
                      {sub.subject && (
                        <div>
                          <span className="font-medium text-gray-700">Betreff: </span>
                          <span>{sub.subject}</span>
                        </div>
                      )}
                    </div>
                    {sub.summary && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{sub.summary}</p>
                    )}
                    {(sub.details != null && typeof sub.details === 'object' && !Array.isArray(sub.details) && Object.keys(sub.details as Record<string, unknown>).length > 0) && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Details anzeigen</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(sub.details, null, 2)}
                        </pre>
                      </details>
                    )}
                    {sub.type === 'dokument' && (sub as any).pdfData && (
                      <button
                        onClick={() => {
                          const pdfData = (sub as any).pdfData as string;
                          const byteStr = atob(pdfData);
                          const bytes = new Uint8Array(byteStr.length);
                          for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
                          const blob = new Blob([bytes], { type: 'application/pdf' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${sub.subject?.replace(/\s/g, '_') ?? 'Dokument'}_${sub.customerName?.replace(/\s/g, '_') ?? ''}.pdf`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-colors"
                      >
                        📥 PDF herunterladen
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Content Management Section */}
        {activeTab === "content" && (
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
                            src={imageUrls[insurance.id] || insurance.currentImage} 
                            alt={insurance.name}
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                        
                        {/* Drag & Drop Upload Area */}
                        <div 
                          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-ergo-red hover:bg-gray-50 ${
                            uploadingImages[insurance.id] ? 'border-ergo-red bg-gray-50' : ''
                          }`}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, insurance.id)}
                          onClick={() => fileInputRefs.current[insurance.id]?.click()}
                        >
                          {uploadingImages[insurance.id] ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ergo-red"></div>
                              <span className="ml-2 text-gray-600">Lädt...</span>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600 mb-1">
                                Bild hierher ziehen oder klicken zum Auswählen
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF bis 5MB
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <input 
                          type="file"
                          ref={(el) => fileInputRefs.current[insurance.id] = el}
                          onChange={(e) => handleFileInputChange(e, insurance.id)}
                          accept="image/*"
                          className="hidden"
                        />
                        
                        <p className="text-sm text-gray-500 mt-2">
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
                            value={contentData[insurance.id]?.title || insurance.name}
                            onChange={(e) => handleContentChange(insurance.id, 'title', e.target.value)}
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
                            value={contentData[insurance.id]?.description || insurance.description}
                            onChange={(e) => handleContentChange(insurance.id, 'description', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preis
                          </label>
                          <Input 
                            placeholder="ab 10€/Monat"
                            value={contentData[insurance.id]?.price || insurance.price}
                            onChange={(e) => handleContentChange(insurance.id, 'price', e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          className="bg-ergo-red hover:bg-ergo-red-hover text-white w-full"
                          onClick={() => handleSaveContent(insurance.id, insurance)}
                          disabled={savingContent[insurance.id]}
                        >
                          {savingContent[insurance.id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Speichert...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Änderungen speichern
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">Passwort ändern</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktuelles Passwort
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Neues Passwort (mind. 8 Zeichen)
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passwort bestätigen
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordChange(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-ergo-red hover:bg-ergo-red-hover"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? "Ändern..." : "Ändern"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
