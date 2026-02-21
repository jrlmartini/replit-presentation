import type { Express, Request, Response } from "express";
import { type Server } from "http";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storage } from "./storage";
import { briefingSchema } from "@shared/schema";
import { generateDeck } from "./llm-pipeline";

const activeTokens = new Map<string, { deckId: string; expiresAt: number }>();

function createAccessToken(deckId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  activeTokens.set(token, { deckId, expiresAt: Date.now() + 3600000 });
  return token;
}

function validateToken(token: string, deckId: string): boolean {
  const entry = activeTokens.get(token);
  if (!entry) return false;
  if (entry.deckId !== deckId) return false;
  if (Date.now() > entry.expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  return true;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/decks", async (_req: Request, res: Response) => {
    try {
      const deckList = await storage.listDecks();
      const sanitized = deckList.map(d => ({
        id: d.id,
        title: d.title,
        subtitle: d.subtitle,
        deckType: d.deckType,
        isPasswordProtected: d.isPasswordProtected,
        status: d.status,
        slideCount: d.slideCount,
        createdAt: d.createdAt,
      }));
      res.json(sanitized);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/deck/:id/meta", async (req: Request, res: Response) => {
    try {
      const meta = await storage.getDeckMeta(req.params.id);
      if (!meta) return res.status(404).json({ message: "Deck não encontrado" });
      res.json(meta);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/deck/:id/unlock", async (req: Request, res: Response) => {
    try {
      const deck = await storage.getDeck(req.params.id);
      if (!deck) return res.status(404).json({ message: "Deck não encontrado" });

      if (!deck.isPasswordProtected || !deck.passwordHash) {
        const token = createAccessToken(deck.id);
        return res.json({ token });
      }

      const { password } = req.body;
      if (!password) return res.status(400).json({ message: "Senha obrigatória" });

      const match = await bcrypt.compare(password, deck.passwordHash);
      if (!match) return res.status(401).json({ message: "Senha incorreta" });

      const token = createAccessToken(deck.id);
      res.json({ token });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/deck/:id", async (req: Request, res: Response) => {
    try {
      const deck = await storage.getDeck(req.params.id);
      if (!deck) return res.status(404).json({ message: "Deck não encontrado" });

      if (deck.isPasswordProtected) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "") || req.query.token as string;
        if (!token || !validateToken(token, deck.id)) {
          return res.status(401).json({ message: "Acesso não autorizado. Desbloqueie com a senha." });
        }
      }

      const { passwordHash, ...safeDeck } = deck;
      res.json(safeDeck);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const parsed = briefingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Briefing inválido",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const briefing = parsed.data;

      const passwordHash = await bcrypt.hash(briefing.password, 10);

      const deckAst = await generateDeck(briefing);

      const deck = await storage.createDeck({
        title: briefing.title,
        subtitle: briefing.subtitle || null,
        deckType: briefing.deckType,
        audience: briefing.audience || null,
        objective: briefing.objective || null,
        tone: briefing.tone,
        language: "pt-BR",
        format: "16:9",
        isPasswordProtected: true,
        passwordHash,
        status: "ready",
        deckAst,
        slideCount: deckAst.slides.length,
      });

      res.json({ deckId: deck.id, slideCount: deckAst.slides.length });
    } catch (err: any) {
      console.error("[Generate] Error:", err);
      res.status(500).json({ message: err.message || "Erro ao gerar apresentação" });
    }
  });

  return httpServer;
}
