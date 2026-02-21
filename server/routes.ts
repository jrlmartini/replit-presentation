import type { Express, Request, Response } from "express";
import { type Server } from "http";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { storage } from "./storage";
import { briefingSchema, deckAstSchema } from "@shared/schema";
import { generateDeck } from "./llm-pipeline";
import { registerImageRoutes } from "./replit_integrations/image";
import { generateImageBuffer } from "./replit_integrations/image/client";

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

function extractToken(req: Request, deckId: string): boolean {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "") || (req.query.token as string | undefined);
  if (!token) return false;
  return validateToken(token, deckId);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  registerImageRoutes(app);

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
      const deckId = req.params.id as string;
      const meta = await storage.getDeckMeta(deckId);
      if (!meta) return res.status(404).json({ message: "Deck não encontrado" });
      res.json(meta);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/deck/:id/unlock", async (req: Request, res: Response) => {
    try {
      const deckId = req.params.id as string;
      const deck = await storage.getDeck(deckId);
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
      const deckId = req.params.id as string;
      const deck = await storage.getDeck(deckId);
      if (!deck) return res.status(404).json({ message: "Deck não encontrado" });

      if (deck.isPasswordProtected) {
        if (!extractToken(req, deck.id)) {
          return res.status(401).json({ message: "Acesso não autorizado. Desbloqueie com a senha." });
        }
      }

      const { passwordHash, ...safeDeck } = deck;
      res.json(safeDeck);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.patch("/api/deck/:id", async (req: Request, res: Response) => {
    try {
      const deckId = req.params.id as string;
      const deck = await storage.getDeck(deckId);
      if (!deck) return res.status(404).json({ message: "Deck não encontrado" });

      if (deck.isPasswordProtected) {
        if (!extractToken(req, deck.id)) {
          return res.status(401).json({ message: "Acesso não autorizado." });
        }
      }

      const { deckAst } = req.body;
      if (!deckAst) return res.status(400).json({ message: "deckAst é obrigatório" });

      if (!deckAst.slides || !Array.isArray(deckAst.slides)) {
        return res.status(400).json({ message: "deckAst.slides deve ser um array" });
      }
      if (!deckAst.meta || typeof deckAst.meta.title !== "string") {
        return res.status(400).json({ message: "deckAst.meta.title é obrigatório" });
      }

      const updated = await storage.updateDeck(deckId, {
        deckAst,
        slideCount: deckAst.slides.length,
      });

      if (!updated) return res.status(404).json({ message: "Falha ao atualizar" });

      const { passwordHash: _, ...safeDeck } = updated;
      res.json(safeDeck);
    } catch (err: any) {
      console.error("[PATCH deck] Error:", err);
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/deck/:id/generate-image", async (req: Request, res: Response) => {
    try {
      const deckId = req.params.id as string;
      const deck = await storage.getDeck(deckId);
      if (!deck) return res.status(404).json({ message: "Deck não encontrado" });

      if (deck.isPasswordProtected) {
        if (!extractToken(req, deck.id)) {
          return res.status(401).json({ message: "Acesso não autorizado." });
        }
      }

      const { prompt, slideIndex, componentIndex } = req.body;
      if (!prompt) return res.status(400).json({ message: "Prompt é obrigatório" });

      const imageBuffer = await generateImageBuffer(prompt, "1024x1024");
      const base64 = imageBuffer.toString("base64");
      const dataUri = `data:image/png;base64,${base64}`;

      if (slideIndex !== undefined && componentIndex !== undefined && deck.deckAst) {
        const ast = deck.deckAst as any;
        if (ast.slides?.[slideIndex]?.components?.[componentIndex]) {
          ast.slides[slideIndex].components[componentIndex].content = {
            src: dataUri,
            alt: prompt,
          };
          await storage.updateDeck(deckId, { deckAst: ast });
        }
      }

      res.json({ dataUri, prompt });
    } catch (err: any) {
      console.error("[Generate Image] Error:", err);
      res.status(500).json({ message: err.message || "Erro ao gerar imagem" });
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
