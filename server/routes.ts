import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import multer from "multer";
import { storage } from "./storage";
import { insertLeadSchema, insertContentSchema } from "@shared/schema";
import { z } from "zod";
import { sendLeadNotification } from "./email";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'attached_assets/');
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${timestamp}_${originalName}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Static file serving for attached assets
  app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));
  
  // Image upload endpoint
  app.post('/api/upload-image', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
      
      const imageUrl = `/attached_assets/${req.file.filename}`;
      res.json({ 
        success: true, 
        imageUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });
  
  // Lead management routes
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Send email notification asynchronously
      sendLeadNotification(lead).catch(error => {
        console.error('Failed to send lead notification email:', error);
      });
      
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create lead" });
      }
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const { insuranceType, status } = req.query;
      const leads = await storage.getLeads({
        insuranceType: insuranceType as string,
        status: status as string,
      });
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const lead = await storage.updateLead(id, updates);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLead(id);
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Export leads as CSV
  app.get("/api/leads/export/csv", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      
      // Create CSV content
      const headers = ['ID', 'Date', 'Insurance Type', 'Name', 'Email', 'Phone', 'Location', 'Age', 'Status'];
      const csvRows = leads.map(lead => [
        lead.id,
        lead.createdAt?.toISOString().split('T')[0] || '',
        lead.insuranceType,
        `${lead.firstName} ${lead.lastName}`,
        lead.email,
        lead.phone,
        lead.location,
        lead.age,
        lead.status
      ]);
      
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export leads" });
    }
  });

  // Content management routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:type/:identifier", async (req, res) => {
    try {
      const { type, identifier } = req.params;
      const content = await storage.getContent(type, identifier);
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ message: "Content not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const contentData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(contentData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid content data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create content" });
      }
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const content = await storage.updateContent(id, updates);
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ message: "Content not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContent(id);
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Admin authentication with database stored password
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      // Check if admin password is set in database
      const adminPassword = await storage.getAdminConfig('admin_password');
      
      // If no password set in database, use default
      const expectedPassword = adminPassword ? adminPassword.configValue : "ERGOsicher2025!";
      
      if (password === expectedPassword) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Authentication error" });
    }
  });

  // Change admin password
  app.post("/api/admin/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password
      const adminPassword = await storage.getAdminConfig('admin_password');
      const expectedPassword = adminPassword ? adminPassword.configValue : "ERGOsicher2025!";
      
      if (currentPassword !== expectedPassword) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }
      
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
      }
      
      // Update password
      await storage.updateAdminPassword(newPassword);
      
      res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update password" });
    }
  });

  // Document submission endpoint
  app.post("/api/documents/submit", async (req, res) => {
    try {
      const { documentType, customerName, customerEmail, customerPhone, summary, pdfBase64 } = req.body;

      if (!documentType || !customerName || !customerEmail) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #003781; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">📄 Neues Dokument eingegangen</h1>
            <p style="margin: 10px 0 0 0;">ergo-stuebe.de · Dokumenten-Service</p>
          </div>
          <div style="padding: 20px; background-color: #f7f7f7;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p><strong>Dokumenttyp:</strong> ${documentType}</p>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>E-Mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              <p><strong>Telefon:</strong> ${customerPhone || '-'}</p>
              <p><strong>Eingereicht am:</strong> ${now}</p>
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 8px;">
              <h3 style="color: #003781; margin-top: 0;">Zusammenfassung</h3>
              <pre style="white-space: pre-wrap; font-family: Arial; font-size: 14px;">${summary || '-'}</pre>
            </div>
          </div>
          <div style="padding: 10px 20px; font-size: 12px; color: #666; text-align: center;">
            Das signierte PDF wurde als Anhang beigefügt (falls unterstützt) oder kann vom Kunden heruntergeladen werden.
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const attachments = pdfBase64 ? [{
          filename: `${documentType.replace(/\s/g, '_')}_${customerName.replace(/\s/g, '_')}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
        }] : [];

        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resendClient.emails.send({
          from: 'ERGO Dokumente <onboarding@resend.dev>',
          to: 'stuebe@shopgrow.de',
          subject: `📄 Neues Dokument: ${documentType} – ${customerName} – ${now}`,
          html: emailHtml,
          attachments,
        });

        if (error) {
          console.error('Resend email error:', JSON.stringify(error));
          return res.json({ success: true, emailSent: false, emailError: error.message });
        }
        console.log('Document email sent successfully:', data?.id);
        return res.json({ success: true, emailSent: true });
      }

      console.warn('No RESEND_API_KEY configured, skipping email');
      res.json({ success: true, emailSent: false });
    } catch (error) {
      console.error('Document submission error:', error);
      res.status(500).json({ message: "Failed to submit document" });
    }
  });

  // Schaden (damage report) submission endpoint
  app.post("/api/schaden/submit", async (req, res) => {
    try {
      const { damageType, customerName, customerEmail, customerPhone, insuranceNumber, damageDate, damageLocation, damageDescription, policeReport, estimatedDamage, extraFields, attachmentsCount, summary, fileAttachments } = req.body;

      if (!damageType || !customerName || !customerEmail || !damageDescription) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (fileAttachments && Array.isArray(fileAttachments)) {
        if (fileAttachments.length > 5) {
          return res.status(400).json({ message: "Maximal 5 Dateien erlaubt" });
        }
        const totalSize = fileAttachments.reduce((sum: number, f: any) => sum + (f.content?.length || 0), 0);
        if (totalSize > 25 * 1024 * 1024) {
          return res.status(400).json({ message: "Dateien zu groß. Maximal 25 MB insgesamt." });
        }
      }

      const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #E2001A; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🚨 Neue Schadensmeldung</h1>
            <p style="margin: 10px 0 0 0;">ergo-stuebe.de · Schaden-Service</p>
          </div>
          <div style="padding: 20px; background-color: #f7f7f7;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #E2001A; margin-top: 0;">Schadendetails</h3>
              <p><strong>Schadensart:</strong> ${damageType}</p>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>E-Mail:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              <p><strong>Telefon:</strong> ${customerPhone || '-'}</p>
              <p><strong>Versicherungsnummer:</strong> ${insuranceNumber || '-'}</p>
              <p><strong>Schadendatum:</strong> ${damageDate || '-'}</p>
              <p><strong>Schadenort:</strong> ${damageLocation || '-'}</p>
              <p><strong>Polizeilich gemeldet:</strong> ${policeReport || '-'}</p>
              <p><strong>Geschätzter Schaden:</strong> ${estimatedDamage ? estimatedDamage + ' €' : '-'}</p>
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Beschreibung</h3>
              <pre style="white-space: pre-wrap; font-family: Arial; font-size: 14px;">${damageDescription}</pre>
            </div>
            ${extraFields ? `<div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Zusätzliche Angaben</h3>
              <pre style="white-space: pre-wrap; font-family: Arial; font-size: 14px;">${extraFields}</pre>
            </div>` : ''}
            ${attachmentsCount ? `<div style="background-color: #fff3cd; padding: 10px 15px; border-radius: 8px; font-size: 14px;">📎 ${attachmentsCount} Datei(en) angehängt – bitte im Admin-Dashboard prüfen oder Kunden kontaktieren.</div>` : ''}
          </div>
          <div style="padding: 10px 20px; font-size: 12px; color: #666; text-align: center;">
            Eingereicht am ${now} über ergo-stuebe.de
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const attachments = (fileAttachments || []).map((f: { filename: string; content: string }) => ({
          filename: f.filename,
          content: Buffer.from(f.content, 'base64'),
        }));

        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resendClient.emails.send({
          from: 'ERGO Schadensmeldung <onboarding@resend.dev>',
          to: 'stuebe@shopgrow.de',
          subject: `🚨 Schadensmeldung: ${damageType} – ${customerName} – ${now}`,
          html: emailHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (error) {
          console.error('Resend schaden email error:', JSON.stringify(error));
          return res.json({ success: true, emailSent: false, emailError: error.message });
        }
        console.log('Schaden email sent successfully:', data?.id);
        return res.json({ success: true, emailSent: true });
      }

      console.warn('No RESEND_API_KEY configured, skipping schaden email');
      res.json({ success: true, emailSent: false });
    } catch (error) {
      console.error('Schaden submission error:', error);
      res.status(500).json({ message: "Failed to submit damage report" });
    }
  });

  app.post("/api/kennzeichen/submit", async (req, res) => {
    try {
      const body = req.body;
      const requestType = body.requestType;

      if (!requestType || !body.vorname || !body.nachname || !body.email) {
        return res.status(400).json({ message: "Pflichtfelder fehlen" });
      }

      if (requestType !== 'evb' && requestType !== 'kennzeichen') {
        return res.status(400).json({ message: "Ungültiger Antragstyp" });
      }

      const vorname = String(body.vorname).trim().slice(0, 200);
      const nachname = String(body.nachname).trim().slice(0, 200);
      const email = String(body.email).trim().slice(0, 200);
      const telefon = body.telefon ? String(body.telefon).trim().slice(0, 30) : '';
      const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

      const isEvb = requestType === 'evb';
      const typeLabel = isEvb ? 'eVB-Nummer (Kfz)' : 'Versicherungskennzeichen';

      const personalRows = [
        `<p><strong>Name:</strong> ${vorname} ${nachname}</p>`,
        body.geburtsdatum ? `<p><strong>Geburtsdatum:</strong> ${body.geburtsdatum}</p>` : '',
        body.strasse ? `<p><strong>Adresse:</strong> ${body.strasse}, ${body.plz || ''} ${body.ort || ''}</p>` : '',
        `<p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>`,
        telefon ? `<p><strong>Telefon:</strong> <a href="tel:${telefon}">${telefon}</a></p>` : '',
      ].filter(Boolean).join('');

      const vehicleFields: string[] = [];
      if (body.fahrzeugart) vehicleFields.push(`<p><strong>Fahrzeugart:</strong> ${body.fahrzeugart}</p>`);
      if (body.fahrzeughersteller) vehicleFields.push(`<p><strong>Hersteller:</strong> ${body.fahrzeughersteller}</p>`);
      if (body.fahrzeugmodell) vehicleFields.push(`<p><strong>Modell:</strong> ${body.fahrzeugmodell}</p>`);
      if (body.fin) vehicleFields.push(`<p><strong>FIN:</strong> ${body.fin}</p>`);
      if (body.erstzulassung) vehicleFields.push(`<p><strong>Erstzulassung:</strong> ${body.erstzulassung}</p>`);
      if (body.jaehrlicheFahrleistung) vehicleFields.push(`<p><strong>Jährl. Fahrleistung:</strong> ${body.jaehrlicheFahrleistung}</p>`);
      if (body.hauptfahrer) vehicleFields.push(`<p><strong>Hauptfahrer:</strong> ${body.hauptfahrer === 'selbst' ? 'Versicherungsnehmer selbst' : 'Andere Person'}</p>`);
      if (body.hauptfahrerName) vehicleFields.push(`<p><strong>Hauptfahrer Name:</strong> ${body.hauptfahrerName}</p>`);
      if (body.hauptfahrerGeburtsdatum) vehicleFields.push(`<p><strong>Hauptfahrer Geburtsdatum:</strong> ${body.hauptfahrerGeburtsdatum}</p>`);
      if (body.bisherigVersicherer) vehicleFields.push(`<p><strong>Bisheriger Versicherer:</strong> ${body.bisherigVersicherer}</p>`);
      if (body.bisherigSfKlasse) vehicleFields.push(`<p><strong>SF-Klasse:</strong> ${body.bisherigSfKlasse}</p>`);
      if (body.hubraum) vehicleFields.push(`<p><strong>Hubraum:</strong> ${body.hubraum}</p>`);
      if (body.hoechstgeschwindigkeit) vehicleFields.push(`<p><strong>Höchstgeschwindigkeit:</strong> ${body.hoechstgeschwindigkeit}</p>`);
      if (body.bisherigVersichert === 'ja' && body.bisherigesKennzeichen) vehicleFields.push(`<p><strong>Bisheriges Kennzeichen:</strong> ${body.bisherigesKennzeichen}</p>`);

      const insuranceFields: string[] = [];
      if (body.versicherungsbeginn) insuranceFields.push(`<p><strong>Versicherungsbeginn:</strong> ${body.versicherungsbeginn}</p>`);
      if (isEvb) {
        const arten: string[] = ['Kfz-Haftpflicht'];
        if (body.versicherungsartTeilkasko) arten.push('Teilkasko');
        if (body.versicherungsartVollkasko) arten.push('Vollkasko');
        if (body.versicherungsartSchutzbrief) arten.push('Schutzbrief');
        insuranceFields.push(`<p><strong>Versicherungsart:</strong> ${arten.join(', ')}</p>`);
      }
      if (!isEvb && body.versicherungsumfang) {
        const umfangLabel = body.versicherungsumfang === 'haftpflicht' ? 'Nur Haftpflicht' : 'Haftpflicht + Teilkasko';
        insuranceFields.push(`<p><strong>Versicherungsumfang:</strong> ${umfangLabel}</p>`);
      }
      if (body.hinweise) insuranceFields.push(`<p><strong>Hinweise:</strong> ${body.hinweise}</p>`);

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #003781; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">${isEvb ? '🚗' : '🛵'} ${typeLabel}-Anfrage</h1>
            <p style="margin: 10px 0 0 0;">ergo-stuebe.de · Kennzeichen-Service</p>
          </div>
          <div style="padding: 20px; background-color: #f7f7f7;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Persönliche Daten</h3>
              ${personalRows}
            </div>
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Fahrzeugdaten</h3>
              ${vehicleFields.join('')}
            </div>
            ${insuranceFields.length > 0 ? `
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Versicherungsdetails</h3>
              ${insuranceFields.join('')}
            </div>` : ''}
          </div>
          <div style="padding: 10px 20px; font-size: 12px; color: #666; text-align: center;">
            Eingereicht am ${now} über ergo-stuebe.de/kennzeichen
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        const vehicleDesc = body.fahrzeughersteller ? `${body.fahrzeughersteller} ${body.fahrzeugmodell || ''}`.trim() : (body.fahrzeugart || '');
        const { data, error } = await resendClient.emails.send({
          from: 'ERGO Kennzeichen <onboarding@resend.dev>',
          to: 'stuebe@shopgrow.de',
          subject: `${isEvb ? '🚗 eVB-Anfrage' : '🛵 Versicherungskennzeichen'}: ${vorname} ${nachname} – ${vehicleDesc} – ${now}`,
          html: emailHtml,
        });

        if (error) {
          console.error('Resend kennzeichen email error:', JSON.stringify(error));
          return res.json({ success: true, emailSent: false, emailError: error.message });
        }
        console.log('Kennzeichen email sent successfully:', data?.id);
        return res.json({ success: true, emailSent: true });
      }

      console.warn('No RESEND_API_KEY configured, skipping kennzeichen email');
      res.json({ success: true, emailSent: false });
    } catch (error) {
      console.error('Kennzeichen submission error:', error);
      res.status(500).json({ message: "Fehler beim Einreichen der Anfrage" });
    }
  });

  app.post("/api/documents/upload", async (req, res) => {
    try {
      let { vorname, nachname, email, telefon, versicherungsnummer, schadennummer, beschreibung, fileAttachments } = req.body;

      if (!vorname || !nachname || !email || !versicherungsnummer) {
        return res.status(400).json({ message: "Pflichtfelder fehlen (Name, E-Mail, Versicherungsnummer)" });
      }

      vorname = String(vorname).trim().slice(0, 200);
      nachname = String(nachname).trim().slice(0, 200);
      email = String(email).trim().slice(0, 200);
      telefon = telefon ? String(telefon).trim().slice(0, 30) : '';
      versicherungsnummer = String(versicherungsnummer).trim().slice(0, 100);
      schadennummer = schadennummer ? String(schadennummer).trim().slice(0, 100) : '';
      beschreibung = beschreibung ? String(beschreibung).trim().slice(0, 2000) : '';

      if (fileAttachments && Array.isArray(fileAttachments)) {
        if (fileAttachments.length > 10) {
          return res.status(400).json({ message: "Maximal 10 Dateien erlaubt" });
        }
        const totalSize = fileAttachments.reduce((sum: number, f: any) => sum + (f.content?.length || 0), 0);
        if (totalSize > 25 * 1024 * 1024) {
          return res.status(400).json({ message: "Dateien zu groß. Maximal 25 MB insgesamt." });
        }
      }

      const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
      const fileCount = fileAttachments?.length || 0;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #003781; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">📎 Rechnung / Beleg eingereicht</h1>
            <p style="margin: 10px 0 0 0;">ergo-stuebe.de · Dokumenten-Upload</p>
          </div>
          <div style="padding: 20px; background-color: #f7f7f7;">
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Kundendaten</h3>
              <p><strong>Name:</strong> ${vorname} ${nachname}</p>
              <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Telefon:</strong> ${telefon || '-'}</p>
              <p><strong>Versicherungsnummer:</strong> ${versicherungsnummer}</p>
              ${schadennummer ? `<p><strong>Schadennummer:</strong> ${schadennummer}</p>` : ''}
            </div>
            ${beschreibung ? `
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #003781; margin-top: 0;">Beschreibung</h3>
              <pre style="white-space: pre-wrap; font-family: Arial; font-size: 14px;">${beschreibung}</pre>
            </div>` : ''}
            <div style="background-color: ${fileCount > 0 ? '#d4edda' : '#fff3cd'}; padding: 10px 15px; border-radius: 8px; font-size: 14px;">
              📎 ${fileCount} Datei(en) angehängt
            </div>
          </div>
          <div style="padding: 10px 20px; font-size: 12px; color: #666; text-align: center;">
            Eingereicht am ${now} über ergo-stuebe.de
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const attachments = (fileAttachments || []).map((f: { filename: string; content: string }) => ({
          filename: f.filename,
          content: Buffer.from(f.content, 'base64'),
        }));

        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resendClient.emails.send({
          from: 'ERGO Dokumente <onboarding@resend.dev>',
          to: 'stuebe@shopgrow.de',
          subject: `📎 Rechnung/Beleg: ${vorname} ${nachname} – VNR ${versicherungsnummer} – ${now}`,
          html: emailHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
        });

        if (error) {
          console.error('Resend upload email error:', JSON.stringify(error));
          return res.json({ success: true, emailSent: false, emailError: error.message });
        }
        console.log('Document upload email sent successfully:', data?.id);
        return res.json({ success: true, emailSent: true });
      }

      console.warn('No RESEND_API_KEY configured, skipping upload email');
      res.json({ success: true, emailSent: false });
    } catch (error) {
      console.error('Document upload submission error:', error);
      res.status(500).json({ message: "Fehler beim Einreichen der Dokumente" });
    }
  });

  app.post("/api/callback/submit", async (req, res) => {
    try {
      let { name, phone, callbackTime, topic } = req.body;

      if (!name || !phone || !callbackTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      name = String(name).trim().slice(0, 200);
      phone = String(phone).trim().slice(0, 30);
      callbackTime = String(callbackTime).trim().slice(0, 100);
      topic = topic ? String(topic).trim().slice(0, 200) : null;

      if (!name || !phone || !callbackTime) {
        return res.status(400).json({ message: "Fields must not be empty" });
      }

      const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #E2001A; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">📞 Rückruf-Anfrage</h1>
            <p style="margin: 10px 0 0 0;">ergo-stuebe.de · Rückruf-Widget</p>
          </div>
          <div style="padding: 20px; background-color: #f7f7f7;">
            <div style="background-color: white; padding: 15px; border-radius: 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Gewünschte Rückrufzeit:</strong> ${callbackTime}</p>
              <p><strong>Thema:</strong> ${topic || 'Nicht angegeben'}</p>
              <p><strong>Eingegangen am:</strong> ${now}</p>
            </div>
          </div>
        </div>
      `;

      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resendClient = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resendClient.emails.send({
          from: 'ERGO Rückruf <onboarding@resend.dev>',
          to: 'stuebe@shopgrow.de',
          subject: `📞 Rückruf-Anfrage: ${name} – ${callbackTime}`,
          html: emailHtml,
        });

        if (error) {
          console.error('Resend callback email error:', JSON.stringify(error));
          return res.json({ success: true, emailSent: false, emailError: error.message });
        }
        console.log('Callback email sent successfully:', data?.id);
        return res.json({ success: true, emailSent: true });
      }

      console.warn('No RESEND_API_KEY configured, skipping callback email');
      res.json({ success: true, emailSent: false });
    } catch (error) {
      console.error('Callback submission error:', error);
      res.status(500).json({ message: "Failed to submit callback request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
