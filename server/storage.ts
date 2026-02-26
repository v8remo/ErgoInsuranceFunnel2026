import { users, leads, content, adminConfig, submissions, type User, type InsertUser, type Lead, type InsertLead, type Content, type InsertContent, type AdminConfig, type InsertAdminConfig, type Submission, type InsertSubmission } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead management methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: number): Promise<Lead | undefined>;
  getLeads(filters?: { insuranceType?: string; status?: string }): Promise<Lead[]>;
  updateLead(id: number, updates: Partial<Lead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<void>;
  getDashboardStats(): Promise<{
    totalLeads: number;
    weeklyLeads: number;
    conversionRate: number;
    openLeads: number;
  }>;
  
  // Content management methods
  getContent(type: string, identifier: string): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<void>;
  
  // Admin configuration methods
  getAdminConfig(key: string): Promise<AdminConfig | undefined>;
  setAdminConfig(key: string, value: string): Promise<AdminConfig>;
  updateAdminPassword(newPassword: string): Promise<void>;

  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(filters?: { type?: string; status?: string }): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
  updateSubmission(id: number, updates: Partial<Submission>): Promise<Submission | undefined>;
  deleteSubmission(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLead(leadData: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values({
        ...leadData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return lead;
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getLeads(filters?: { insuranceType?: string; status?: string }): Promise<Lead[]> {
    const conditions = [];
    if (filters?.insuranceType) {
      conditions.push(eq(leads.insuranceType, filters.insuranceType));
    }
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    
    if (conditions.length > 0) {
      return db.select().from(leads).where(and(...conditions)).orderBy(desc(leads.createdAt));
    }
    
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead | undefined> {
    const [lead] = await db
      .update(leads)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getDashboardStats(): Promise<{
    totalLeads: number;
    weeklyLeads: number;
    conversionRate: number;
    openLeads: number;
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total leads
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads);
    
    // Weekly leads
    const [weeklyResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo));
    
    // Open leads (new + contacted)
    const [openResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(sql`${leads.status} IN ('new', 'contacted')`);
    
    // Converted leads
    const [convertedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, 'converted'));

    const totalLeads = totalResult.count || 0;
    const weeklyLeads = weeklyResult.count || 0;
    const openLeads = openResult.count || 0;
    const convertedLeads = convertedResult.count || 0;
    
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100 * 10) / 10 : 0;

    return {
      totalLeads,
      weeklyLeads,
      conversionRate,
      openLeads
    };
  }

  // Content management methods
  async getContent(type: string, identifier: string): Promise<Content | undefined> {
    const [result] = await db.select().from(content).where(
      and(eq(content.type, type), eq(content.identifier, identifier))
    );
    return result || undefined;
  }

  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content).orderBy(content.type, content.identifier);
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const [result] = await db
      .insert(content)
      .values(contentData)
      .returning();
    return result;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const [result] = await db
      .update(content)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(content.id, id))
      .returning();
    return result || undefined;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(content).where(eq(content.id, id));
  }
  
  // Admin configuration methods
  async getAdminConfig(key: string): Promise<AdminConfig | undefined> {
    const [result] = await db.select().from(adminConfig).where(eq(adminConfig.configKey, key));
    return result || undefined;
  }

  async setAdminConfig(key: string, value: string): Promise<AdminConfig> {
    const existing = await this.getAdminConfig(key);
    if (existing) {
      const [updated] = await db
        .update(adminConfig)
        .set({ configValue: value, updatedAt: new Date() })
        .where(eq(adminConfig.configKey, key))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(adminConfig)
        .values({ configKey: key, configValue: value })
        .returning();
      return created;
    }
  }

  async updateAdminPassword(newPassword: string): Promise<void> {
    await this.setAdminConfig('admin_password', newPassword);
  }

  async createSubmission(submissionData: InsertSubmission): Promise<Submission> {
    const [result] = await db
      .insert(submissions)
      .values({ ...submissionData, createdAt: new Date(), updatedAt: new Date() })
      .returning();
    return result;
  }

  async getSubmissions(filters?: { type?: string; status?: string }): Promise<Submission[]> {
    const conditions = [];
    if (filters?.type) conditions.push(eq(submissions.type, filters.type));
    if (filters?.status) conditions.push(eq(submissions.status, filters.status));
    if (conditions.length > 0) {
      return db.select().from(submissions).where(and(...conditions)).orderBy(desc(submissions.createdAt));
    }
    return db.select().from(submissions).orderBy(desc(submissions.createdAt));
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    const [result] = await db.select().from(submissions).where(eq(submissions.id, id));
    return result || undefined;
  }

  async updateSubmission(id: number, updates: Partial<Submission>): Promise<Submission | undefined> {
    const [result] = await db
      .update(submissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(submissions.id, id))
      .returning();
    return result || undefined;
  }

  async deleteSubmission(id: number): Promise<void> {
    await db.delete(submissions).where(eq(submissions.id, id));
  }
}

export const storage = new DatabaseStorage();
