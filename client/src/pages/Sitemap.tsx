import SEO from "@/components/SEO";
import { Link } from "wouter";

export default function Sitemap() {
  const pages = [
    { path: "/", title: "Startseite" },
    { path: "/versicherung/hausrat", title: "Hausratversicherung" },
    { path: "/versicherung/haftpflicht", title: "Haftpflichtversicherung" },
    { path: "/versicherung/wohngebaeude", title: "Wohngebäudeversicherung" },
    { path: "/versicherung/rechtsschutz", title: "Rechtsschutzversicherung" },
    { path: "/versicherung/zahnzusatz", title: "Zahnzusatzversicherung" },
    { path: "/impressum", title: "Impressum" },
    { path: "/datenschutz", title: "Datenschutz" },
  ];

  return (
    <>
      <SEO
        title="Sitemap - ERGO Versicherung Ganderkesee"
        description="Übersicht aller Seiten der ERGO Versicherung Ganderkesee. Finden Sie schnell die gewünschten Informationen zu unseren Versicherungsprodukten."
        keywords="Sitemap, Seitenübersicht, ERGO Ganderkesee, Versicherungen"
      />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-ergo-dark mb-8">Sitemap</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <p className="text-gray-600 mb-6">
              Hier finden Sie eine Übersicht aller Seiten unserer Website:
            </p>
            
            <ul className="space-y-3">
              {pages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    className="text-ergo-red hover:text-ergo-red-dark transition-colors flex items-center"
                  >
                    <span className="mr-2">→</span>
                    <span className="underline">{page.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}