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
- **DeckPlan**: Plano gerado pelo LLM Planner (sequência de slides, com layoutVariant)
- **DeckAST**: Estrutura completa do deck com slides e componentes (JSON)
- **SlideTypes**: 15 tipos (cover, closing, section_divider, agenda_light, agenda_dark, light/dark_title_text_or_image [legado], light/dark_two_columns [legado], light/dark_chart_text, light/dark_content_layout, light/dark_icon_features)
- **LayoutVariant**: 12 variantes de layout (single_col, two_cols_50_50, two_cols_60_40, two_cols_40_60, three_cols_equal, three_cols_emphasis_left, three_cols_emphasis_center, icons_3_horizontal, icons_4_horizontal, icons_3_vertical_with_quote, chart_left_text_right, text_left_chart_right)
- **Slots**: Sistema de posicionamento de componentes (header, main, col_1, col_2, col_3, icon_items, left_emphasis, right_icon_items, chart_area, text_area)
- **Components**: 9 tipos (text_block, bullet_list, image_block, agenda_list, chart_block, contact_block, tag, divider_label, icon_feature_item)
- **SlideEditor**: Painel lateral de edição inline com auto-save (debounce 2s)
- **Backward Compatibility**: Tipos legados (light_title_text_or_image, light_two_columns, etc.) mapeados automaticamente para novos tipos semânticos via LEGACY_TYPE_MAP e resolveSlideRendering()

## Slide Type System
### Base types (com layout variant dedicado):
- cover → cover_standard (slots: header, hero_media, meta)
- closing → closing_standard (slots: header, main, contact_area)
- section_divider → section_divider_standard (slots: divider, subtext)
- agenda_light / agenda_dark → agenda_standard (slots: header, agenda_items)

### Content types (com layout variant):
- light_content_layout / dark_content_layout → single_col, two_cols_*, three_cols_*
- light_icon_features / dark_icon_features → icons_3_horizontal, icons_4_horizontal, icons_3_vertical_with_quote
- light_chart_text / dark_chart_text → chart_left_text_right, text_left_chart_right

### Legacy types (backward compatibility):
- light_title_text_or_image → light_content_layout + single_col
- dark_title_text_or_image → dark_content_layout + single_col
- light_two_columns → light_content_layout + two_cols_50_50
- dark_two_columns → dark_content_layout + two_cols_50_50

## Project Structure
```
config/
  README.md              - Índice da base de configuração
  docs/
    design-system.md     - Paleta de cores, tipografia, espaçamento, gradientes
    slide-types.md       - Tipos de slide, componentes, regras de composição
    llm-pipeline.md      - Pipeline de geração (planner → composer → images)
    backgrounds.md       - Backgrounds dos slides, como substituir/adicionar
    api-reference.md     - Referência completa da API REST
  assets/                - Assets fonte (PSDs, SVGs, logos)

shared/
  schema.ts              - DB tables (decks), Zod schemas, types (slideTypeEnum, layoutVariantEnum, slotEnum, componentTypeEnum)
  slide-types.ts         - Slide type registry (15 types), layout variant registry (12 variants), LEGACY_TYPE_MAP, resolveSlideRendering()
  theme-conatus.ts       - Theme tokens (colors, fonts, spacing, columnProportions, iconLayout)

server/
  routes.ts              - API routes (generate, deck CRUD, image generation)
  storage.ts             - Database CRUD via Drizzle ORM
  llm-pipeline.ts        - LLM planner + composer + image generation pipeline (with layout variant support)
  replit_integrations/
    image/               - OpenAI gpt-image-1 integration (client.ts, routes.ts)
    batch/               - Batch processing utilities
    chat/                - Chat integration (not used directly)

client/src/
  pages/
    home.tsx             - Dashboard listing all decks
    create-deck.tsx      - Briefing form for new presentations
    deck-view.tsx        - Slide viewer with navigation + editor integration
    deck-unlock.tsx      - Password unlock screen
  components/
    slides/
      SlideRenderer.tsx  - Routes slide type + layoutVariant to template component
      SlideEditor.tsx    - Inline editor panel for editing slide components (incl. icon_feature_item)
      CoverSlide.tsx, ClosingSlide.tsx, SectionDividerSlide.tsx,
      AgendaSlide.tsx, ContentSlide.tsx (multi-column support), TwoColumnsSlide.tsx,
      ChartTextSlide.tsx (chart_left/right), IconFeaturesSlide.tsx (3 layouts), SlideWrapper.tsx
    blocks/              - 9 component blocks (TextBlock, BulletList, ImageBlock, IconFeatureItem, etc.)
  
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
1. **Planner** (gpt-5-mini): Generates deck_plan with slide sequence and layoutVariant from briefing
2. **Composer** (gpt-5-mini): Generates full deck_ast with components, slots, and layout field from plan
3. **Image Generator** (gpt-image-1): Auto-generates images for image_block placeholders
4. **Normalization**: Aliases → canonical types, legacy types → semantic types, layout defaults applied

## Design Decisions
- theme-conatus.ts é a única fonte de verdade para todos os tokens visuais
- columnProportions e iconLayout definidos no tema para consistência
- resolveSlideRendering() centraliza lógica de resolução tipo+layout com fallback
- Estratégia aditiva: novos tipos coexistem com legados para backward compatibility
- Slot system com validação por layoutVariantRegistry

## User Preferences
- Language: pt-BR for all UI and generated content
- No mock data in presentations - use "[INSERIR DADO]" placeholders
- Theme: Conatus Ambiental green palette (#1a7a5c primary)
- Font: Outfit (headings and body)
