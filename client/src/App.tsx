import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { useScrollTop } from "@/hooks/use-scroll-top";
import Home from "@/pages/Home";
import Insurance from "@/pages/Insurance";
import AdminDashboard from "@/pages/AdminDashboard";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import Sitemap from "@/pages/Sitemap";
import NotFound from "@/pages/not-found";
import WhatsAppButton from "@/components/WhatsAppButton";

function AppContent() {
  useAnalytics();
  useScrollTop();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/versicherung/:type" component={Insurance} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/sitemap" component={Sitemap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
        <WhatsAppButton variant="floating" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
