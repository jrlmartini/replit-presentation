# Conatus Slides - Gerador de Apresentações

## Overview
Sistema gerador de apresentações (slides) em português-BR para a Conatus Ambiental. Usa pipeline LLM (planner + composer) via OpenAI para gerar decks de slides estruturados. Viewer web 16:9 com proteção por senha individual por apresentação.

## Architecture
- **Frontend**: React + Vite + TanStack Query + Wouter + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + Drizzle ORM + PostgreSQL (pg driver)
- **LLM**: OpenAI via Replit AI Integrations (gpt-5-mini) - planner + composer pipeline
- **Auth**: Senha por deck (bcryptjs), token de acesso temporário (1h)
- **Format**: 16:9 fixo, idioma pt-BR

## Key Concepts
- **Briefing**: Formulário estruturado para definir a apresentação
- **DeckPlan**: Plano gerado pelo LLM Planner (sequência de slides)
- **DeckAST**: Estrutura completa do deck com slides e componentes (JSON)
- **SlideTypes**: 11 templates canônicos (cover, closing, section_divider, agenda_light, agenda_dark, light_title_text_or_image, light_two_columns, light_chart_text, dark_title_text_or_image, dark_two_columns, dark_chart_text)
- **Components**: 8 tipos (text_block, bullet_list, image_block, agenda_list, chart_block, contact_block, tag, divider_label)

## Project Structure
```
shared/
  schema.ts          - DB tables (decks), Zod schemas, types
  slide-types.ts     - Slide type registry (11 types)
  theme-conatus.ts   - Theme tokens (colors, fonts, spacing)

server/
  routes.ts          - API routes (/api/generate, /api/deck/:id, /api/deck/:id/unlock, /api/deck/:id/meta, /api/decks)
  storage.ts         - Database CRUD via Drizzle ORM
  llm-pipeline.ts    - LLM planner + composer pipeline

client/src/
  pages/
    home.tsx         - Dashboard listing all decks
    create-deck.tsx  - Briefing form for new presentations
    deck-view.tsx    - Slide viewer with navigation
    deck-unlock.tsx  - Password unlock screen
  components/
    slides/          - 11 slide template components + SlideRenderer
    blocks/          - 8 component blocks (TextBlock, BulletList, etc.)
  
client/public/images/
  bg-cover.png, bg-light.png, bg-dark.png, bg-section.png, bg-closing.png
```

## API Endpoints
- `GET /api/decks` - List all decks (sanitized, no passwordHash)
- `GET /api/deck/:id/meta` - Get deck metadata (for unlock check)
- `POST /api/deck/:id/unlock` - Verify password, return access token
- `GET /api/deck/:id` - Get full deck (requires token if password-protected)
- `POST /api/generate` - Generate new deck from briefing via LLM pipeline

## User Preferences
- Language: pt-BR for all UI and generated content
- No mock data in presentations - use "[INSERIR DADO]" placeholders
- Theme: Conatus Ambiental green palette (#1a7a5c primary)
