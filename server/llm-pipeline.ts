import OpenAI from "openai";
import { z } from "zod";
import type { Briefing, DeckAst, Slide, SlideType, LayoutVariant } from "@shared/schema";
import { slideTypeRegistry, SLIDE_TYPES, layoutVariantRegistry, LEGACY_TYPE_MAP } from "@shared/slide-types";
import { generateImageBuffer } from "./replit_integrations/image/client";

const SLIDE_TYPE_ALIASES: Record<string, SlideType> = {
  agenda: "agenda_light",
  agenda_slide: "agenda_light",
  content: "light_content_layout",
  content_light: "light_content_layout",
  content_dark: "dark_content_layout",
  title_text: "light_content_layout",
  title_text_or_image: "light_content_layout",
  two_columns: "light_content_layout",
  chart_text: "light_chart_text",
  divider: "section_divider",
  section: "section_divider",
  close: "closing",
  end: "closing",
  icon_features: "light_icon_features",
  icons: "light_icon_features",
  features: "light_icon_features",
  light_title_text_or_image: "light_content_layout",
  dark_title_text_or_image: "dark_content_layout",
  light_two_columns: "light_content_layout",
  dark_two_columns: "dark_content_layout",
};

const LAYOUT_ALIASES: Record<string, { type: SlideType; layout: LayoutVariant }> = {
  two_columns: { type: "light_content_layout", layout: "two_cols_50_50" },
  light_two_columns: { type: "light_content_layout", layout: "two_cols_50_50" },
  dark_two_columns: { type: "dark_content_layout", layout: "two_cols_50_50" },
};

function normalizeSlideType(raw: string): SlideType {
  if (SLIDE_TYPES.includes(raw as SlideType)) {
    return raw as SlideType;
  }
  const normalized = raw.toLowerCase().trim();
  if (SLIDE_TYPES.includes(normalized as SlideType)) {
    return normalized as SlideType;
  }
  if (SLIDE_TYPE_ALIASES[normalized]) {
    console.warn(`[LLM Pipeline] Tipo de slide normalizado: "${raw}" → "${SLIDE_TYPE_ALIASES[normalized]}"`);
    return SLIDE_TYPE_ALIASES[normalized];
  }
  console.warn(`[LLM Pipeline] Tipo de slide desconhecido: "${raw}", usando fallback "light_content_layout"`);
  return "light_content_layout";
}

function normalizeLayoutVariant(raw?: string): LayoutVariant | undefined {
  if (!raw) return undefined;
  const normalized = raw.toLowerCase().trim();
  if (Object.keys(layoutVariantRegistry).includes(normalized)) {
    return normalized as LayoutVariant;
  }
  return undefined;
}

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

const CONTENT_TYPES_INFO = Object.entries(slideTypeRegistry)
  .filter(([_, meta]) => !meta.name.includes("title_text_or_image") && !meta.name.includes("two_columns") || meta.name.includes("content_layout") || meta.name.includes("icon_features"))
  .map(([key, meta]) => {
    let info = `- ${key}: ${meta.label} (${meta.variant}) - ${meta.description}`;
    if (meta.allowedLayouts && meta.allowedLayouts.length > 0) {
      info += `\n  Layout variants: ${meta.allowedLayouts.join(", ")}`;
    }
    return info;
  })
  .join("\n");

const deckPlanSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  slides: z.array(
    z.object({
      slideType: z.string(),
      layoutVariant: z.string().optional(),
      title: z.string(),
      intent: z.string(),
      keyPoints: z.array(z.string()),
    })
  ),
});

type DeckPlan = z.infer<typeof deckPlanSchema>;

function getAudienceGuidance(audience?: string, deckType?: string): string {
  const type = (audience || deckType || "").toLowerCase();
  if (type.includes("diretor") || type.includes("executiv") || type.includes("c-level")) {
    return `PÚBLICO DIRETORIA: Priorizar síntese, impacto e próximos passos. Frases curtas, títulos informativos, pouco texto por slide. Evitar detalhamento técnico excessivo.`;
  }
  if (type.includes("cliente") || type.includes("comercial") || type.includes("proposta")) {
    return `PÚBLICO CLIENTE: Priorizar clareza, aplicabilidade e proposta de valor. Linguagem objetiva, foco em benefício + processo + resultado esperado. Evitar tecnicismo em excesso e tom agressivamente comercial.`;
  }
  if (type.includes("treinamento") || type.includes("capacitação") || type.includes("didático")) {
    return `PÚBLICO TREINAMENTO: Priorizar progressão didática, explicação clara e organização lógica. Frases explicativas curtas, bullets com sequência lógica. Títulos que indiquem "o que será aprendido".`;
  }
  if (type.includes("projeto") || type.includes("p&d") || type.includes("técnico")) {
    return `PÚBLICO PROJETO/P&D: Priorizar precisão, rastreabilidade, método e status. Linguagem técnica clara. Estrutura: contexto → objetivo → execução → evidências → próximos passos.`;
  }
  return `Tom padrão técnico-institucional: profissional, confiável, claro, moderno, orientado a resultado, sem exagero comercial.`;
}

async function planDeck(briefing: Briefing): Promise<DeckPlan> {
  const audienceGuide = getAudienceGuidance(briefing.audience, briefing.deckType);

  const systemPrompt = `Você é o Planner de apresentações profissionais da Conatus Ambiental (consultoria ambiental brasileira).
Dado um briefing, gere um plano estruturado de deck (deck_plan) com a sequência de slides.

## PRINCÍPIOS DE DECISÃO (ordem de prioridade)
1. Clareza
2. Coerência narrativa
3. Aderência ao template
4. Precisão do conteúdo
5. Concisão
6. Estética (sem comprometer as anteriores)
Se houver conflito entre "ficar bonito" e "ficar claro", priorizar clareza.

## REGRAS GLOBAIS
- Idioma: SEMPRE pt-BR
- NUNCA invente dados numéricos — use "[INSERIR DADO]" como placeholder
- O deck DEVE começar com "cover" e terminar com "closing"
- Nunca crie slide types fora do registry oficial
- Nunca exponha informação sensível/confidencial
- Se o briefing for insuficiente, gere versão conservadora com placeholders

## SISTEMA DE TIPOS DE SLIDE

### Tipos base (sem layout variant):
- cover: Capa da apresentação
- closing: Slide de encerramento com contato
- section_divider: Separador de seção
- agenda_light / agenda_dark: Índice da apresentação

### Tipos de conteúdo com layout variant:
- light_content_layout / dark_content_layout: Layout flexível de conteúdo
  Variants possíveis:
  - single_col: coluna única com texto/bullets/imagem
  - two_cols_50_50: duas colunas iguais
  - two_cols_60_40: ênfase na esquerda
  - two_cols_40_60: ênfase na direita
  - three_cols_equal: três colunas iguais
  - three_cols_emphasis_left: ênfase na primeira coluna (50/25/25)
  - three_cols_emphasis_center: ênfase na central (25/50/25)

- light_icon_features / dark_icon_features: Features com ícones
  Variants possíveis:
  - icons_3_horizontal: 3 ícones lado a lado
  - icons_4_horizontal: 4 ícones lado a lado
  - icons_3_vertical_with_quote: 3 ícones à direita + frase destaque à esquerda

- light_chart_text / dark_chart_text: Gráfico + texto interpretativo
  Variants possíveis:
  - chart_left_text_right: gráfico à esquerda, texto à direita
  - text_left_chart_right: texto à esquerda, gráfico à direita

## GUIA DE SELEÇÃO DE SLIDES
Antes de escolher cada slide, pergunte: "Qual é a função deste slide na narrativa?"

SELEÇÃO POR INTENÇÃO:
- Abrir → cover
- Orientar o público → agenda_light / agenda_dark
- Separar blocos → section_divider
- Explicar uma ideia → *_content_layout (single_col ou two_cols)
- Listar benefícios/features → *_icon_features
- Comparar ou combinar duas coisas → *_content_layout (two_cols_*)
- Apresentar 3 pilares/áreas → *_content_layout (three_cols_*)
- Mostrar dado + interpretar → *_chart_text (SOMENTE se houver dados explícitos)
- Encerrar / contato → closing

QUANDO INCLUIR AGENDA: decks com 4+ tópicos OU 8+ slides. Omitir em decks curtos (até 5 slides).
QUANDO USAR SECTION_DIVIDER: transição clara de assunto em decks longos. Evitar excesso.
CHART_TEXT: SOMENTE quando houver dados explícitos no briefing. Nunca usar com dados inventados.
ICON_FEATURES: ideal para listar benefícios, pilares, diferenciais de serviço.

LIGHT vs DARK:
- Light: melhor para leitura, análise, didática
- Dark: melhor para destaque, impacto, contraste visual
- Não alternar mecanicamente a cada slide
- Manter consistência dentro de mesma subseção

SEQUÊNCIAS RECOMENDADAS:
- Genérica: cover → agenda → section_divider → conteúdo (mix light/dark) → closing
- Diretoria: cover → [agenda_dark] → contexto → problema x proposta → indicador → implicações → próximos passos → closing
- Treinamento: cover → agenda_light → [módulos com section_divider] → conceitos → exemplos → closing
- Projeto: cover → agenda → contexto/problema → objetivo/escopo → execução/etapas → resultados → encaminhamentos → closing

ANTI-PADRÕES A EVITAR:
- Usar *_content_layout + single_col para tudo (monotonia)
- Usar two_cols sem duas partes reais
- Usar *_chart_text sem dados explícitos
- Excesso de section_divider
- Agenda em deck muito curto
- Não variar layoutVariant entre slides de conteúdo

## ${audienceGuide}

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
      "layoutVariant": "variant (opcional, apenas para tipos com layout)",
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
  const audienceGuide = getAudienceGuidance(briefing.audience, briefing.deckType);

  const systemPrompt = `Você é o Composer de slides profissionais da Conatus Ambiental.
Dado um deck_plan, gere o deck_ast completo com todos os componentes de cada slide.

## PRINCÍPIOS DE DECISÃO (ordem de prioridade)
1. Clareza
2. Coerência narrativa
3. Aderência ao template
4. Precisão do conteúdo
5. Concisão
6. Estética (sem comprometer as anteriores)

## REGRAS GLOBAIS
- Idioma: SEMPRE pt-BR
- NUNCA invente dados numéricos — use "[INSERIR DADO]" como placeholder
- Use placeholder "[INSERIR IMAGEM]" para imagens
- Nunca crie campos arbitrários fora do schema
- Nunca exponha informação sensível/confidencial
- Se faltar informação, usar placeholders explícitos — nunca "esconder" lacunas com texto genérico

## GUIA DE ESTILO EDITORIAL

### Tom de voz (Conatus)
Tom padrão: técnico-institucional — profissional, confiável, claro, moderno, orientado a resultado.
${audienceGuide}

### Títulos
- Devem ser claros, específicos e informativos — antecipam o conteúdo do slide
- PREFERIR: "Objetivos e escopo do projeto", "Resultados preliminares do piloto"
- EVITAR: "Introdução", "Visão geral" (genéricos), "Informações", "Dados"
- Estilo: sentence case. Máximo 90 caracteres
- Evitar duas ideias diferentes no mesmo título

### Subtítulos
- Máximo 140 caracteres. Complementar ao título, não repetir
- Usar quando agrega contexto, delimita escopo ou informa recorte temporal

### Bullet lists (regras críticas)
- 1 ideia por bullet, linguagem direta
- OBRIGATÓRIO: paralelismo gramatical (todos começam com verbo, OU todos com substantivo)
  BOM: "Redução da variabilidade", "Melhoria da previsibilidade", "Apoio à tomada de decisão"
  RUIM: "Redução da variabilidade", "O processo ficou melhor", "Tomada de decisão com apoio"
- Máximo 5 bullets por lista (preferencialmente 3-5)
- Bullets curtos: sem ponto final
- Se ultrapassar 5, dividir em dois slides

### Texto corrido
- Parágrafos curtos, frases claras, sem excesso de subordinadas
- Priorizar leitura em tela (não texto de relatório)
- Evitar blocos densos, repetições e "enchimento"
- Máximo ~700 caracteres por bloco de texto

### Texto de gráficos (chart_text)
Estrutura obrigatória em 3 partes:
1. Observação: o que aconteceu
2. Leitura: o que isso significa
3. Implicação: por que importa
- NUNCA inserir gráfico sem dados explícitos
- Sempre acompanhar com interpretação textual
- Evitar repetir literalmente os números sem interpretação

### Linguagem (PT-BR)
- Sem gírias, sem frases de efeito genéricas, sem "marketingês"
- PREFERIR verbos de ação: reduzir, aumentar, melhorar, estruturar, implementar, validar, monitorar, otimizar
- EVITAR: revolucionário, disruptivo, garantido, sem precedentes, definitivo, perfeito, sempre/nunca sem base
- Números: nunca inventar. Sempre indicar unidade quando aplicável (%, R$, mg/L, m³, etc.)

### Placeholders permitidos
- [DADO A INFORMAR], [INSERIR IMAGEM], [INSERIR GRÁFICO COM DADOS], [NOME DO CLIENTE], [CONTATO], [PRÓXIMO PASSO]
- Nunca usar placeholders vagos ([COISA], [INFO])

## LIMITES DE TEXTO
- Título: máximo 90 caracteres
- Subtítulo: máximo 140 caracteres
- Bullets por lista: máximo 5
- Cada bullet: máximo 110 caracteres
- Texto corrido: preferencialmente até 700 caracteres
- Agenda: 4-8 itens curtos

Se exceder: (1) resumir, (2) dividir em bullets, (3) dividir em dois slides.

## CHECKLIST ANTES DE FINALIZAR
- Todo conteúdo está em PT-BR?
- Títulos são claros e informativos (não genéricos)?
- Bullets estão paralelos e objetivos?
- Nenhum dado foi inventado?
- Placeholders explícitos onde faltam informações?
- Tom adequado ao público?
- Nenhum slide está denso demais?

## TIPOS DE COMPONENTES
- text_block: { content: "texto" }
- bullet_list: { content: ["item1", "item2"] }
- image_block: { content: { src: "[INSERIR IMAGEM]", alt: "descrição contextual" } }
- agenda_list: { content: ["item1", "item2"] }
- chart_block: { content: { chartType: "bar|line", title: "título", data: [{"name":"label","value":0}] } } (use valor 0 como placeholder)
- contact_block: { content: { name: "Conatus Ambiental", email: "[INSERIR EMAIL]", phone: "[INSERIR TELEFONE]", website: "[INSERIR SITE]" } }
- tag: { content: "TAG" }
- divider_label: { content: "RÓTULO" }
- icon_feature_item: { content: { iconName: "nome-do-icone-lucide", title: "Título do Feature", text: "Descrição breve" } }

## SISTEMA DE LAYOUT E SLOTS

### Para slides *_content_layout:
O campo "layout" é obrigatório e define a disposição dos componentes.
Layout variants e seus slots:
- single_col → slots: "header" (tag opcional), "main" (text_block, bullet_list, image_block)
- two_cols_50_50 / two_cols_60_40 / two_cols_40_60 → slots: "header", "col_1", "col_2"
- three_cols_equal / three_cols_emphasis_left / three_cols_emphasis_center → slots: "header", "col_1", "col_2", "col_3"

### Para slides *_icon_features:
- icons_3_horizontal / icons_4_horizontal → slots: "header" (tag opcional), "icon_items" (icon_feature_item)
- icons_3_vertical_with_quote → slots: "header", "left_emphasis" (text_block), "right_icon_items" (icon_feature_item)

### Para slides *_chart_text:
- chart_left_text_right / text_left_chart_right → slots: "header", "chart_area" (chart_block), "text_area" (text_block, bullet_list)

## EXEMPLOS DE ESTRUTURA

### Exemplo: light_content_layout com two_cols_60_40
{
  "id": "slide-3",
  "type": "light_content_layout",
  "layout": { "variant": "two_cols_60_40" },
  "title": "Diagnóstico e proposta de ação",
  "components": [
    { "id": "comp-3-1", "componentType": "tag", "slot": "header", "content": "DIAGNÓSTICO" },
    { "id": "comp-3-2", "componentType": "text_block", "slot": "col_1", "content": "Descrição da situação..." },
    { "id": "comp-3-3", "componentType": "bullet_list", "slot": "col_2", "content": ["Ação 1", "Ação 2", "Ação 3"] }
  ]
}

### Exemplo: dark_icon_features com icons_3_horizontal
{
  "id": "slide-5",
  "type": "dark_icon_features",
  "layout": { "variant": "icons_3_horizontal" },
  "title": "Nossos diferenciais",
  "components": [
    { "id": "comp-5-1", "componentType": "tag", "slot": "header", "content": "DIFERENCIAIS" },
    { "id": "comp-5-2", "componentType": "icon_feature_item", "slot": "icon_items", "content": { "iconName": "shield-check", "title": "Segurança", "text": "Protocolos rigorosos de segurança em campo" } },
    { "id": "comp-5-3", "componentType": "icon_feature_item", "slot": "icon_items", "content": { "iconName": "leaf", "title": "Sustentabilidade", "text": "Compromisso com práticas sustentáveis" } },
    { "id": "comp-5-4", "componentType": "icon_feature_item", "slot": "icon_items", "content": { "iconName": "bar-chart-2", "title": "Dados", "text": "Decisões baseadas em evidências e dados" } }
  ]
}

### Exemplo: light_chart_text com chart_left_text_right
{
  "id": "slide-7",
  "type": "light_chart_text",
  "layout": { "variant": "chart_left_text_right" },
  "title": "Evolução dos indicadores ambientais",
  "components": [
    { "id": "comp-7-1", "componentType": "chart_block", "slot": "chart_area", "content": { "chartType": "bar", "title": "Índice de conformidade", "data": [{"name":"2021","value":0},{"name":"2022","value":0},{"name":"2023","value":0}] } },
    { "id": "comp-7-2", "componentType": "text_block", "slot": "text_area", "content": "[INSERIR DADO]: observação sobre tendência..." },
    { "id": "comp-7-3", "componentType": "bullet_list", "slot": "text_area", "content": ["Conformidade crescente no período", "Meta atingida em [INSERIR DADO]"] }
  ]
}

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
      "layout": { "variant": "layout_variant" },
      "title": "string",
      "subtitle": "string (opcional)",
      "notes": "string (opcional)",
      "components": [
        {
          "id": "comp-N",
          "componentType": "tipo",
          "slot": "slot_name",
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
${briefing.audience ? `Público: ${briefing.audience}` : ""}
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

  parsed.slides = (parsed.slides || []).map((slide: any, i: number) => {
    const normalizedType = normalizeSlideType(slide.type || "light_content_layout");

    const layoutAlias = LAYOUT_ALIASES[slide.type?.toLowerCase?.()];
    let layoutVariant = normalizeLayoutVariant(slide.layout?.variant || slide.layoutVariant);

    if (!layoutVariant && layoutAlias) {
      layoutVariant = layoutAlias.layout;
    }

    const legacy = LEGACY_TYPE_MAP[slide.type];
    if (!layoutVariant && legacy) {
      layoutVariant = legacy.layout as LayoutVariant;
    }

    const meta = slideTypeRegistry[normalizedType];
    if (!layoutVariant && meta?.defaultLayout) {
      layoutVariant = meta.defaultLayout;
    }

    return {
      id: slide.id || `slide-${i + 1}`,
      type: normalizedType,
      layout: layoutVariant ? { variant: layoutVariant } : undefined,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      notes: slide.notes || "",
      components: (slide.components || []).map((comp: any, j: number) => ({
        id: comp.id || `comp-${i + 1}-${j + 1}`,
        componentType: comp.componentType || "text_block",
        slot: comp.slot,
        content: comp.content || "",
      })),
    };
  });

  return parsed as DeckAst;
}

async function generateSlideImages(ast: DeckAst, briefing: Briefing): Promise<DeckAst> {
  const imagePrompts: Array<{ slideIndex: number; compIndex: number; prompt: string }> = [];

  ast.slides.forEach((slide, si) => {
    slide.components.forEach((comp, ci) => {
      if (comp.componentType === "image_block") {
        const content = comp.content as any;
        const src = typeof content === "object" ? content?.src : content;
        if (!src || src === "[INSERIR IMAGEM]") {
          const context = `${briefing.title}. ${slide.title || ""}. ${typeof content === "object" && content?.alt ? content.alt : ""}`;
          const prompt = `Infográfico profissional para apresentação corporativa de consultoria ambiental. Contexto: ${context}. Estilo: limpo, moderno, cores verdes naturais, fundo branco, sem texto, adequado para slide de apresentação. Alta qualidade, design flat.`;
          imagePrompts.push({ slideIndex: si, compIndex: ci, prompt });
        }
      }
    });
  });

  if (imagePrompts.length === 0) return ast;

  console.log(`[LLM Pipeline] Gerando ${imagePrompts.length} imagens...`);

  for (const { slideIndex, compIndex, prompt } of imagePrompts) {
    try {
      console.log(`[LLM Pipeline] Gerando imagem para slide ${slideIndex + 1}, componente ${compIndex + 1}...`);
      const imageBuffer = await withRetry(() => generateImageBuffer(prompt, "512x512"), 2);
      const base64 = imageBuffer.toString("base64");
      const dataUri = `data:image/png;base64,${base64}`;
      ast.slides[slideIndex].components[compIndex].content = {
        src: dataUri,
        alt: prompt.slice(0, 100),
      };
      console.log(`[LLM Pipeline] Imagem gerada para slide ${slideIndex + 1}`);
    } catch (err: any) {
      console.warn(`[LLM Pipeline] Falha ao gerar imagem para slide ${slideIndex + 1}: ${err.message}`);
    }
  }

  return ast;
}

export async function generateDeck(briefing: Briefing): Promise<DeckAst> {
  console.log("[LLM Pipeline] Etapa 1: Planejamento...");
  const plan = await planDeck(briefing);
  console.log(`[LLM Pipeline] Plano gerado: ${plan.slides.length} slides`);

  console.log("[LLM Pipeline] Etapa 2: Composição...");
  const ast = await composeDeck(briefing, plan);
  console.log(`[LLM Pipeline] AST gerado: ${ast.slides.length} slides`);

  console.log("[LLM Pipeline] Etapa 3: Geração de imagens...");
  const astWithImages = await generateSlideImages(ast, briefing);
  console.log("[LLM Pipeline] Pipeline concluído.");

  return astWithImages;
}
