import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const decks = pgTable("decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  deckType: text("deck_type").notNull().default("projeto"),
  audience: text("audience"),
  objective: text("objective"),
  tone: text("tone").default("tecnico-institucional"),
  language: text("language").default("pt-BR"),
  format: text("format").default("16:9"),
  isPasswordProtected: boolean("is_password_protected").default(true),
  passwordHash: text("password_hash"),
  status: text("status").notNull().default("draft"),
  deckAst: jsonb("deck_ast"),
  slideCount: integer("slide_count").default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertDeckSchema = createInsertSchema(decks).omit({
  id: true,
  createdAt: true,
});

export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type Deck = typeof decks.$inferSelect;

export const slideTypeEnum = z.enum([
  "cover",
  "closing",
  "section_divider",
  "agenda_light",
  "agenda_dark",
  "light_title_text_or_image",
  "light_two_columns",
  "light_chart_text",
  "dark_title_text_or_image",
  "dark_two_columns",
  "dark_chart_text",
  "light_content_layout",
  "dark_content_layout",
  "light_icon_features",
  "dark_icon_features",
]);

export type SlideType = z.infer<typeof slideTypeEnum>;

export const layoutVariantEnum = z.enum([
  "single_col",
  "two_cols_50_50",
  "two_cols_60_40",
  "two_cols_40_60",
  "three_cols_equal",
  "three_cols_emphasis_left",
  "three_cols_emphasis_center",
  "icons_3_horizontal",
  "icons_4_horizontal",
  "icons_3_vertical_with_quote",
  "chart_left_text_right",
  "text_left_chart_right",
]);

export type LayoutVariant = z.infer<typeof layoutVariantEnum>;

export const slotEnum = z.enum([
  "header",
  "main",
  "col_1",
  "col_2",
  "col_3",
  "icon_items",
  "left_emphasis",
  "right_icon_items",
  "chart_area",
  "text_area",
  "left",
  "right",
]);

export type SlotName = z.infer<typeof slotEnum>;

export const componentTypeEnum = z.enum([
  "text_block",
  "image_block",
  "bullet_list",
  "agenda_list",
  "chart_block",
  "contact_block",
  "tag",
  "divider_label",
  "icon_feature_item",
]);

export type ComponentType = z.infer<typeof componentTypeEnum>;

export const iconFeatureItemSchema = z.object({
  iconSrc: z.string().optional(),
  iconName: z.string().optional(),
  title: z.string(),
  text: z.string(),
});

export type IconFeatureItem = z.infer<typeof iconFeatureItemSchema>;

export const slideComponentSchema = z.object({
  id: z.string(),
  componentType: componentTypeEnum,
  slot: z.string().optional(),
  content: z.any(),
  style: z.record(z.string()).optional(),
});

export type SlideComponent = z.infer<typeof slideComponentSchema>;

export const slideLayoutSchema = z.object({
  variant: layoutVariantEnum,
}).optional();

export const slideSchema = z.object({
  id: z.string(),
  type: slideTypeEnum,
  layout: slideLayoutSchema.optional(),
  variant: z.enum(["light", "dark"]).optional(),
  title: z.string().max(90).optional(),
  subtitle: z.string().max(140).optional(),
  notes: z.string().optional(),
  components: z.array(slideComponentSchema),
  backgroundImage: z.string().optional(),
});

export type Slide = z.infer<typeof slideSchema>;

export const deckAstSchema = z.object({
  deckId: z.string(),
  meta: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    themeId: z.string().default("conatus-v1"),
    language: z.string().default("pt-BR"),
    format: z.string().default("16:9"),
    createdAt: z.string(),
    version: z.string().default("1.0.0"),
  }),
  presentation: z.object({
    transition: z.string().default("fade"),
    autoSlide: z.boolean().default(false),
  }),
  slides: z.array(slideSchema),
});

export type DeckAst = z.infer<typeof deckAstSchema>;

export const briefingSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  subtitle: z.string().optional(),
  deckType: z.enum(["treinamento", "projeto", "diretoria", "cliente", "institucional"]),
  audience: z.string().optional(),
  objective: z.string().optional(),
  tone: z.enum(["tecnico-institucional", "didatico", "comercial-leve", "estrategico"]).default("tecnico-institucional"),
  slideCountTarget: z.number().min(3).max(20).default(8),
  structure: z.object({
    includeAgenda: z.boolean().default(true),
    includeSectionDividers: z.boolean().default(true),
    allowLightSlides: z.boolean().default(true),
    allowDarkSlides: z.boolean().default(true),
  }),
  promptNotes: z.string().optional(),
  password: z.string().min(4, "Senha deve ter pelo menos 4 caracteres"),
});

export type Briefing = z.infer<typeof briefingSchema>;
