import { Resend } from 'resend';
import { Lead } from '@shared/schema';

// Formulareingaben vor dem Einsetzen in HTML-Mails maskieren.
export function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  gclid?: string;
}

interface LeadSpecificData {
  utm?: UtmData;
  has_existing?: string;
  timing_preference?: string;
  sonstiges_text?: string;
  [key: string]: string | UtmData | undefined;
}

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not found - Email notifications will be disabled');
}

const resend = new Resend(process.env.RESEND_API_KEY || "re_unset");

export async function sendLeadNotification(lead: Lead): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email notification skipped - no API key configured');
    return false;
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #e53e3e; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🎯 Neuer Lead eingegangen!</h1>
          <p style="margin: 10px 0 0 0;">ERGO Ganderkesee - Versicherungsplattform</p>
        </div>
        
        <div style="padding: 20px; background-color: #f7f7f7;">
          <h2 style="color: #e53e3e; margin-top: 0;">Lead-Details</h2>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p><strong>Versicherungstyp:</strong> ${esc(getInsuranceName(lead.insuranceType))}</p>
            <p><strong>Name:</strong> ${esc(lead.firstName)} ${esc(lead.lastName)}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></p>
            <p><strong>Telefon:</strong> <a href="tel:${esc(lead.phone)}">${esc(lead.phone)}</a></p>
            <p><strong>PLZ:</strong> ${esc(lead.location)}</p>
            <p><strong>Alter:</strong> ${esc(lead.age)}</p>
            <p><strong>Eingegangen:</strong> ${new Date(lead.createdAt).toLocaleString('de-DE')}</p>
          </div>
          
          ${renderSpecificData(lead.specificData)}
        </div>
        
        <div style="background-color: #e53e3e; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0;">Melden Sie sich im Admin-Dashboard an, um den Lead zu bearbeiten.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'ERGO Lead System <rueckruf@anfrage.ergo-stuebe.de>',
      to: 'morino.stuebe@ergo.de',
      subject: `🎯 Neuer ${getInsuranceName(lead.insuranceType)} Lead von ${lead.firstName} ${lead.lastName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return false;
    }

    console.log('Lead notification email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending lead notification:', error);
    return false;
  }
}

function renderSpecificData(specificData: unknown): string {
  if (!specificData || typeof specificData !== 'object') return '';
  const data = specificData as LeadSpecificData;
  const keys = Object.keys(data);
  if (keys.length === 0) return '';

  const otherEntries = Object.entries(data).filter(
    ([k, v]) => k !== 'utm' && typeof v === 'string' && v !== ''
  ) as [string, string][];

  const utm = data.utm;
  const hasUTM =
    utm !== undefined &&
    typeof utm === 'object' &&
    Object.values(utm).some((v) => v && v !== 'direct');

  return `
  ${otherEntries.length > 0 ? `
  <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
    <h3 style="color: #e53e3e; margin-top: 0;">Weitere Angaben</h3>
    ${otherEntries.map(([key, value]) => `<p><strong>${esc(getFieldName(key))}:</strong> ${esc(value)}</p>`).join('')}
  </div>` : ''}
  ${hasUTM && utm ? `
  <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 15px;">
    <h3 style="color: #92400e; margin-top: 0;">📊 Google Ads Tracking</h3>
    ${utm.gclid ? `<p><strong>GCLID:</strong> <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">${esc(utm.gclid)}</code></p>` : ''}
    ${utm.source ? `<p><strong>Quelle:</strong> ${esc(utm.source)}</p>` : ''}
    ${utm.medium ? `<p><strong>Medium:</strong> ${esc(utm.medium)}</p>` : ''}
    ${utm.campaign ? `<p><strong>Kampagne:</strong> ${esc(utm.campaign)}</p>` : ''}
    ${utm.term ? `<p><strong>Suchbegriff:</strong> ${esc(utm.term)}</p>` : ''}
    ${utm.content ? `<p><strong>Anzeige:</strong> ${esc(utm.content)}</p>` : ''}
  </div>` : ''}`;
}

function getInsuranceName(type: string): string {
  const names: Record<string, string> = {
    'haftpflicht': 'Haftpflichtversicherung',
    'wohngebaeude': 'Wohngebäudeversicherung',
    'hausrat': 'Hausratversicherung',
    'rechtsschutz': 'Rechtsschutzversicherung',
    'zahnzusatz': 'Zahnzusatzversicherung'
  };
  return names[type] || type;
}

function getFieldName(key: string): string {
  const fieldNames: Record<string, string> = {
    'current_treatment': 'Aktuelle Behandlung',
    'replacement_importance': 'Wichtigkeit von Zahnersatz',
    'coverage_type': 'Gewünschte Deckung',
    'damage_history': 'Schadenshistorie',
    'property_value': 'Immobilienwert',
    'building_type': 'Gebäudetyp',
    'legal_area': 'Rechtsbereich',
    'family_status': 'Familienstand',
    'has_existing': 'Bestehende Verträge',
    'timing_preference': 'Gewünschter Zeitpunkt',
    'sonstiges_text': 'Sonstiges (Freitext)',
  };
  return fieldNames[key] || key;
}
export function referenceFor(id: number): string {
  return `ST-${String(id).padStart(5, "0")}`;
}

// Eingangsbestätigung an den Kunden – ohne Anhänge, damit bei einer
// vertippten Adresse keine Unterlagen bei Fremden landen.
export async function sendReceipt(to: string, name: string, anliegen: string, reference: string): Promise<void> {
  if (!process.env.RESEND_API_KEY || !to) return;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2b211c;line-height:1.55">
      <p style="font-size:20px;font-family:Georgia,serif;margin:0 0 16px">Guten Tag ${esc(name)},</p>
      <p>Ihr Anliegen <strong>„${esc(anliegen)}“</strong> ist bei uns eingegangen.</p>
      <p style="background:#f6f1ea;padding:14px 16px;border-radius:6px">Ihre Vorgangsnummer: <strong style="color:#6b2350;font-size:18px">${esc(reference)}</strong></p>
      <p>Wir sehen uns Ihre Unterlagen persönlich an und melden uns, falls wir noch etwas brauchen. Bei Fragen nennen Sie einfach die Vorgangsnummer.</p>
      <p style="margin-top:24px">Freundliche Grüße<br>Morino Stübe<br><span style="color:#6a5b52">Agentur Stübe · Tel. 015566 771019</span></p>
      <p style="font-size:12px;color:#6a5b52;margin-top:24px">Diese E-Mail wurde automatisch versendet. Sie haben sie erhalten, weil diese Adresse im Service-Center angegeben wurde.</p>
    </div>`;
  const { error } = await resend.emails.send({
    from: "Agentur Stübe <dokumente@anfrage.ergo-stuebe.de>",
    to,
    subject: `Eingangsbestätigung ${reference}: ${anliegen}`,
    html,
  });
  if (error) console.error("Receipt email error:", JSON.stringify(error));
}
