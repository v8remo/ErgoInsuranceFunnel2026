/**
 * Removes legacy insurer-led marketing language from public editorial content.
 * Apply only to marketing copy — never to legal notices, email addresses, URLs,
 * tracking identifiers, form field values or backend payloads.
 */
export function neutralizePublicBranding(text: string): string {
  const neutralized = text
    .replace(/\s*\|\s*ERGO\b/gi, "")
    .replace(/ERGO Agentur Stübe/gi, "Agentur Stübe")
    .replace(/ERGO Agentur/gi, "Agentur Stübe")
    .replace(/ERGO Versicherung Morino Stübe/gi, "Agentur Stübe")
    .replace(/persönliche ERGO Versicherungsberatung/gi, "persönliche Versicherungsberatung")
    .replace(/ERGO Versicherungsagentur/gi, "Versicherungsagentur Stübe")
    .replace(/ERGO Versicherungsberatung/gi, "persönliche Versicherungsberatung")
    .replace(/ERGO Versicherungsberater/gi, "Versicherungsberater")
    .replace(/ERGO Versicherungsfachmann/gi, "Versicherungsfachmann")
    .replace(/ERGO Ansprechpartner/gi, "persönlicher Ansprechpartner")
    .replace(/ERGO Bündelnachlass/gi, "Bündelnachlass für mehrere Verträge")
    .replace(/ERGO Bündelvorteil/gi, "Bündelvorteil")
    .replace(/ERGO-Produkte/gi, "Versicherungslösungen")
    .replace(/ERGO-Tarife/gi, "passende Tarife")
    .replace(/ERGO-Verträgen/gi, "Verträgen")
    .replace(/ERGO-Verträge/gi, "Verträge")
    .replace(/ERGO Versicherung/gi, "Versicherung")
    .replace(/ERGO Hausratversicherung/gi, "Hausratversicherung")
    .replace(/ERGO Hausrat/gi, "Hausratversicherung")
    .replace(/ERGO Rechtsschutzversicherung/gi, "Rechtsschutzversicherung")
    .replace(/ERGO Rechtsschutz/gi, "Rechtsschutzversicherung")
    .replace(/ERGO Unfallversicherung/gi, "Unfallversicherung")
    .replace(/ERGO Lebensversicherung/gi, "Lebensversicherung")
    .replace(/ERGO Kfz-Versicherung/gi, "Kfz-Versicherung")
    .replace(/ERGO Kfz/gi, "Kfz")
    .replace(/ERGO Haftpflicht/gi, "Haftpflicht")
    .replace(/ERGO Wohngebäudeversicherung/gi, "Wohngebäudeversicherung")
    .replace(/ERGO Agrarversicherungen/gi, "Agrarversicherungen")
    .replace(/ERGO Zahnzusatz-Tarife/gi, "Zahnzusatz-Tarife")
    .replace(/der ERGO Zahnzusatz/gi, "der Zahnzusatzversicherung")
    .replace(/ERGO Zahnzusatzversicherung/gi, "Zahnzusatzversicherung")
    .replace(/ERGO Zahnzusatz/gi, "Zahnzusatzversicherung")
    .replace(/ERGO BU-Rente/gi, "BU-Rente")
    .replace(/ERGO BU/gi, "BU")
    .replace(/ERGO Gruppe/gi, "Versicherungsgruppe")
    .replace(/ERGO Testsieger/gi, "Leistungsstarker Tarif")
    .replace(/ERGO-Schaden-Hotline/gi, "Schaden-Hotline")
    .replace(/ERGO-Versicherungsanalyse/gi, "Versicherungsanalyse")
    .replace(/ERGO-Experten/gi, "Versicherungsexperten")
    .replace(/ERGO Berater/gi, "Versicherungsberater")
    .replace(/ERGO Experte/gi, "Versicherungsexperte")
    .replace(/ERGO Experten/gi, "Versicherungsexperten")
    .replace(/ERGO Tarife/gi, "passende Tarife")
    .replace(/ERGO Tarif/gi, "passender Tarif")
    .replace(/ERGO Produktportfolio/gi, "Versicherungsangebot")
    .replace(/ERGO (Ganderkesee|Delmenhorst|Stuhr|Achim|Syke|Oldenburg)/gi, "Agentur Stübe $1")
    .replace(/Die ERGO bietet/gi, "Der Versicherer bietet")
    .replace(/Die ERGO hat/gi, "Der Versicherer hat")
    .replace(/Welche Vorteile hat ERGO gegenüber Online-Versicherungen/gi, "Welche Vorteile hat persönliche Beratung gegenüber Online-Versicherungen")
    .replace(/Bietet ERGO/gi, "Gibt es")
    .replace(/ERGO bietet/gi, "Der Versicherer bietet")
    .replace(/ERGO erstattet/gi, "Der Tarif erstattet")
    .replace(/die ERGO/gi, "der Versicherer")
    .replace(/mit ERGO/gi, "mit einem passenden Anbieter")
    .replace(/über ERGO und DKV/gi, "über DKV und weitere Anbieter")
    .replace(/über ERGO/gi, "über passende Anbieter")
    .replace(/der ERGO/gi, "des Versicherers")
    .replace(/bei ERGO/gi, "bei einem passenden Anbieter")
    .replace(/zu ERGO/gi, "zu einem passenden Anbieter")
    .replace(/von ERGO/gi, "vom Versicherer")
    .replace(/für ERGO/gi, "für den Versicherer");

  if (/\bERGO\b/i.test(neutralized)) {
    throw new Error(`Nicht neutralisierter öffentlicher Marketingtext: ${text}`);
  }

  if (/\bDie Der\b|\bdie der Versicherer\b/.test(neutralized)) {
    throw new Error(`Fehlerhafte Artikelverdopplung im öffentlichen Marketingtext: ${neutralized}`);
  }

  return neutralized;
}