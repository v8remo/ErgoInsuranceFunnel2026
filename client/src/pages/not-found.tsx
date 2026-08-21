import { Link } from "wouter";
import { Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="font-serif text-7xl font-bold text-ergo-red mb-4">
          404
        </div>
        <h1 className="text-xl mb-2">
          Seite nicht gefunden
        </h1>
        <p className="text-sm text-ergo-stone mb-8">
          Die angeforderte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="ergo-btn ergo-btn--primary"
          >
            <Home className="w-4 h-4" />
            Zur Startseite
          </Link>
          <a
            href="https://wa.me/4915566771019"
            target="_blank"
            rel="noopener noreferrer"
            className="ergo-btn ergo-btn--whatsapp"
          >
            <MessageCircle className="w-4 h-4" />
            Direkt beraten lassen
          </a>
        </div>
        <p className="text-xs text-ergo-mute mt-6">
          ERGO Agentur Stübe · Ganderkesee
        </p>
      </div>
    </div>
  );
}
