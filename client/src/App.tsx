import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { useScrollTop } from "@/hooks/use-scroll-top";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import DokumentePage from "@/pages/DokumentePage";
import SchadenPage from "@/pages/SchadenPage";
import KennzeichenPage from "@/pages/KennzeichenPage";
import Erstinformation from "@/pages/Erstinformation";
import Insurance from "@/pages/Insurance";
import CityLanding from "@/pages/CityLanding";
import LeadPage from "@/pages/LeadPage";
import LebenVorsorge from "@/pages/LebenVorsorge";
import NotFound from "@/pages/not-found";
import CallbackWidget from "@/components/CallbackWidget";
import CookieConsent from "@/components/CookieConsent";

function Layout({ children }: { children: React.ReactNode }) {
  const [isAdmin] = useRoute("/admin");
  const [isBeratung] = useRoute("/beratung");
  const hideLayout = isAdmin || isBeratung;

  return (
    <>
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}

function AppContent() {
  useAnalytics();
  useScrollTop();
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dokumente" component={DokumentePage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/schaden" component={SchadenPage} />
        <Route path="/kennzeichen" component={KennzeichenPage} />
        <Route path="/erstinformation" component={Erstinformation} />
        <Route path="/versicherung/:type" component={Insurance} />
        <Route path="/versicherung-ganderkesee">{() => <CityLanding cityKey="ganderkesee" />}</Route>
        <Route path="/versicherung-delmenhorst">{() => <CityLanding cityKey="delmenhorst" />}</Route>
        <Route path="/versicherung-oldenburg">{() => <CityLanding cityKey="oldenburg" />}</Route>
        <Route path="/leben-vorsorge" component={LebenVorsorge} />
        <Route path="/beratung" component={LeadPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
        <CallbackWidget />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
