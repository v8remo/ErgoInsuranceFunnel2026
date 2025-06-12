import { users, leads, type User, type InsertUser, type Lead, type InsertLead } from "@shared/schema";
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
    let query = db.select().from(leads);
    
    const conditions = [];
    if (filters?.insuranceType) {
      conditions.push(eq(leads.insuranceType, filters.insuranceType));
    }
    if (filters?.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(leads.createdAt));
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
}

export const storage = new DatabaseStorage();
