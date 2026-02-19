import { Resend } from 'resend';
import { Lead } from '@shared/schema';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not found - Email notifications will be disabled');
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
            <p><strong>Versicherungstyp:</strong> ${getInsuranceName(lead.insuranceType)}</p>
            <p><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
            <p><strong>E-Mail:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            <p><strong>Telefon:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
            <p><strong>PLZ:</strong> ${lead.location}</p>
            <p><strong>Alter:</strong> ${lead.age}</p>
            <p><strong>Eingegangen:</strong> ${new Date(lead.createdAt).toLocaleString('de-DE')}</p>
          </div>
          
          ${lead.specificData && Object.keys(lead.specificData).length > 0 ? `
          <div style="background-color: white; padding: 15px; border-radius: 8px;">
            <h3 style="color: #e53e3e; margin-top: 0;">Weitere Angaben</h3>
            ${Object.entries(lead.specificData).map(([key, value]) => 
              `<p><strong>${getFieldName(key)}:</strong> ${value}</p>`
            ).join('')}
          </div>
          ` : ''}
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
    'family_status': 'Familienstand'
  };
  return fieldNames[key] || key;
}