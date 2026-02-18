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

  app.post("/api/callback/submit", async (req, res) => {
    try {
      const { name, phone, callbackTime, topic } = req.body;

      if (!name || !phone || !callbackTime) {
        return res.status(400).json({ message: "Missing required fields" });
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
