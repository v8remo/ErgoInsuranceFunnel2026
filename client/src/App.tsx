import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { useScrollTop } from "@/hooks/use-scroll-top";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import DokumentePage from "@/pages/DokumentePage";
import SchadenPage from "@/pages/SchadenPage";
import KennzeichenPage from "@/pages/KennzeichenPage";
import NotFound from "@/pages/not-found";
import CallbackWidget from "@/components/CallbackWidget";

function AppContent() {
  useAnalytics();
  useScrollTop();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dokumente" component={DokumentePage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/schaden" component={SchadenPage} />
      <Route path="/kennzeichen" component={KennzeichenPage} />
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
        <CallbackWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
