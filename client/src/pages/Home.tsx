import ProfessionalErgoLanding from "@/components/ProfessionalErgoLanding";

export default function Home() {
  return (
    <div>
      <ProfessionalErgoLanding />
      
      {/* RECHTLICHER FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-3">
            <div className="text-gray-700 font-bold text-sm">ERGO Agentur Stübe - Morino Stübe, Ganderkesee</div>
            <div className="space-x-6 text-xs">
              <a href="/impressum" className="text-ergo-red hover:text-red-700 font-bold underline">Impressum</a>
              <a href="/datenschutz" className="text-ergo-red hover:text-red-700 font-bold underline">Datenschutz</a>
              <span className="text-gray-500">Tel: 015566771019</span>
            </div>
            <div className="text-xs text-gray-500">
              Gebundener Versicherungsvertreter der ERGO • Vermittlerregister-Nr.: D-5H7J-7DUI1-10
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}