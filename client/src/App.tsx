import { Switch, Route, useRoute } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalytics } from "@/hooks/use-analytics";
import { useScrollTop } from "@/hooks/use-scroll-top";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import CallbackWidget from "@/components/CallbackWidget";
import CookieConsent from "@/components/CookieConsent";

const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Impressum = lazy(() => import("@/pages/Impressum"));
const Datenschutz = lazy(() => import("@/pages/Datenschutz"));
const DokumentePage = lazy(() => import("@/pages/DokumentePage"));
const SchadenPage = lazy(() => import("@/pages/SchadenPage"));
const KennzeichenPage = lazy(() => import("@/pages/KennzeichenPage"));
const Erstinformation = lazy(() => import("@/pages/Erstinformation"));
const Insurance = lazy(() => import("@/pages/Insurance"));
const CityLanding = lazy(() => import("@/pages/CityLanding"));
const LeadPage = lazy(() => import("@/pages/LeadPage"));
const LebenVorsorge = lazy(() => import("@/pages/LebenVorsorge"));
const TerminPage = lazy(() => import("@/pages/TerminPage"));
const VersicherungsCheck = lazy(() => import("@/pages/VersicherungsCheck"));
const SparRechner = lazy(() => import("@/pages/SparRechner"));
const AktionsSeiten = lazy(() => import("@/pages/AktionsSeiten"));
const InstagramGenerator = lazy(() => import("@/pages/InstagramGenerator"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ergo-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isAdmin] = useRoute("/admin");
  const [isInstagram] = useRoute("/admin/instagram");
  const [isBeratung] = useRoute("/beratung");
  const hideLayout = isAdmin || isInstagram || isBeratung;

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
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/termin" component={TerminPage} />
          <Route path="/versicherungscheck" component={VersicherungsCheck} />
          <Route path="/sparrechner" component={SparRechner} />
          <Route path="/aktion/:slug" component={AktionsSeiten} />
          <Route path="/admin/instagram" component={InstagramGenerator} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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
