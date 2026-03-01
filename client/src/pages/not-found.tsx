import { Link } from "wouter";
import { Home, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl font-extrabold bg-gradient-to-r from-[#E2001A] to-[#003781] bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Seite nicht gefunden
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Die angeforderte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E2001A] to-[#c5001a] text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl transition-shadow"
          >
            <Home className="w-4 h-4" />
            Zur Startseite
          </Link>
          <a
            href="https://wa.me/4915566771019"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Direkt beraten lassen
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          ERGO Agentur Stübe · Ganderkesee
        </p>
      </div>
    </div>
  );
}
