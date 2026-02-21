# Conatus Slides - Gerador de Apresentações

## Overview
Sistema gerador de apresentações (slides) em português-BR para a Conatus Ambiental. Usa pipeline LLM (planner + composer + gerador de imagens) via OpenAI para gerar decks de slides estruturados. Viewer web 16:9 com proteção por senha individual por apresentação. Editor de slides inline para editar conteúdo após geração.

## Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (pg driver)
- **LLM**: OpenAI via Replit AI Integrations (gpt-5-mini para texto, gpt-image-1 para imagens)
- **Auth**: Senha por deck (bcryptjs), token de acesso temporário (1h)
- **Format**: 16:9 fixo, idioma pt-BR

## Key Concepts
- **Briefing**: Formulário estruturado para definir a apresentação
- **DeckPlan**: Plano gerado pelo LLM Planner (sequência de slides)
- **DeckAST**: Estrutura completa do deck com slides e componentes (JSON)
- **SlideTypes**: 11 templates canônicos (cover, closing, section_divider, agenda_light, agenda_dark, light_title_text_or_image, light_two_columns, light_chart_text, dark_title_text_or_image, dark_two_columns, dark_chart_text)
- **Components**: 8 tipos (text_block, bullet_list, image_block, agenda_list, chart_block, contact_block, tag, divider_label)
- **SlideEditor**: Painel lateral de edição inline com auto-save (debounce 2s)

## Project Structure
```
shared/
  schema.ts          - DB tables (decks), Zod schemas, types
  slide-types.ts     - Slide type registry (11 types)
  theme-conatus.ts   - Theme tokens (colors, fonts, spacing)

server/
  routes.ts          - API routes (generate, deck CRUD, image generation)
  storage.ts         - Database CRUD via Drizzle ORM
  llm-pipeline.ts    - LLM planner + composer + image generation pipeline
  replit_integrations/
    image/           - OpenAI gpt-image-1 integration (client.ts, routes.ts)
    batch/           - Batch processing utilities
    chat/            - Chat integration (not used directly)

client/src/
  pages/
    home.tsx         - Dashboard listing all decks
    create-deck.tsx  - Briefing form for new presentations
    deck-view.tsx    - Slide viewer with navigation + editor integration
    deck-unlock.tsx  - Password unlock screen
  components/
    slides/
      SlideRenderer.tsx  - Routes slide type to template component
      SlideEditor.tsx    - Inline editor panel for editing slide components
      CoverSlide.tsx, ClosingSlide.tsx, SectionDividerSlide.tsx,
      AgendaSlide.tsx, ContentSlide.tsx, TwoColumnsSlide.tsx,
      ChartTextSlide.tsx, SlideWrapper.tsx
    blocks/          - 8 component blocks (TextBlock, BulletList, ImageBlock, etc.)
  
client/public/images/
  bg-cover.png, bg-light.png, bg-dark.png, bg-section.png, bg-closing.png
```

## API Endpoints
- `GET /api/decks` - List all decks (sanitized, no passwordHash)
- `GET /api/deck/:id/meta` - Get deck metadata (for unlock check)
- `POST /api/deck/:id/unlock` - Verify password, return access token
- `GET /api/deck/:id` - Get full deck (requires token if password-protected)
- `PATCH /api/deck/:id` - Update deck's deckAst (requires token, validates structure)
- `POST /api/deck/:id/generate-image` - Generate image via AI for a specific slide component
- `POST /api/generate-image` - Generic image generation endpoint (from integration)
- `POST /api/generate` - Generate new deck from briefing via LLM pipeline (3 steps: plan, compose, images)

## LLM Pipeline
1. **Planner** (gpt-5-mini): Generates deck_plan with slide sequence from briefing
2. **Composer** (gpt-5-mini): Generates full deck_ast with components from plan
3. **Image Generator** (gpt-image-1): Auto-generates images for image_block placeholders

## User Preferences
- Language: pt-BR for all UI and generated content
- No mock data in presentations - use "[INSERIR DADO]" placeholders
- Theme: Conatus Ambiental green palette (#1a7a5c primary)
