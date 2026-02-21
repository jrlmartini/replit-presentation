import OpenAI from "openai";
import { z } from "zod";
import type { Briefing, DeckAst, Slide, SlideType } from "@shared/schema";
import { slideTypeRegistry } from "@shared/slide-types";

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isRateLimit = err?.status === 429 || err?.code === "rate_limit_exceeded";
      const delay = isRateLimit ? 5000 * (attempt + 1) : 2000 * (attempt + 1);
      console.warn(`[LLM] Tentativa ${attempt + 1}/${maxRetries} falhou: ${err.message}. Aguardando ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError || new Error("Todas as tentativas falharam");
}

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SLIDE_TYPES_INFO = Object.entries(slideTypeRegistry)
  .map(([key, meta]) => `- ${key}: ${meta.label} (${meta.variant}) - ${meta.description}`)
  .join("\n");

const deckPlanSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  slides: z.array(
    z.object({
      slideType: z.string(),
      title: z.string(),
      intent: z.string(),
      keyPoints: z.array(z.string()),
    })
  ),
});

type DeckPlan = z.infer<typeof deckPlanSchema>;

async function planDeck(briefing: Briefing): Promise<DeckPlan> {
  const systemPrompt = `Você é um planejador de apresentações profissionais da Conatus Ambiental (consultoria ambiental brasileira).
Dado um briefing, gere um plano estruturado de deck (deck_plan) com a sequência de slides.

REGRAS:
1. Idioma: SEMPRE pt-BR
2. NUNCA invente dados numéricos - use "[INSERIR DADO]" como placeholder
3. O deck DEVE começar com slide "cover" e terminar com "closing"
4. Use separadores de seção entre blocos temáticos se habilitado
5. Inclua agenda se habilitado
6. Respeite a meta de quantidade de slides (±2)
7. Alterne entre slides light e dark para ritmo visual
8. Cada slide deve ter propósito claro

TIPOS DE SLIDES DISPONÍVEIS:
${SLIDE_TYPES_INFO}

TIPO DE DECK: ${briefing.deckType}
TOM: ${briefing.tone}
${briefing.audience ? `PÚBLICO: ${briefing.audience}` : ""}
${briefing.objective ? `OBJETIVO: ${briefing.objective}` : ""}

Responda APENAS com JSON válido no formato:
{
  "title": "string",
  "subtitle": "string (opcional)",
  "slides": [
    {
      "slideType": "tipo_do_slide",
      "title": "título do slide",
      "intent": "propósito em 1 frase",
      "keyPoints": ["ponto 1", "ponto 2"]
    }
  ]
}`;

  const userPrompt = `Briefing:
- Título: ${briefing.title}
${briefing.subtitle ? `- Subtítulo: ${briefing.subtitle}` : ""}
- Tipo: ${briefing.deckType}
- Tom: ${briefing.tone}
- Meta de slides: ${briefing.slideCountTarget}
- Incluir agenda: ${briefing.structure.includeAgenda ? "Sim" : "Não"}
- Separadores de seção: ${briefing.structure.includeSectionDividers ? "Sim" : "Não"}
- Slides claros: ${briefing.structure.allowLightSlides ? "Sim" : "Não"}
- Slides escuros: ${briefing.structure.allowDarkSlides ? "Sim" : "Não"}
${briefing.promptNotes ? `- Notas adicionais: ${briefing.promptNotes}` : ""}

Gere o deck_plan em JSON.`;

  return withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 4096,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("LLM retornou resposta vazia no planner");

    const parsed = JSON.parse(content);
    return deckPlanSchema.parse(parsed);
  });
}

async function composeDeck(briefing: Briefing, plan: DeckPlan): Promise<DeckAst> {
  const systemPrompt = `Você é um compositor de slides profissionais da Conatus Ambiental.
Dado um deck_plan, gere o deck_ast completo com todos os componentes de cada slide.

REGRAS:
1. Idioma: SEMPRE pt-BR
2. NUNCA invente dados numéricos - use "[INSERIR DADO]" como placeholder  
3. Use placeholder "[INSERIR IMAGEM]" para imagens
4. Textos devem ser profissionais, concisos e objetivos
5. Bullet points: máximo 6 items por lista
6. Títulos: máximo 90 caracteres
7. Subtítulos: máximo 140 caracteres

TIPOS DE COMPONENTES:
- text_block: { content: "texto" }
- bullet_list: { content: ["item1", "item2"] }
- image_block: { content: { src: "[INSERIR IMAGEM]", alt: "descrição" } }
- agenda_list: { content: ["item1", "item2"] }
- chart_block: { content: { chartType: "bar|line", title: "título", data: [{"name":"label","value":0}] } } (use valor 0 como placeholder)
- contact_block: { content: { name: "Conatus Ambiental", email: "[INSERIR EMAIL]", phone: "[INSERIR TELEFONE]", website: "[INSERIR SITE]" } }
- tag: { content: "TAG" }
- divider_label: { content: "RÓTULO" }

Para slides two_columns, use slot: "left" ou slot: "right" nos componentes.

Responda APENAS com JSON válido no formato DeckAst:
{
  "deckId": "generated",
  "meta": {
    "title": "string",
    "subtitle": "string",
    "themeId": "conatus-v1",
    "language": "pt-BR",
    "format": "16:9",
    "createdAt": "ISO date",
    "version": "1.0.0"
  },
  "presentation": { "transition": "fade", "autoSlide": false },
  "slides": [
    {
      "id": "slide-N",
      "type": "slide_type",
      "title": "string",
      "subtitle": "string (opcional)",
      "notes": "string (opcional)",
      "components": [
        {
          "id": "comp-N",
          "componentType": "tipo",
          "slot": "string (opcional)",
          "content": "depende do tipo"
        }
      ]
    }
  ]
}`;

  const userPrompt = `Deck Plan:
${JSON.stringify(plan, null, 2)}

Tom: ${briefing.tone}
Tipo: ${briefing.deckType}
${briefing.promptNotes ? `Notas: ${briefing.promptNotes}` : ""}

Gere o deck_ast completo em JSON.`;

  const parsed = await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("LLM retornou resposta vazia no composer");
    return JSON.parse(content);
  });

  if (!parsed.meta) {
    parsed.meta = {
      title: plan.title,
      subtitle: plan.subtitle || "",
      themeId: "conatus-v1",
      language: "pt-BR",
      format: "16:9",
      createdAt: new Date().toISOString(),
      version: "1.0.0",
    };
  }
  if (!parsed.presentation) {
    parsed.presentation = { transition: "fade", autoSlide: false };
  }
  if (!parsed.deckId) {
    parsed.deckId = "generated";
  }

  parsed.slides = (parsed.slides || []).map((slide: any, i: number) => ({
    id: slide.id || `slide-${i + 1}`,
    type: slide.type || "light_title_text_or_image",
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    notes: slide.notes || "",
    components: (slide.components || []).map((comp: any, j: number) => ({
      id: comp.id || `comp-${i + 1}-${j + 1}`,
      componentType: comp.componentType || "text_block",
      slot: comp.slot,
      content: comp.content || "",
    })),
  }));

  return parsed as DeckAst;
}

export async function generateDeck(briefing: Briefing): Promise<DeckAst> {
  console.log("[LLM Pipeline] Etapa 1: Planejamento...");
  const plan = await planDeck(briefing);
  console.log(`[LLM Pipeline] Plano gerado: ${plan.slides.length} slides`);

  console.log("[LLM Pipeline] Etapa 2: Composição...");
  const ast = await composeDeck(briefing, plan);
  console.log(`[LLM Pipeline] AST gerado: ${ast.slides.length} slides`);

  return ast;
}
