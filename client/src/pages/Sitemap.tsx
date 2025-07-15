import { Link } from "wouter";

export default function Sitemap() {
  const insuranceTypes = [
    { id: "hausrat", name: "Hausratversicherung" },
    { id: "haftpflicht", name: "Haftpflichtversicherung" },
    { id: "wohngebaeude", name: "Wohngebäudeversicherung" },
    { id: "rechtsschutz", name: "Rechtsschutzversicherung" },
    { id: "zahnzusatz", name: "Zahnzusatzversicherung" }
  ];

  return (
    <div className="min-h-screen bg-ergo-gray">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-ergo-dark mb-8">Sitemap</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-ergo-dark mb-4">Hauptseiten</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-600 hover:underline">
                  Startseite
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ergo-dark mb-4">Versicherungen</h2>
            <ul className="space-y-2">
              {insuranceTypes.map(type => (
                <li key={type.id}>
                  <Link href={`/versicherung/${type.id}`} className="text-blue-600 hover:underline">
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ergo-dark mb-4">Weitere Seiten</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-blue-600 hover:underline">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}