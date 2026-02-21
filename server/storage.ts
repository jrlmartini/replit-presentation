import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, desc } from "drizzle-orm";
import { decks, type Deck, type InsertDeck } from "@shared/schema";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

export interface IStorage {
  createDeck(deck: InsertDeck): Promise<Deck>;
  getDeck(id: string): Promise<Deck | undefined>;
  getDeckMeta(id: string): Promise<{ id: string; title: string; isPasswordProtected: boolean } | undefined>;
  listDecks(): Promise<Deck[]>;
  updateDeck(id: string, updates: Partial<InsertDeck>): Promise<Deck | undefined>;
}

class DatabaseStorage implements IStorage {
  async createDeck(insertDeck: InsertDeck): Promise<Deck> {
    const [deck] = await db.insert(decks).values(insertDeck).returning();
    return deck;
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck;
  }

  async getDeckMeta(id: string): Promise<{ id: string; title: string; isPasswordProtected: boolean } | undefined> {
    const [deck] = await db
      .select({ id: decks.id, title: decks.title, isPasswordProtected: decks.isPasswordProtected })
      .from(decks)
      .where(eq(decks.id, id));
    return deck ? { id: deck.id, title: deck.title, isPasswordProtected: deck.isPasswordProtected ?? true } : undefined;
  }

  async listDecks(): Promise<Deck[]> {
    return db.select().from(decks).orderBy(desc(decks.createdAt));
  }

  async updateDeck(id: string, updates: Partial<InsertDeck>): Promise<Deck | undefined> {
    const [deck] = await db.update(decks).set(updates).where(eq(decks.id, id)).returning();
    return deck;
  }
}

export const storage = new DatabaseStorage();
